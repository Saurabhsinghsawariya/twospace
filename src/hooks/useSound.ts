import { useEffect, useState } from "react";

export const useSound = (soundFile: string) => {
  const [isMuted, setIsMuted] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("twospace_mute");
    if (saved) setIsMuted(JSON.parse(saved));
  }, []);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    localStorage.setItem("twospace_mute", JSON.stringify(newState));
  };

  const play = () => {
    if (!isMuted) {
      const audio = new Audio(soundFile);
      // This catch block suppresses the expected "NotAllowedError" (browser security policy) 
      // when sound attempts to play before the user interacts with the page.
      audio.play().catch((err) => {
        if (err.name !== "NotAllowedError") {
          console.error("Audio error:", err);
        }
      });
    }
  };

  return { isMuted, toggleMute, play };
};