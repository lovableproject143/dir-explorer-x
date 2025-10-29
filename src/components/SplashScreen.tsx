import { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 500); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Temple Icon */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
          <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-16 h-16 text-primary"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l8-4v18" />
              <path d="M19 21V11l-6-4" />
              <path d="M9 9v.01" />
              <path d="M9 12v.01" />
              <path d="M9 15v.01" />
              <path d="M9 18v.01" />
            </svg>
          </div>
        </div>

        {/* Temple Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Temple Membership
          </h1>
          <p className="text-white/90 text-lg font-medium">
            Join Our Sacred Community
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
