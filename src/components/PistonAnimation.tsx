import { useEffect, useState } from "react";

const PistonAnimation = () => {
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Multiple pistons across the background */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            right: `${15 + i * 18}%`,
            top: "10%",
            opacity: 0.07 + i * 0.01,
          }}
        >
          <svg
            width="60"
            height="160"
            viewBox="0 0 60 160"
            className="text-primary"
          >
            {/* Cylinder */}
            <rect
              x="5"
              y="0"
              width="50"
              height="120"
              rx="4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* Piston head */}
            <rect
              x="10"
              y={animated ? "20" : "50"}
              width="40"
              height="20"
              rx="3"
              fill="currentColor"
              className={animated ? "animate-piston" : ""}
            />
            {/* Connecting rod */}
            <line
              x1="30"
              y1={animated ? "40" : "70"}
              x2="30"
              y2="130"
              stroke="currentColor"
              strokeWidth="3"
              className={animated ? "animate-piston" : ""}
            />
            {/* Crankshaft circle */}
            <circle
              cx="30"
              cy="140"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="30" cy="140" r="4" fill="currentColor" />
          </svg>
        </div>
      ))}

      {/* Animated engine heat effect */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent animate-pulse" />
      )}

      <style>{`
        @keyframes piston-move {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(30px); }
        }
        .animate-piston {
          animation: piston-move 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PistonAnimation;
