import { useEffect, useState } from "react";

const ElectricAnimation = () => {
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Lightning bolts */}
      {animated && (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              className="absolute animate-lightning"
              style={{
                right: `${10 + i * 16}%`,
                top: `${5 + (i % 3) * 15}%`,
                opacity: 0.15,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${0.6 + (i % 3) * 0.2}s`,
              }}
              width="40"
              height="100"
              viewBox="0 0 40 100"
            >
              <path
                d="M20 0 L10 40 L18 38 L8 100 L30 50 L22 52 L32 10 Z"
                fill="hsl(200, 100%, 60%)"
                className="drop-shadow-lg"
              />
            </svg>
          ))}

          {/* Electric particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`p-${i}`}
              className="absolute w-1 h-1 rounded-full animate-electric-particle"
              style={{
                background: "hsl(200, 100%, 70%)",
                right: `${Math.random() * 90 + 5}%`,
                top: `${Math.random() * 80 + 10}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                boxShadow: "0 0 6px 2px hsl(200, 100%, 60%)",
              }}
            />
          ))}
        </>
      )}

      {/* Subtle electric glow that stays */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          animated ? "opacity-100" : "opacity-30"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, hsl(200 100% 50% / 0.05) 0%, transparent 70%)",
        }}
      />

      <style>{`
        @keyframes lightning-flash {
          0% { opacity: 0; transform: scaleY(0.3); }
          10% { opacity: 0.2; transform: scaleY(1); }
          20% { opacity: 0; transform: scaleY(1); }
          30% { opacity: 0.15; transform: scaleY(1); }
          100% { opacity: 0; transform: scaleY(0.3); }
        }
        .animate-lightning {
          animation: lightning-flash 1s ease-out infinite;
        }
        @keyframes electric-particle {
          0% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(2); }
          100% { opacity: 0; transform: scale(0); }
        }
        .animate-electric-particle {
          animation: electric-particle 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ElectricAnimation;
