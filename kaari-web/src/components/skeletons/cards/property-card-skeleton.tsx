import React from 'react';

export const PropertyCardSkeleton = () => {
  return (
    <div style={{
      width: '100%',
      maxWidth: 320,
      minWidth: 240,
      borderRadius: 16,
      overflow: 'hidden',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <div style={{ width: '100%', paddingTop: '60%', background: 'linear-gradient(90deg,#eee 25%,#f5f5f5 37%,#eee 63%)', backgroundSize: '400% 100%', animation: 'loading 1.4s ease infinite' }} />
      <div style={{ padding: 12 }}>
        <div style={{ height: 18, width: '70%', marginBottom: 8, background: '#eee', borderRadius: 6, animation: 'pulse 1.6s ease-in-out infinite' }} />
        <div style={{ height: 14, width: '50%', marginBottom: 10, background: '#f0f0f0', borderRadius: 6, animation: 'pulse 1.6s ease-in-out infinite' }} />
        <div style={{ height: 14, width: '40%', marginBottom: 12, background: '#f0f0f0', borderRadius: 6, animation: 'pulse 1.6s ease-in-out infinite' }} />
        <div style={{ height: 16, width: '35%', background: '#e9e9e9', borderRadius: 6, animation: 'pulse 1.6s ease-in-out infinite' }} />
      </div>
      <style>{`
        @keyframes loading { 0%{background-position: 100% 50%} 100%{background-position: 0 50%} }
        @keyframes pulse { 0%,100%{opacity:.95} 50%{opacity:.6} }
      `}</style>
    </div>
  );
};


