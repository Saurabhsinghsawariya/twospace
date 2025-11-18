"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Mic, Phone, PhoneOff, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type Peer from "peerjs";

interface VideoCallProps {
  myId: string;
  partnerId: string;
}

export default function VideoCall({ myId, partnerId }: VideoCallProps) {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState("");
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<"video" | "audio">("video"); // <--- New State
  
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<any>(null);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);

  /** --------------------------------------
   * FIX: Delayed PeerJS Init
   * We wait 1s before connecting to let any old connections close.
   * ---------------------------------------*/
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!myId) return;

    let peerInstance: Peer | null = null;
    let timer: NodeJS.Timeout;

    const init = async () => {
      try {
        const { default: Peer } = await import("peerjs");
        const cleanId = String(myId).trim();

        if (!cleanId) return;

        // Initialize Peer with explicit config
        peerInstance = new Peer(cleanId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
              { urls: "stun:global.stun.twilio.com:3478" }
            ]
          }
        });

        peerInstance.on("open", (id) => {
          console.log("✅ Peer Connected:", id);
          setPeerId(id);
          setPeer(peerInstance);
        });

        // 📞 HANDLE INCOMING
        peerInstance.on("call", (call) => {
          console.log("📞 Incoming Call...");
          // Check metadata to see if it is video or audio
          const type = call.metadata?.type || "video";
          setCallType(type);
          
          setIsIncomingCall(true);
          setIncomingCall(call);
        });

        peerInstance.on("error", (err: any) => {
          if (err.type === "unavailable-id") {
            console.warn("⚠️ ID Taken (Dev Mode Race Condition) - waiting...");
          } else if (err.type === "peer-unavailable") {
            toast.error("Partner is offline or unreachable");
          } else {
            console.error("Peer Error:", err);
          }
        });
      } catch (err) {
        console.error("Peer creation failed:", err);
      }
    };

    // ⏳ DELAY: Wait 1 second before connecting
    timer = setTimeout(() => {
      init();
    }, 1000);

    return () => {
      clearTimeout(timer);
      try {
        if (peerInstance) {
          peerInstance.destroy();
        }
      } catch (e) {
        console.warn("Peer cleanup warning:", e);
      }
    };
  }, [myId]);

  /** --------------------------------------
   * HELPER: Get Media Stream
   * ---------------------------------------*/
  const getStream = async (type: "video" | "audio") => {
    return navigator.mediaDevices.getUserMedia({ 
      video: type === "video", // False if audio call
      audio: true 
    });
  };

  /** --------------------------------------
   * Answer Incoming Call
   * ---------------------------------------*/
  const answerCall = () => {
    if (!incomingCall) return;

    // Answer using the same type (Audio or Video)
    getStream(callType)
      .then((stream) => {
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;

        incomingCall.answer(stream);
        setIsIncomingCall(false);
        setIsCallActive(true);

        incomingCall.on("stream", (remoteStream: MediaStream) => {
          if (partnerVideoRef.current)
            partnerVideoRef.current.srcObject = remoteStream;
        });
      })
      .catch(() => toast.error("Permission denied"));
  };

  /** --------------------------------------
   * Start Outgoing Call
   * ---------------------------------------*/
  const startCall = (type: "video" | "audio") => {
    if (!peerId || !peer) {
      toast.error("Still connecting… please wait for green dot.");
      return;
    }

    setCallType(type); // Set state locally
    const cleanPartnerId = String(partnerId).trim();

    getStream(type)
      .then((stream) => {
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;

        setIsCallActive(true);

        // Pass metadata so they know it's audio/video
        const call = peer.call(cleanPartnerId, stream, {
            metadata: { type } 
        });

        if (!call) {
          toast.error("Call failed to initiate.");
          return;
        }

        call.on("stream", (remoteStream: MediaStream) => {
          if (partnerVideoRef.current)
            partnerVideoRef.current.srcObject = remoteStream;
        });

        call.on("error", (err) => {
          console.error("Call error:", err);
          toast.error("Call connection failed");
          setIsCallActive(false);
        });

        call.on("close", () => {
          endCall(); 
        });
      })
      .catch((err) => {
        console.error("Media Error:", err);
        toast.error("Permission denied");
      });
  };

  /** --------------------------------------
   * End Call
   * ---------------------------------------*/
  const endCall = () => {
    const myStream = myVideoRef.current?.srcObject as MediaStream;
    if (myStream) myStream.getTracks().forEach((t) => t.stop());

    setIsIncomingCall(false);
    setIsCallActive(false);
    
    window.location.reload();
  };

  /** --------------------------------------
   * UI: ACTIVE CALL
   * ---------------------------------------*/
  if (isCallActive) {
    return (
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[999]">
        <div className="relative w-full max-w-md md:max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700 flex flex-col items-center justify-center">
          
          {/* RENDER: Video or Audio Placeholder */}
          {callType === "video" ? (
            <>
                {/* Remote Video */}
                <video ref={partnerVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {/* My PIP Video */}
                <div className="absolute bottom-20 right-6 w-32 aspect-video rounded-lg overflow-hidden border border-white/20 shadow-xl bg-gray-800">
                    <video ref={myVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                </div>
            </>
          ) : (
            /* Audio Call UI */
            <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="w-32 h-32 rounded-full bg-pink-600 flex items-center justify-center shadow-2xl shadow-pink-500/20">
                    <Mic className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-wide">Voice Call Active</h2>
                <div className="text-gray-400 text-sm">Connected</div>
                {/* Hidden videos to play audio stream */}
                <video ref={partnerVideoRef} autoPlay className="hidden" />
                <video ref={myVideoRef} autoPlay muted className="hidden" />
            </div>
          )}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <Button onClick={endCall} variant="destructive" className="rounded-full h-16 w-16 shadow-xl hover:scale-110 transition flex flex-col gap-1">
              <PhoneOff className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /** --------------------------------------
   * UI: INCOMING CALL
   * ---------------------------------------*/
  if (isIncomingCall) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white shadow-md rounded-xl border border-pink-200 animate-bounce">
        <div className="flex items-center gap-2 text-pink-700 font-bold">
          {callType === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />} 
          Incoming {callType === 'video' ? "Video" : "Voice"} Call...
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={answerCall}>Answer</Button>
        <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setIsIncomingCall(false)}>Ignore</Button>
      </div>
    );
  }

  /** --------------------------------------
   * UI: IDLE (Buttons)
   * ---------------------------------------*/
  return (
    <div className="flex items-center gap-2">
      <div 
        className={`w-2 h-2 rounded-full ${peerId ? "bg-green-500" : "bg-yellow-400 animate-pulse"}`} 
        title={peerId ? "Ready" : "Connecting..."} 
      />
      
      {/* Voice Call Button */}
      <Button
        onClick={() => startCall("audio")}
        disabled={!peerId}
        variant="outline"
        size="icon"
        className="rounded-full border-pink-200 text-pink-600 hover:bg-pink-50"
        title="Voice Call"
      >
         <Phone className="h-4 w-4" />
      </Button>

      {/* Video Call Button */}
      <Button
        onClick={() => startCall("video")}
        disabled={!peerId}
        variant="outline"
        className="gap-2 border-pink-200 text-pink-600 hover:bg-pink-50 rounded-full"
      >
        {peerId ? <Video className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
        <span className="hidden sm:inline">Video Call</span>
      </Button>
    </div>
  );
}