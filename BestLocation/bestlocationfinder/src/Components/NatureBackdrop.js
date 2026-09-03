function Bird({ className }) {
  return (
    <span className={`flying-bird ${className}`} aria-hidden="true">
      <svg viewBox="0 0 64 28">
        <path className="bird-wing left" d="M32 18C24 7 13 4 3 7c10 2 17 7 23 15" />
        <path className="bird-wing right" d="M32 18C40 7 51 4 61 7c-10 2-17 7-23 15" />
      </svg>
    </span>
  );
}

function NatureBackdrop() {
  return (
    <div className="nature-backdrop" aria-hidden="true">
      <svg className="nature-filters" width="0" height="0">
        <defs>
          <filter id="water-displacement" x="-10%" y="-10%" width="120%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.045" numOctaves="2" seed="3" result="noise">
              <animate attributeName="baseFrequency" dur="7s" values="0.008 0.035;0.012 0.065;0.008 0.035" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="B" />
          </filter>
          <filter id="water-blur"><feGaussianBlur stdDeviation="7" /></filter>
        </defs>
      </svg>

      <div className="waterfall-depth waterfall-depth-back" />
      <div className="waterfall-depth waterfall-depth-front" />
      <div className="waterfall-shine" />
      <div className="sun-glow" />
      <div className="water-mist mist-one" />
      <div className="water-mist mist-two" />
      <div className="water-mist mist-three" />
      <div className="splash-ring splash-one" />
      <div className="splash-ring splash-two" />

      <Bird className="bird-one" />
      <Bird className="bird-two" />
      <Bird className="bird-three" />
    </div>
  );
}

export default NatureBackdrop;
