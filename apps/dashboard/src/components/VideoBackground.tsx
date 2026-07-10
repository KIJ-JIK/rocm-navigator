import React, { useEffect, useRef } from "react";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      
      // Explicitly load and play to bypass React dynamic source mounting delays
      video.load();
      video.play().catch((err) => {
        console.warn("Muted video autoplay blocked on initial load, retrying on interaction:", err);
      });
      
      const handleInteraction = () => {
        if (video.paused) {
          video.play().catch(() => {});
        }
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("keydown", handleInteraction);
      };
      
      window.addEventListener("click", handleInteraction);
      window.addEventListener("keydown", handleInteraction);
      
      return () => {
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("keydown", handleInteraction);
      };
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-35">
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4"
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
        className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.2]"
      />
    </div>
  );
}
