'use client';
import { useEffect, useState } from 'react';

/**
 * PriceAlertBanner — Animated alert banner for significant price movements.
 */

const SEVERITY_STYLES = {
  CRITICAL: {
    bg: 'rgba(255,20,20,0.12)',
    border: 'rgba(255,20,20,0.4)',
    color: '#FF1414',
    icon: '🚨',
    glow: '0 0 20px rgba(255,20,20,0.3)',
  },
  HIGH: {
    bg: 'rgba(255,71,87,0.10)',
    border: 'rgba(255,71,87,0.35)',
    color: '#FF4757',
    icon: '⚠️',
    glow: '0 0 15px rgba(255,71,87,0.2)',
  },
  MODERATE: {
    bg: 'rgba(255,215,0,0.08)',
    border: 'rgba(255,215,0,0.3)',
    color: '#FFD700',
    icon: '📢',
    glow: '0 0 10px rgba(255,215,0,0.15)',
  },
};

export default function PriceAlertBanner({ alerts = [] }) {
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    // Show only recent un-dismissed alerts (max 3)
    const recent = alerts
      .filter(a => !dismissed.has(a.timestamp))
      .slice(0, 3);
    setVisibleAlerts(recent);

    // Auto-dismiss after 15 seconds
    const timers = recent.map(a =>
      setTimeout(() => {
        setDismissed(prev => new Set([...prev, a.timestamp]));
      }, 15000)
    );

    return () => timers.forEach(clearTimeout);
  }, [alerts, dismissed]);

  if (visibleAlerts.length === 0) return null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '8px',
      marginBottom: '16px',
    }}>
      {visibleAlerts.map((alert, i) => {
        const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.MODERATE;
        const isUp = alert.direction === 'SURGE';

        return (
          <div
            key={alert.timestamp + i}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '12px',
              background: style.bg,
              border: `1px solid ${style.border}`,
              boxShadow: style.glow,
              animation: 'alertSlideIn 0.4s ease-out',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Pulse animation strip */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
              background: style.color,
              animation: 'alertPulse 1.5s ease infinite',
            }} />

            <span style={{ fontSize: '20px', flexShrink: 0, marginLeft: '8px' }}>{style.icon}</span>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '13px', fontWeight: 600, color: '#fff',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {alert.name}
                <span style={{
                  color: isUp ? '#00FF87' : '#FF4757',
                  fontFamily: "'JetBrains Mono',monospace", marginLeft: '8px',
                }}>
                  {isUp ? '▲' : '▼'} {Math.abs(alert.pct).toFixed(2)}%
                </span>
              </p>
              <p style={{ fontSize: '11px', color: '#8892A4', marginTop: '2px' }}>
                {alert.message}
              </p>
            </div>

            <span style={{
              fontSize: '13px', fontWeight: 700, color: style.color,
              fontFamily: "'JetBrains Mono',monospace", flexShrink: 0,
            }}>
              {alert.price?.toLocaleString()}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setDismissed(prev => new Set([...prev, alert.timestamp]));
              }}
              style={{
                background: 'none', border: 'none', color: '#5A6478',
                cursor: 'pointer', fontSize: '16px', padding: '4px',
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
