import React, { useEffect, useState } from 'react';

export function Preloader() {
  const [faded, setFaded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFaded(true);
      setTimeout(() => setHidden(true), 500);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div id="preloader" className={faded ? 'fade-out' : ''}>
      <div className="preloader-emblem">
        <i className="fa-solid fa-building-columns"></i>
      </div>
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: '1px', fontSize: '1.4rem' }}>
        MPLADS AI MONITORING ENGINE
      </h2>
      <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '0.3rem' }}>
        Ministry of Statistics & Programme Implementation · Govt of India
      </p>
      <div className="loader-bar">
        <div className="loader-progress"></div>
      </div>
    </div>
  );
}

export default Preloader;
