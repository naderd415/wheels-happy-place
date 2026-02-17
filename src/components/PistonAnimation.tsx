const PistonAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <svg
        width="220"
        height="300"
        viewBox="0 0 220 300"
        className="opacity-20"
      >
        {/* Neon glow filter */}
        <defs>
          <filter id="neon-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="fire-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cylinder walls - neon outline */}
        <rect x="55" y="30" width="110" height="170" rx="4" fill="none" 
          stroke="hsl(0, 85%, 55%)" strokeWidth="2" filter="url(#neon-red)" />
        
        {/* Cylinder head */}
        <rect x="50" y="22" width="120" height="14" rx="4" fill="none" 
          stroke="hsl(0, 85%, 55%)" strokeWidth="2" filter="url(#neon-red)" />

        {/* Fire/spark at top when piston reaches up */}
        <g className="animate-fire-flash">
          <circle cx="110" cy="42" r="12" fill="hsl(35, 100%, 55%)" opacity="0.8" filter="url(#fire-glow)" />
          <circle cx="110" cy="42" r="6" fill="hsl(0, 0%, 100%)" opacity="0.9" />
          {/* Small fire lines */}
          <line x1="100" y1="38" x2="95" y2="30" stroke="hsl(35, 100%, 60%)" strokeWidth="2" filter="url(#fire-glow)" />
          <line x1="110" y1="35" x2="110" y2="26" stroke="hsl(20, 100%, 55%)" strokeWidth="2" filter="url(#fire-glow)" />
          <line x1="120" y1="38" x2="125" y2="30" stroke="hsl(35, 100%, 60%)" strokeWidth="2" filter="url(#fire-glow)" />
        </g>

        {/* Piston head - animated */}
        <rect x="60" y="70" width="100" height="26" rx="3" fill="none" 
          stroke="hsl(0, 85%, 60%)" strokeWidth="2.5" filter="url(#neon-red)"
          className="animate-piston-move" />
        
        {/* Piston rings */}
        <line x1="64" y1="76" x2="156" y2="76" stroke="hsl(0, 70%, 50%)" strokeWidth="1" className="animate-piston-move" filter="url(#neon-red)" />
        <line x1="64" y1="90" x2="156" y2="90" stroke="hsl(0, 70%, 50%)" strokeWidth="1" className="animate-piston-move" filter="url(#neon-red)" />
        
        {/* Connecting rod */}
        <line x1="110" y1="96" x2="110" y2="215" stroke="hsl(0, 85%, 55%)" strokeWidth="3" strokeLinecap="round" 
          className="animate-piston-move" filter="url(#neon-red)" />
        
        {/* Crankshaft housing */}
        <ellipse cx="110" cy="240" rx="50" ry="35" fill="none" 
          stroke="hsl(0, 85%, 50%)" strokeWidth="1.5" filter="url(#neon-red)" />
        
        {/* Crankshaft - spinning */}
        <g className="animate-crank-spin" style={{ transformOrigin: '110px 240px' }}>
          <circle cx="110" cy="240" r="22" fill="none" stroke="hsl(0, 85%, 55%)" strokeWidth="2" filter="url(#neon-red)" />
          <circle cx="110" cy="222" r="5" fill="hsl(0, 85%, 60%)" filter="url(#neon-red)" />
          <line x1="110" y1="240" x2="110" y2="222" stroke="hsl(0, 85%, 55%)" strokeWidth="2" filter="url(#neon-red)" />
        </g>
        
        {/* Spark plug at top */}
        <rect x="103" y="8" width="14" height="18" rx="3" fill="none" 
          stroke="hsl(35, 100%, 55%)" strokeWidth="1.5" filter="url(#neon-red)" />
      </svg>

      <style>{`
        @keyframes piston-move {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(45px); }
        }
        .animate-piston-move {
          animation: piston-move 1.4s ease-in-out infinite;
        }
        @keyframes crank-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-crank-spin {
          animation: crank-spin 1.4s linear infinite;
        }
        @keyframes fire-flash {
          0%, 40% { opacity: 0; transform: scale(0.5); }
          45%, 55% { opacity: 1; transform: scale(1); }
          60%, 100% { opacity: 0; transform: scale(0.5); }
        }
        .animate-fire-flash {
          animation: fire-flash 1.4s ease-in-out infinite;
          transform-origin: 110px 42px;
        }
      `}</style>
    </div>
  );
};

export default PistonAnimation;
