"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCouple } from "@/hooks/useCouple";
import { useSound } from "@/hooks/useSound";
import { BookHeart, Image as ImageIcon, Loader2, LogOut, Volume2, VolumeX } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import GenerateCode from "./components/GenerateCode";
import JoinCode from "./components/JoinCode";
import VideoCall from "./components/VideoCall";

const ChatWindow = dynamic(() => import("./components/ChatWindow"), {
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-50 rounded-xl">
      <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
    </div>
  ),
  ssr: false,
});

export default function Dashboard() {
  const { user, isLoading, isError, error } = useCouple();
  const { logoutMutation } = useAuth();
  const { isMuted, toggleMute } = useSound("/sounds/notification.mp3");

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-4xl text-pink-600" />
        <p className="text-lg text-gray-500">Loading your space...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4 text-red-500">
        <p>Failed to load data.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
        <Button variant="outline" onClick={() => logoutMutation.mutate()}>Logout</Button>
      </div>
    );
  }

  // SCENARIO 1: User is already in a couple
  if (user?.coupleId) {
    // Waiting for partner
    if (user.coupleId.inviteCode) {
      return (
        <div className="flex h-screen flex-col items-center justify-center space-y-6 bg-slate-50">
           <div className="animate-pulse text-6xl">❤️</div>
           <h1 className="text-2xl font-bold">Waiting for Partner...</h1>
           <div className="rounded-lg bg-white p-6 shadow-lg text-center">
             <p className="text-gray-500 mb-2">Share this code:</p>
             <p className="text-4xl font-mono tracking-widest text-pink-600 font-bold">
               {user.coupleId.inviteCode}
             </p>
           </div>
           <Button variant="ghost" onClick={() => logoutMutation.mutate()}>Logout</Button>
        </div>
      );
    }

    // 🛡️ SAFE PARTNER ID CALCULATION
    // We convert both to String to ensure ObjectId vs String comparison works
    const partnerId = user.coupleId.users.find(
      (id: any) => String(id) !== String(user._id)
    );

    return (
       <div className="container mx-auto max-w-4xl h-screen flex flex-col p-2 md:p-4">
         <header className="flex flex-col gap-4 py-2 mb-2 border-b pb-4">
            
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-pink-600 flex items-center gap-2">
                TwoSpace <span className="text-2xl">❤️</span>
              </h1>
              
              <div className="flex items-center gap-1 md:gap-2">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-5 w-5 text-gray-400" /> : <Volume2 className="h-5 w-5 text-pink-600" />}
                </Button>

                <Link href="/diary">
                  <Button variant="ghost" size="icon">
                    <BookHeart className="h-6 w-6 text-gray-600 hover:text-pink-600" />
                  </Button>
                </Link>

                <Link href="/gallery">
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="h-6 w-6 text-gray-600 hover:text-pink-600" />
                  </Button>
                </Link>

                <Button variant="ghost" size="icon" onClick={() => logoutMutation.mutate()}>
                  <LogOut className="h-5 w-5 text-gray-500 hover:text-red-600" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
               <div className="text-sm text-gray-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Connected as {user.name}
               </div>
               
               {/* 📹 Pass IDs safely */}
               {partnerId && (
                 <VideoCall myId={String(user._id)} partnerId={String(partnerId)} />
               )}
            </div>

         </header>

         <div className="flex-1 overflow-hidden shadow-sm border rounded-xl bg-white">
            <ChatWindow user={user} />
         </div>
       </div>
    );
  }

  // SCENARIO 2: Single User
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6">
          <GenerateCode />
          <div className="text-center text-gray-400">OR</div>
          <JoinCode />
      </div>
    </div>
  );
}