'use client';
import Sidebar from '../components/Sidebar';
import LiveTicker from '../components/LiveTicker';
import GlobalMarketHours from '../components/GlobalMarketHours';
import WorldTradeMap from '../components/WorldTradeMap';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const TRADE_DATA = [
  { country: 'China', goldImport: 1400, silvImport: 5200, oilImport: 540, gdp: 17.7 },
  { country: 'India', goldImport: 750, silvImport: 3100, oilImport: 210, gdp: 3.7 },
  { country: 'USA', goldImport: 185, silvImport: 1200, oilImport: 380, gdp: 25.5 },
  { country: 'EU', goldImport: 320, silvImport: 2100, oilImport: 420, gdp: 17.1 },
  { country: 'Japan', goldImport: 120, silvImport: 860, oilImport: 160, gdp: 4.2 },
  { country: 'UAE', goldImport: 600, silvImport: 180, oilImport: 0, gdp: 0.5 },
];

const CURRENCY_PAIRS = [
  { pair: 'USD/INR', rate: '83.42', change: '+0.08', impact: 'High import costs for India', correlation: 'Gold inversely correlated' },
  { pair: 'EUR/USD', rate: '1.0845', change: '+0.0012', impact: 'Affects EU commodity demand', correlation: 'Strong with Gold' },
  { pair: 'USD/JPY', rate: '149.82', change: '-0.35', impact: 'Japan oil import costs', correlation: 'Yen = safe haven' },
  { pair: 'USD/CNH', rate: '7.2156', change: '+0.0045', impact: 'China commodity buying power', correlation: 'Key for base metals' },
  { pair: 'GBP/USD', rate: '1.2748', change: '-0.0021', impact: 'UK energy prices', correlation: 'Moderate' },
  { pair: 'AUD/USD', rate: '0.6542', change: '+0.0018', impact: 'Australia commodities export', correlation: 'Strong with metals' },
];

const SUPPLY_CHAIN = [
  { region: 'OPEC+ (Oil)', share: 40, color: '#F97316' },
  { region: 'Russia (Oil/Gas)', share: 12, color: '#FF4757' },
  { region: 'USA (Shale)', share: 18, color: '#4ECDC4' },
  { region: 'Others', share: 30, color: '#8892A4' },
];

const GOLD_SUPPLY = [
  { region: 'China Mining', share: 11, color: '#FFD700' },
  { region: 'Russia Mining', share: 10, color: '#FFA500' },
  { region: 'Australia', share: 9, color: '#00FF87' },
  { region: 'Canada', share: 6, color: '#4ECDC4' },
  { region: 'Others', share: 64, color: '#5A6478' },
];

const WORLD_EVENTS = [
  { event: 'US Presidential Election Nov 2026', impact: 'HIGH', effect: 'Gold ↑, USD volatile', date: 'Nov 2026' },
  { event: 'OPEC+ Meeting June 2026', impact: 'HIGH', effect: 'Oil ±5%, INR volatility', date: 'Jun 2026' },
  { event: 'Fed Rate Decision May 2026', impact: 'CRITICAL', effect: 'All assets move', date: 'May 2026' },
  { event: 'India Budget Session', impact: 'MODERATE', effect: 'NIFTY volatility ±3%', date: 'Jul 2026' },
  { event: 'China NPC Economic Targets', impact: 'MODERATE', effect: 'Base metals affected', date: 'Mar 2026' },
  { event: 'G20 Finance Ministers Meet', impact: 'LOW', effect: 'USD policy signals', date: 'Apr 2026' },
];

export default function WorldTradePage() {
  const [view, setView] = useState('gold');
  const [activeTab, setActiveTab] = useState('hours');

  const tabs = [
    { key: 'hours', icon: '🕐', label: 'Global Market Hours' },
    { key: 'trade', icon: '📦', label: 'Trade Flows' },
    { key: 'events', icon: '📅', label: 'Events Calendar' },
  ];

  return (
    <div className="hero-bg" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <LiveTicker />
        <div style={{ padding: '32px' }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  border: activeTab === t.key ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  background: activeTab === t.key ? 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,140,0,0.06))' : 'rgba(255,255,255,0.02)',
                  color: activeTab === t.key ? '#FFD700' : '#8892A4',
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ fontSize: '16px' }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* ══ TAB: Global Market Hours ══ */}
          {activeTab === 'hours' && <GlobalMarketHours />}

          {/* ══ TAB: Trade Flows ══ */}
          {activeTab === 'trade' && (
            <>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '6px' }}>
                  📦 <span className="text-gradient-gold">World Trade</span> Flows
                </h1>
                <p style={{ fontSize: '14px', color: '#8892A4' }}>Global commodity trade flows, currency correlations, and supply chains</p>
              </div>

              {/* World Trade Map */}
              <div style={{ marginBottom: '24px' }}>
                <WorldTradeMap />
              </div>

              {/* Import/Export Bar Chart */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="glass-card-static" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk',sans-serif" }}>
                      📦 Global Commodity Imports by Country (Tonnes/Mln bbl)
                    </h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['gold', 'silver', 'oil'].map(v => (
                        <button key={v} onClick={() => setView(v)} style={{
                          padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                          border: view === v ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                          background: view === v ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
                          color: view === v ? '#FFD700' : '#8892A4', transition: 'all 0.2s',
                        }}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={TRADE_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <XAxis dataKey="country" tick={{ fill: '#5A6478', fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: '#5A6478', fontSize: 10 }} tickLine={false} axisLine={false} width={40} />
                      <Tooltip
                        contentStyle={{ background: 'rgba(4,4,15,0.95)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '10px' }}
                        labelStyle={{ color: '#FFD700' }}
                      />
                      <Bar
                        dataKey={view === 'gold' ? 'goldImport' : view === 'silver' ? 'silvImport' : 'oilImport'}
                        radius={[6, 6, 0, 0]}
                        fill={view === 'gold' ? '#FFD700' : view === 'silver' ? '#C0C0C0' : '#F97316'}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Supply pie chart */}
                <div className="glass-card-static" style={{ padding: '24px' }}>
                  <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '16px', fontFamily: "'Space Grotesk',sans-serif" }}>
                    {view === 'oil' ? '🛢️ Oil Supply Sources' : '🥇 Gold Mining Sources'}
                  </h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={view === 'oil' ? SUPPLY_CHAIN : GOLD_SUPPLY}
                        cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                        dataKey="share" paddingAngle={3}
                      >
                        {(view === 'oil' ? SUPPLY_CHAIN : GOLD_SUPPLY).map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v}%`}
                        contentStyle={{ background: 'rgba(4,4,15,0.9)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px' }}>
                    {(view === 'oil' ? SUPPLY_CHAIN : GOLD_SUPPLY).map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '10px', color: '#8892A4' }}>{d.region} ({d.share}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Currency Pairs */}
              <div className="glass-card-static" style={{ padding: '24px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '16px', fontFamily: "'Space Grotesk',sans-serif" }}>
                  💱 Key Currency Pairs & Commodity Correlations
                </h2>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Pair</th>
                        <th>Rate</th>
                        <th>Change</th>
                        <th style={{ textAlign: 'left' }}>Market Impact</th>
                        <th style={{ textAlign: 'left' }}>Correlation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CURRENCY_PAIRS.map((row, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'left', fontWeight: 700, color: '#FFD700', fontSize: '13px' }}>{row.pair}</td>
                          <td style={{ fontWeight: 700, fontSize: '14px' }}>{row.rate}</td>
                          <td style={{ color: row.change.startsWith('+') ? '#00FF87' : '#FF4757', fontWeight: 600 }}>{row.change}</td>
                          <td style={{ textAlign: 'left', color: '#B8C4D0', fontSize: '12px' }}>{row.impact}</td>
                          <td style={{ textAlign: 'left', color: '#8892A4', fontSize: '12px' }}>{row.correlation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ══ TAB: Events Calendar ══ */}
          {activeTab === 'events' && (
            <>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '6px' }}>
                  📅 <span className="text-gradient-gold">Events</span> Calendar
                </h1>
                <p style={{ fontSize: '14px', color: '#8892A4' }}>Upcoming market-moving geopolitical and economic events</p>
              </div>

              <div className="glass-card-static" style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {WORLD_EVENTS.map((ev, i) => {
                    const impactColor = ev.impact === 'CRITICAL' ? '#FF1414' : ev.impact === 'HIGH' ? '#FF4757' : ev.impact === 'MODERATE' ? '#FFD700' : '#00FF87';
                    return (
                      <div key={i} style={{
                        display: 'flex', gap: '16px', alignItems: 'center',
                        background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                        padding: '14px 18px',
                        border: `1px solid ${impactColor}20`,
                        borderLeft: `3px solid ${impactColor}`,
                      }}>
                        <div style={{ flexShrink: 0 }}>
                          <span style={{
                            fontSize: '10px', fontWeight: 700, color: impactColor,
                            background: `${impactColor}15`, border: `1px solid ${impactColor}40`,
                            padding: '3px 8px', borderRadius: '5px', letterSpacing: '0.5px'
                          }}>{ev.impact}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '3px' }}>{ev.event}</p>
                          <p style={{ fontSize: '12px', color: '#8892A4' }}>Expected: <span style={{ color: '#FFD700' }}>{ev.effect}</span></p>
                        </div>
                        <div style={{ flexShrink: 0, fontSize: '12px', color: '#5A6478', fontFamily: "'JetBrains Mono',monospace" }}>
                          {ev.date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
