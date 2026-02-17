const PistonAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <svg
        width="200"
        height="280"
        viewBox="0 0 200 280"
        className="opacity-[0.08]"
      >
        {/* Cylinder walls */}
        <rect x="50" y="10" width="100" height="180" rx="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
        
        {/* Cylinder head (top) */}
        <rect x="45" y="5" width="110" height="12" rx="4" fill="hsl(var(--primary))" opacity="0.4" />
        
        {/* Piston head - animated */}
        <rect x="56" y="60" width="88" height="24" rx="4" fill="hsl(var(--primary))" className="animate-piston-move" />
        
        {/* Piston rings */}
        <line x1="58" y1="66" x2="142" y2="66" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.3" className="animate-piston-move" />
        <line x1="58" y1="78" x2="142" y2="78" stroke="hsl(var(--foreground))" strokeWidth="1" opacity="0.3" className="animate-piston-move" />
        
        {/* Connecting rod */}
        <line x1="100" y1="84" x2="100" y2="210" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" className="animate-piston-move" />
        
        {/* Crankshaft housing */}
        <ellipse cx="100" cy="230" rx="50" ry="35" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" />
        
        {/* Crankshaft */}
        <circle cx="100" cy="230" r="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" className="animate-crank-spin" style={{ transformOrigin: '100px 230px' }} />
        <circle cx="100" cy="215" r="5" fill="hsl(var(--primary))" className="animate-crank-spin" style={{ transformOrigin: '100px 230px' }} />
        
        {/* Spark plug */}
        <rect x="94" y="0" width="12" height="20" rx="3" fill="hsl(var(--primary))" opacity="0.6" />
        
        {/* Exhaust heat lines */}
        <path d="M155 100 Q165 95 160 85" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.3" className="animate-heat" />
        <path d="M155 120 Q170 115 165 105" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.2" className="animate-heat" style={{ animationDelay: '0.3s' }} />
      </svg>

      <style>{`
        @keyframes piston-move {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(40px); }
        }
        .animate-piston-move {
          animation: piston-move 1.2s ease-in-out infinite;
        }
        @keyframes crank-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-crank-spin {
          animation: crank-spin 1.2s linear infinite;
        }
        @keyframes heat-rise {
          0% { opacity: 0.3; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-15px); }
        }
        .animate-heat {
          animation: heat-rise 2s ease-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PistonAnimation;
