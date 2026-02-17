const ElectricAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <svg
        width="260"
        height="300"
        viewBox="0 0 260 300"
        className="opacity-20"
      >
        {/* Neon glow filter */}
        <defs>
          <filter id="neon-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-intense" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Large battery outline */}
        <rect x="80" y="50" width="100" height="200" rx="12" fill="none" 
          stroke="hsl(200, 100%, 60%)" strokeWidth="2.5" filter="url(#neon-blue)" />
        {/* Battery cap */}
        <rect x="105" y="38" width="50" height="16" rx="6" fill="none" 
          stroke="hsl(200, 100%, 60%)" strokeWidth="2" filter="url(#neon-blue)" />
        
        {/* Charging fill bars - animate filling */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={`bar-${i}`}
            x="92"
            y={218 - i * 36}
            width="76"
            height="24"
            rx="4"
            fill="hsl(200, 100%, 60%)"
            filter="url(#neon-blue)"
            className="animate-charge-fill"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
        
        {/* Central lightning bolt */}
        <g className="animate-bolt-pulse" style={{ transformOrigin: '130px 150px' }}>
          <path
            d="M140 80 L115 145 L132 145 L110 220 L155 135 L135 135 L155 80 Z"
            fill="hsl(200, 100%, 70%)"
            stroke="hsl(200, 100%, 85%)"
            strokeWidth="1"
            filter="url(#glow-intense)"
          />
        </g>

        {/* Radiating neon electric lines */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <line
            key={angle}
            x1="130"
            y1="150"
            x2={130 + Math.cos((angle * Math.PI) / 180) * 120}
            y2={150 + Math.sin((angle * Math.PI) / 180) * 120}
            stroke="hsl(200, 100%, 65%)"
            strokeWidth="1.5"
            strokeDasharray="3 10"
            filter="url(#neon-blue)"
            className="animate-electric-line"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}

        {/* Arc sparks */}
        {[45, 135, 225, 315].map((angle, i) => (
          <path
            key={`spark-${angle}`}
            d={`M ${130 + Math.cos(((angle - 12) * Math.PI) / 180) * 100} ${150 + Math.sin(((angle - 12) * Math.PI) / 180) * 100} Q ${130 + Math.cos((angle * Math.PI) / 180) * 115} ${150 + Math.sin((angle * Math.PI) / 180) * 115} ${130 + Math.cos(((angle + 12) * Math.PI) / 180) * 100} ${150 + Math.sin(((angle + 12) * Math.PI) / 180) * 100}`}
            fill="none"
            stroke="hsl(180, 100%, 65%)"
            strokeWidth="2"
            filter="url(#neon-blue)"
            className="animate-spark"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}

        {/* Outer neon ring */}
        <circle
          cx="130"
          cy="150"
          r="115"
          fill="none"
          stroke="hsl(200, 100%, 50%)"
          strokeWidth="1"
          strokeDasharray="8 16"
          filter="url(#neon-blue)"
          className="animate-ring-spin"
          style={{ transformOrigin: '130px 150px' }}
        />
      </svg>

      {/* Ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(200 100% 50% / 0.06) 0%, transparent 55%)",
        }}
      />

      <style>{`
        @keyframes charge-fill {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.7; }
        }
        .animate-charge-fill {
          animation: charge-fill 2s ease-in-out infinite;
        }
        @keyframes bolt-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-bolt-pulse {
          animation: bolt-pulse 1.8s ease-in-out infinite;
        }
        @keyframes electric-line {
          0% { stroke-dashoffset: 0; opacity: 0.3; }
          50% { stroke-dashoffset: 26; opacity: 0.8; }
          100% { stroke-dashoffset: 52; opacity: 0.3; }
        }
        .animate-electric-line {
          animation: electric-line 1.5s linear infinite;
        }
        @keyframes spark-flash {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.9; }
        }
        .animate-spark {
          animation: spark-flash 1s ease-in-out infinite;
        }
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-ring-spin {
          animation: ring-spin 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ElectricAnimation;
