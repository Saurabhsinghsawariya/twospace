"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingHearts() {
  const [hearts, setHearts] = useState<number[]>([]);

  // Expose a function to the window so we can trigger it from anywhere
  useEffect(() => {
    // @ts-ignore
    window.triggerHeart = () => {
      const id = Date.now();
      setHearts((prev) => [...prev, id]);
      // Remove heart after animation
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h !== id));
      }, 2000);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {hearts.map((id) => (
        <motion.div
          key={id}
          initial={{ y: "100vh", x: Math.random() * 100 - 50 + "vw", opacity: 1, scale: 0.5 }}
          animate={{ y: "-10vh", opacity: 0, scale: 1.5 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute bottom-0 text-6xl"
          style={{ left: Math.random() * 80 + 10 + "%" }} // Random horizontal start
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}