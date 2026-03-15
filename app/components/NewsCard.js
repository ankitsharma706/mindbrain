'use client';
import { useState } from 'react';

const NEWS_DATA = [
  {
    id: 1,
    title: 'Fed Signals Possible Rate Cuts in 2024, Gold Surges to Record Highs',
    summary: 'Federal Reserve minutes indicate 3 potential cuts this year. Gold responded with a +$32 move, breaking above key $2,180 resistance level.',
    source: 'Reuters',
    time: '2h ago',
    risk: 'MODERATE',
    impact: ['Gold ↑', 'USD ↓', 'Bonds ↑'],
    url: 'https://www.reuters.com/markets/',
    category: 'Monetary Policy'
  },
  {
    id: 2,
    title: 'OPEC+ Extends Production Cuts — Oil Markets React with 1.2% Gain',
    summary: 'Saudi Arabia and Russia confirmed voluntary cuts through Q2 2024, tightening global supply. WTI crude broke above $81/bbl technical resistance.',
    source: 'Bloomberg',
    time: '3h ago',
    risk: 'HIGH',
    impact: ['Oil ↑', 'INR ↓', 'Inflation ↑'],
    url: 'https://www.bloomberg.com/energy',
    category: 'Energy'
  },
  {
    id: 3,
    title: 'China PMI Data Misses Estimates — Commodities Under Pressure',
    summary: 'China manufacturing PMI came in at 49.1 vs 50.2 expected, signaling contraction. Copper, iron ore, and silver saw selling pressure.',
    source: 'CNBC',
    time: '4h ago',
    risk: 'CRITICAL',
    impact: ['Copper ↓', 'Silver ↓', 'AUD ↓'],
    url: 'https://www.cnbc.com/world-markets/',
    category: 'Macro Data'
  },
  {
    id: 4,
    title: 'NSE Bans 5 Stocks in F&O Segment Due to Excessive Speculation',
    summary: 'SEBI directive causes volatility in mid-cap F&O space. Traders advised to close positions before expiry to avoid penalty.',
    source: 'Economic Times',
    time: '5h ago',
    risk: 'HIGH',
    impact: ['NIFTY ↓', 'VIX ↑'],
    url: 'https://economictimes.indiatimes.com/markets',
    category: 'Indian Markets'
  },
  {
    id: 5,
    title: 'US Dollar Index Falls to 5-Week Low on Weak Jobs Report',
    summary: 'Non-farm payrolls came in at 143k vs 185k expected, reinforcing Fed dovish pivot bets. DXY dropped 0.8%, benefiting emerging market currencies.',
    source: 'FT',
    time: '6h ago',
    risk: 'MODERATE',
    impact: ['INR ↑', 'Gold ↑', 'Oil ↑'],
    url: 'https://www.ft.com/markets',
    category: 'Forex'
  },
  {
    id: 6,
    title: 'Middle East Tensions Ease Slightly — Safe Haven Demand Cools',
    summary: 'Diplomatic negotiations show progress. Gold gave back $15 from intraday highs as risk assets recovered. Oil remains elevated on supply concerns.',
    source: 'Al Jazeera',
    time: '7h ago',
    risk: 'LOW',
    impact: ['Gold ↓', 'Oil steady'],
    url: 'https://www.aljazeera.com/economy/',
    category: 'Geopolitics'
  },
];

const riskColors = {
  CRITICAL: { color: '#FF1414', bg: 'rgba(255,20,20,0.08)', border: 'rgba(255,20,20,0.25)', icon: '🔴' },
  HIGH: { color: '#FF4757', bg: 'rgba(255,71,87,0.08)', border: 'rgba(255,71,87,0.25)', icon: '🟠' },
  MODERATE: { color: '#FFD700', bg: 'rgba(255,215,0,0.06)', border: 'rgba(255,215,0,0.2)', icon: '🟡' },
  LOW: { color: '#00FF87', bg: 'rgba(0,255,135,0.06)', border: 'rgba(0,255,135,0.2)', icon: '🟢' },
};

export default function NewsCard({ data = NEWS_DATA[0], compact = false }) {
  const risk = riskColors[data.risk] || riskColors.MODERATE;
  const leftBorderClass = `risk-${data.risk.toLowerCase()}`;

  return (
    <div
      className={`glass-card ${leftBorderClass}`}
      style={{
        padding: compact ? '14px 16px' : '20px 22px',
        background: risk.bg,
        borderColor: risk.border,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
            color: risk.color, background: `${risk.color}15`,
            border: `1px solid ${risk.color}40`,
            padding: '2px 8px', borderRadius: '5px'
          }}>
            {risk.icon} {data.risk}
          </span>
          <span style={{ fontSize: '10px', color: '#5A6478', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {data.category}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#5A6478', flexShrink: 0 }}>{data.time}</span>
      </div>

      {/* Title */}
      <a href={data.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <h3 style={{
          fontSize: compact ? '13px' : '15px',
          fontWeight: 600,
          color: '#fff',
          lineHeight: 1.5,
          marginBottom: '8px',
          transition: 'color 0.2s',
          cursor: 'pointer',
        }}
          onMouseEnter={e => e.target.style.color = '#FFD700'}
          onMouseLeave={e => e.target.style.color = '#fff'}
        >
          {data.title} ↗
        </h3>
      </a>

      {!compact && (
        <p style={{ fontSize: '13px', color: '#8892A4', lineHeight: 1.6, marginBottom: '12px' }}>
          {data.summary}
        </p>
      )}

      {/* Bottom */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {data.impact && data.impact.map(imp => (
            <span key={imp} style={{
              fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '4px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: imp.includes('↑') ? '#00FF87' : imp.includes('↓') ? '#FF4757' : '#FFD700',
            }}>{imp}</span>
          ))}
        </div>
        <span style={{ fontSize: '11px', color: '#5A6478', fontStyle: 'italic' }}>{data.source}</span>
      </div>
    </div>
  );
}

export { NEWS_DATA };
