import React, { useState } from 'react';
import BottleExperience from './BottleChoreography';
import ClassicStoreApp from './App.tsx';

export default function App() {
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined' && (window.location.pathname.startsWith('/store') || window.location.search.includes('view=store'))) {
      return 'store';
    }
    return 'experience';
  });

  if (viewMode === 'store') {
    return (
      <div className="relative">
        <button
          onClick={() => setViewMode('experience')}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #d4af37, #aa7c11)',
            color: '#000',
            fontWeight: 'bold',
            padding: '12px 20px',
            borderRadius: '30px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            letterSpacing: '1px',
          }}
        >
          3D BESPOKE FLACON
        </button>
        <ClassicStoreApp />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <button
        onClick={() => setViewMode('store')}
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          background: 'rgba(255,255,255,0.08)',
          color: '#d4af37',
          border: '1px solid rgba(212,175,55,0.4)',
          backdropFilter: 'blur(10px)',
          padding: '8px 18px',
          borderRadius: '24px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '1px',
          transition: 'all 0.2s ease',
        }}
        onPointerOver={(e) => {
          e.currentTarget.style.background = '#d4af37';
          e.currentTarget.style.color = '#000';
        }}
        onPointerOut={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = '#d4af37';
        }}
      >
        BROWSE FULL STORE &rarr;
      </button>
      <BottleExperience />
    </div>
  );
}
