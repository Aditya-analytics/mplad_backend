import React from 'react';

export function Loader({ text = 'Loading MPLADS Intelligence Data...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '0.85rem', color: 'var(--text-muted)' }}>
      <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--saffron)' }}></i>
      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{text}</span>
    </div>
  );
}
