const ElectricAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <svg
        width="240"
        height="280"
        viewBox="0 0 240 280"
        className="opacity-[0.12]"
      >
        {/* Central battery/bolt symbol */}
        <g className="animate-electric-pulse" style={{ transformOrigin: '120px 140px' }}>
          {/* Lightning bolt - main */}
          <path
            d="M130 40 L95 130 L115 130 L85 240 L150 120 L125 120 L155 40 Z"
            fill="hsl(200, 100%, 60%)"
            stroke="hsl(200, 100%, 70%)"
            strokeWidth="1"
          />
        </g>
        
        {/* Radiating electric lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={angle}
            x1="120"
            y1="140"
            x2={120 + Math.cos((angle * Math.PI) / 180) * 110}
            y2={140 + Math.sin((angle * Math.PI) / 180) * 110}
            stroke="hsl(200, 100%, 60%)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            className="animate-electric-line"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        
        {/* Outer arc sparks */}
        {[30, 110, 200, 290].map((angle, i) => (
          <path
            key={`arc-${angle}`}
            d={`M ${120 + Math.cos(((angle - 15) * Math.PI) / 180) * 95} ${140 + Math.sin(((angle - 15) * Math.PI) / 180) * 95} Q ${120 + Math.cos((angle * Math.PI) / 180) * 108} ${140 + Math.sin((angle * Math.PI) / 180) * 108} ${120 + Math.cos(((angle + 15) * Math.PI) / 180) * 95} ${140 + Math.sin(((angle + 15) * Math.PI) / 180) * 95}`}
            fill="none"
            stroke="hsl(200, 100%, 65%)"
            strokeWidth="2"
            className="animate-spark"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}

        {/* Energy ring */}
        <circle
          cx="120"
          cy="140"
          r="85"
          fill="none"
          stroke="hsl(200, 100%, 55%)"
          strokeWidth="1.5"
          strokeDasharray="6 12"
          className="animate-ring-spin"
          style={{ transformOrigin: '120px 140px' }}
        />
        
        {/* Charging indicator dots */}
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={`dot-${i}`}
            cx={120 + Math.cos(((i * 90 - 90) * Math.PI) / 180) * 95}
            cy={140 + Math.sin(((i * 90 - 90) * Math.PI) / 180) * 95}
            r="4"
            fill="hsl(200, 100%, 65%)"
            className="animate-dot-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </svg>

      {/* Subtle glow */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(200 100% 50% / 0.04) 0%, transparent 60%)",
        }}
      />

      <style>{`
        @keyframes electric-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.85; }
        }
        .animate-electric-pulse {
          animation: electric-pulse 2s ease-in-out infinite;
        }
        @keyframes electric-line {
          0% { stroke-dashoffset: 0; opacity: 0.4; }
          50% { stroke-dashoffset: 24; opacity: 0.8; }
          100% { stroke-dashoffset: 48; opacity: 0.4; }
        }
        .animate-electric-line {
          animation: electric-line 1.5s linear infinite;
        }
        @keyframes spark-flash {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
        .animate-spark {
          animation: spark-flash 1.2s ease-in-out infinite;
        }
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-ring-spin {
          animation: ring-spin 8s linear infinite;
        }
        @keyframes dot-pulse {
          0%, 100% { r: 3; opacity: 0.4; }
          50% { r: 6; opacity: 1; }
        }
        .animate-dot-pulse {
          animation: dot-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ElectricAnimation;
