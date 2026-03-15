'use client';
import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STATUS_CONFIG = {
  'OPEN':        { color: '#00FF87', bg: 'rgba(0,255,135,0.08)',  border: 'rgba(0,255,135,0.25)', label: '● OPEN',        glow: '0 0 12px rgba(0,255,135,0.3)' },
  'CLOSING-SOON':{ color: '#FFD700', bg: 'rgba(255,215,0,0.08)',  border: 'rgba(255,215,0,0.25)', label: '⏳ CLOSING SOON', glow: '0 0 12px rgba(255,215,0,0.3)' },
  'PRE-MARKET':  { color: '#FBBF24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)',label: '◐ PRE-MARKET',  glow: 'none' },
  'AFTER-HOURS': { color: '#A78BFA', bg: 'rgba(167,139,250,0.08)',border: 'rgba(167,139,250,0.25)',label: '◑ AFTER-HOURS', glow: 'none' },
  'LUNCH-BREAK': { color: '#F97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)',label: '🍜 LUNCH BREAK', glow: 'none' },
  'CLOSED':      { color: '#FF4757', bg: 'rgba(255,71,87,0.05)',  border: 'rgba(255,71,87,0.15)', label: '○ CLOSED',      glow: 'none' },
};

function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG['CLOSED'];
}

// ─── Miniature world map with dots ─────────────────────────────────────────────
function WorldMapDots({ markets }) {
  // Convert lat/lng to SVG position (simple equirectangular projection)
  function project(lat, lng) {
    const x = ((lng + 180) / 360) * 900;
    const y = ((90 - lat) / 180) * 440;
    return { x, y };
  }

  return (
    <svg viewBox="0 0 900 440" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {/* Subtle grid lines */}
      {[0, 90, 180, 270, 360, 450, 540, 630, 720, 810, 900].map(x => (
        <line key={`v${x}`} x1={x} y1={0} x2={x} y2={440} stroke="rgba(255,255,255,0.03)" />
      ))}
      {[0, 88, 176, 264, 352, 440].map(y => (
        <line key={`h${y}`} x1={0} y1={y} x2={900} y2={y} stroke="rgba(255,255,255,0.03)" />
      ))}

      {/* Equator */}
      <line x1={0} y1={220} x2={900} y2={220} stroke="rgba(255,215,0,0.06)" strokeDasharray="4 4" />

      {/* Exchange dots */}
      {markets.map((m, i) => {
        if (!m.lat || !m.lng) return null;
        const { x, y } = project(m.lat, m.lng);
        const cfg = getStatusConfig(m.status);
        const isOpen = m.status === 'OPEN' || m.status === 'CLOSING-SOON';

        return (
          <g key={i}>
            {/* Pulse ring for open markets */}
            {isOpen && (
              <circle cx={x} cy={y} r={12} fill="none" stroke={cfg.color} strokeWidth={1} opacity={0.3}>
                <animate attributeName="r" values="8;18;8" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Main dot */}
            <circle
              cx={x} cy={y} r={isOpen ? 5 : 3.5}
              fill={cfg.color}
              stroke={isOpen ? cfg.color : 'none'}
              strokeWidth={isOpen ? 1.5 : 0}
              opacity={isOpen ? 1 : 0.5}
              style={{ filter: isOpen ? `drop-shadow(0 0 6px ${cfg.color})` : 'none' }}
            />
            {/* Label */}
            <text
              x={x} y={y - (isOpen ? 10 : 7)}
              textAnchor="middle"
              fill={isOpen ? '#fff' : '#5A6478'}
              fontSize={isOpen ? 9 : 7}
              fontWeight={isOpen ? 700 : 400}
              fontFamily="'Space Grotesk',sans-serif"
            >
              {m.shortName}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Summary Cards ─────────────────────────────────────────────────────────────
function SummaryCards({ summary }) {
  const cards = [
    { label: 'Markets Open', value: summary.open || 0, icon: '🟢', color: '#00FF87' },
    { label: 'Closed', value: summary.closed || 0, icon: '🔴', color: '#FF4757' },
    { label: 'Pre-Market', value: summary.preMarket || 0, icon: '🟡', color: '#FBBF24' },
    { label: 'After-Hours', value: summary.afterHours || 0, icon: '🟣', color: '#A78BFA' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
      {cards.map((c, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${c.color}25`,
          borderRadius: '14px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>{c.icon}</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: c.color, fontFamily: "'JetBrains Mono',monospace" }}>{c.value}</div>
          <div style={{ fontSize: '11px', color: '#5A6478', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Exchange Table ────────────────────────────────────────────────────────────
function ExchangeTable({ markets, filter }) {
  const filtered = filter === 'all' ? markets : markets.filter(m => {
    if (filter === 'open') return m.status === 'OPEN' || m.status === 'CLOSING-SOON';
    if (filter === 'closed') return m.status === 'CLOSED';
    if (filter === 'other') return m.status === 'PRE-MARKET' || m.status === 'AFTER-HOURS' || m.status === 'LUNCH-BREAK';
    return true;
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
        <thead>
          <tr>
            {['Exchange', 'Country', 'Local Time', 'Open (IST)', 'Close (IST)', 'Status', 'Info'].map(h => (
              <th key={h} style={{
                textAlign: h === 'Exchange' || h === 'Country' ? 'left' : 'center',
                padding: '10px 14px',
                fontSize: '10px',
                fontWeight: 700,
                color: '#5A6478',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((m, i) => {
            const cfg = getStatusConfig(m.status);
            return (
              <tr key={i} style={{
                background: cfg.bg,
                borderLeft: `3px solid ${cfg.color}`,
                transition: 'all 0.3s ease',
              }}>
                <td style={{ padding: '14px 16px', borderRadius: '12px 0 0 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: `${m.color || cfg.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', flexShrink: 0,
                    }}>{m.flag}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{m.exchange}</div>
                      <div style={{ fontSize: '10px', color: '#5A6478', fontFamily: "'JetBrains Mono',monospace" }}>{m.shortName}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: '#B8C4D0' }}>{m.country}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: '#8892A4' }}>{m.localTime}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 600, color: '#00FF87' }}>{m.openIST}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: '13px', fontWeight: 600, color: '#FF4757' }}>{m.closeIST}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', borderRadius: '0 12px 12px 0' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.8px',
                    color: cfg.color,
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    boxShadow: cfg.glow,
                    whiteSpace: 'nowrap',
                  }}>{cfg.label}</span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: '11px', color: '#5A6478' }}>
                  {m.status === 'CLOSING-SOON' && m.closingInMinutes != null && (
                    <span style={{ color: '#FFD700' }}>Closes in {m.closingInMinutes}m</span>
                  )}
                  {m.status === 'CLOSED' && m.openingInMinutes != null && (
                    <span>Opens in {m.openingInMinutes}m</span>
                  )}
                  {m.lunchBreak && m.status === 'LUNCH-BREAK' && (
                    <span style={{ color: '#F97316' }}>Until {m.lunchBreak.endIST}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Time Zone Clock ───────────────────────────────────────────────────────────
function TimeZoneClocks({ markets }) {
  // Pick 6 representative exchanges for the clock display
  const picks = ['JPX', 'SSE', 'NSE', 'XETRA', 'LSE', 'NYSE'];
  const clockMarkets = picks.map(s => markets.find(m => m.shortName === s)).filter(Boolean);

  return (
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
      {clockMarkets.map((m, i) => {
        const cfg = getStatusConfig(m.status);
        return (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${cfg.border}`,
            borderRadius: '14px',
            padding: '14px 18px',
            textAlign: 'center',
            minWidth: '120px',
          }}>
            <div style={{ fontSize: '20px', marginBottom: '4px' }}>{m.flag}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: cfg.color, letterSpacing: '0.5px' }}>{m.shortName}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono',monospace", margin: '6px 0' }}>{m.localTime}</div>
            <div style={{
              fontSize: '9px', fontWeight: 700, color: cfg.color, letterSpacing: '1px',
              padding: '3px 8px', borderRadius: '6px', background: cfg.bg,
            }}>{cfg.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function GlobalMarketHours() {
  const [markets, setMarkets] = useState([]);
  const [summary, setSummary] = useState({ total: 0, open: 0, closed: 0, preMarket: 0, afterHours: 0 });
  const [filter, setFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/market-hours`);
      const data = await res.json();
      if (data.markets) {
        setMarkets(data.markets);
        setSummary(data.summary);
        setLastUpdate(new Date().toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        }));
      }
    } catch (err) {
      console.error('[MarketHours] Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '12px' }}>🌍</div>
        <div style={{ color: '#5A6478', fontSize: '14px' }}>Loading global market hours...</div>
      </div>
    );
  }

  const filters = [
    { key: 'all',    label: 'All Markets',  count: markets.length },
    { key: 'open',   label: 'Open',         count: summary.open },
    { key: 'closed', label: 'Closed',       count: summary.closed },
    { key: 'other',  label: 'Pre/After',    count: (summary.preMarket || 0) + (summary.afterHours || 0) + (summary.lunchBreak || 0) },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '6px' }}>
            🌍 <span className="text-gradient-gold">Global Market Hours</span>
          </h1>
          <p style={{ fontSize: '14px', color: '#8892A4' }}>
            Real-time exchange status across {markets.length} major markets • Auto-converted to IST
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,255,135,0.06)', border: '1px solid rgba(0,255,135,0.2)',
          borderRadius: '10px', padding: '8px 14px',
        }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: '11px', color: '#00FF87', fontWeight: 600 }}>
            Updated {lastUpdate}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* World Map */}
      <div className="glass-card-static" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk',sans-serif" }}>
            🗺️ Global Exchange Map
          </h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: 'Open', color: '#00FF87' },
              { label: 'Pre-Market', color: '#FBBF24' },
              { label: 'Closed', color: '#FF4757' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: '10px', color: '#5A6478' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: '260px', position: 'relative' }}>
          <WorldMapDots markets={markets} />
        </div>
      </div>

      {/* Time Zone Clocks */}
      <TimeZoneClocks markets={markets} />

      {/* Filter Tabs + Exchange Table */}
      <div className="glass-card-static" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk',sans-serif" }}>
            ⚡ Exchange Details
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.3px',
                  border: filter === f.key ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  background: filter === f.key ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
                  color: filter === f.key ? '#FFD700' : '#8892A4',
                  transition: 'all 0.2s',
                }}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>
        <ExchangeTable markets={markets} filter={filter} />
      </div>
    </div>
  );
}
