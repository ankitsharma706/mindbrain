'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', icon: '⚡', label: 'Dashboard' },
  { href: '/commodities', icon: '🥇', label: 'Commodities' },
  { href: '/options-chain', icon: '📊', label: 'Options Chain' },
  { href: '/crash-radar', icon: '🚨', label: 'Crash Radar' },
  { href: '/news', icon: '📰', label: 'Market News' },
  { href: '/world-trade', icon: '🌍', label: 'World Trade' },
  { href: '/signals', icon: '🎯', label: 'AI Signals' },
  { href: '/alerts', icon: '📧', label: 'Email Alerts' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    };
    checkAuth();
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-[100] md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          background: 'rgba(255,215,0,0.15)',
          border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: '10px',
          padding: '10px',
          color: '#FFD700',
          fontSize: '18px',
          cursor: 'pointer',
        }}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{
          transform: mobileOpen ? 'translateX(0)' : undefined,
          display: mobileOpen ? 'block' : undefined,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,215,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', flexShrink: 0
            }}>📈</div>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '16px', color: '#FFD700' }}>MarketMind</p>
              <p style={{ fontSize: '10px', color: '#5A6478', letterSpacing: '1.5px', textTransform: 'uppercase' }}>AI Platform</p>
            </div>
          </div>

          {/* Live indicator */}
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot" />
            <span style={{ fontSize: '11px', color: '#00FF87', fontWeight: 600, letterSpacing: '0.5px' }}>LIVE MARKETS ACTIVE</span>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: '16px 12px' }}>
          <p className="section-label" style={{ padding: '8px 12px 12px' }}>Navigation</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  marginBottom: '4px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,140,0,0.06))' : 'transparent',
                  border: isActive ? '1px solid rgba(255,215,0,0.2)' : '1px solid transparent',
                  color: isActive ? '#FFD700' : '#8892A4',
                }}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                {isActive && (
                  <div style={{
                    marginLeft: 'auto',
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: '#FFD700',
                    boxShadow: '0 0 8px rgba(255,215,0,0.8)'
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom info */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,215,0,0.1)',
          background: 'rgba(4,4,15,0.8)',
        }}>
          {user ? (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: '#B8C4D0', marginBottom: '4px' }}>Logged in as</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFD700' }}>{user.name}</p>
                <button
                  onClick={handleLogout}
                  style={{ background: 'transparent', border: '1px solid rgba(255,71,87,0.4)', color: '#FF4757', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
              <Link href="/login" style={{ flex: 1, display: 'block', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.1))', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>
                Sign In
              </Link>
              
            </div>
          )}
          <div style={{ fontSize: '11px', color: '#5A6478', marginBottom: '6px' }}>Powered by</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Gemini AI', 'NSE API', 'NewsAPI'].map(t => (
              <span key={t} style={{
                background: 'rgba(255,215,0,0.08)',
                border: '1px solid rgba(255,215,0,0.15)',
                color: '#FFD700',
                fontSize: '10px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '0.5px',
              }}>{t}</span>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
