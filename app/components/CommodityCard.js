'use client';
import { useState } from 'react';

const SIGNAL_DATA = {
  gold: {
    name: 'Gold',
    symbol: 'XAU/USD',
    icon: '🥇',
    price: 2185.40,
    change: +12.30,
    pct: +0.57,
    signal: 'BUY',
    buyPrice: 2172.00,
    sellPrice: 2220.00,
    stopLoss: 2158.00,
    target: 2240.00,
    support: 2160.00,
    resistance: 2230.00,
    confidence: 'HIGH',
    timeframe: 'SHORT_TERM',
    riskLevel: 'MODERATE',
    reasoning: 'Gold is showing strong bullish momentum with RSI at 62. Fed rate cut expectations and geopolitical tensions supporting upside. Break above $2,195 could trigger rapid move to $2,220 resistance zone.',
    indicators: { rsi: 62, macd: 'Bullish', volume: 'Above Avg', trend: 'Uptrend' }
  },
  silver: {
    name: 'Silver',
    symbol: 'XAG/USD',
    icon: '🥈',
    price: 24.68,
    change: +0.18,
    pct: +0.74,
    signal: 'BUY',
    buyPrice: 24.40,
    sellPrice: 25.80,
    stopLoss: 23.90,
    target: 26.50,
    support: 24.00,
    resistance: 25.80,
    confidence: 'MEDIUM',
    timeframe: 'MEDIUM_TERM',
    riskLevel: 'MODERATE',
    reasoning: 'Silver outperforming gold with higher industrial demand from solar panel sector. Gold/Silver ratio at 88 suggests silver undervalued. Key breakout level at $25.20.',
    indicators: { rsi: 55, macd: 'Weak Bullish', volume: 'Average', trend: 'Sideways-Up' }
  },
  oil: {
    name: 'Crude Oil',
    symbol: 'WTI/USD',
    icon: '🛢️',
    price: 81.24,
    change: -0.52,
    pct: -0.63,
    signal: 'HOLD',
    buyPrice: 79.50,
    sellPrice: 84.50,
    stopLoss: 77.80,
    target: 86.00,
    support: 79.50,
    resistance: 84.50,
    confidence: 'LOW',
    timeframe: 'INTRADAY',
    riskLevel: 'HIGH',
    reasoning: 'Oil facing conflicting signals — OPEC+ cuts supportive but China growth concerns weigh. Waiting for EIA inventory data Wednesday. Avoid new positions until clarity.',
    indicators: { rsi: 48, macd: 'Neutral', volume: 'Below Avg', trend: 'Sideways' }
  }
};

export default function CommodityCard({ type = 'gold', tradeData = null }) {
  const fallbackData = SIGNAL_DATA[type];
  
  // Merge backend data with display formatting if provided
  // Merge backend data with display formatting if provided
  const data = tradeData ? {
    name: tradeData.price?.name || fallbackData.name,
    symbol: tradeData.price?.symbol || fallbackData.symbol,
    icon: tradeData.price?.icon || fallbackData.icon,
    price: tradeData.price?.price || tradeData.price || fallbackData.price,
    change: tradeData.price?.change || (tradeData.price && tradeData.prev ? tradeData.price - tradeData.prev : fallbackData.change),
    pct: tradeData.price?.pct || (tradeData.price && tradeData.prev ? ((tradeData.price - tradeData.prev) / tradeData.prev * 100).toFixed(2) : fallbackData.pct),
    signal: tradeData.signal?.signal || fallbackData.signal,
    buyPrice: tradeData.signal?.buyPrice || fallbackData.buyPrice,
    sellPrice: tradeData.signal?.sellPrice || fallbackData.sellPrice,
    stopLoss: tradeData.signal?.stopLoss || fallbackData.stopLoss,
    target: tradeData.signal?.targetPrice || fallbackData.target,
    support: tradeData.signal?.keyLevels?.support || fallbackData.support,
    resistance: tradeData.signal?.keyLevels?.resistance || fallbackData.resistance,
    confidence: tradeData.signal?.confidence || fallbackData.confidence,
    timeframe: (tradeData.signal?.timeframe || fallbackData.timeframe || '').replace('_', ' '),
    reasoning: tradeData.signal?.reasoning || fallbackData.reasoning,
    indicators: tradeData.signal?.indicators || fallbackData.indicators,
  } : fallbackData;

  const [expanded, setExpanded] = useState(false);

  const signalClass = data.signal === 'BUY' ? 'badge-buy' : data.signal === 'SELL' ? 'badge-sell' : 'badge-hold';
  const priceColor = data.change >= 0 ? '#00FF87' : '#FF4757';
  const glowClass = data.signal === 'BUY' ? 'glow-green' : data.signal === 'SELL' ? 'glow-red' : 'glow-gold';

  return (
    <div
      className={`glass-card ${expanded ? glowClass : ''}`}
      style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.3s ease' }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px'
          }}>{data.icon}</div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', letterSpacing: '0.3px' }}>{data.name}</p>
            <p style={{ fontSize: '11px', color: '#5A6478', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '1px' }}>{data.symbol}</p>
          </div>
        </div>
        <span className={signalClass}>{data.signal}</span>
      </div>

      {/* Price */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '28px', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: '#fff', letterSpacing: '-0.5px' }}>
          ${data.price?.toLocaleString()}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <p style={{ fontSize: '13px', color: priceColor, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>
            {data.change >= 0 ? '▲' : '▼'} {Math.abs(data.change).toFixed(2)} ({data.change >= 0 ? '+' : ''}{data.pct}%)
          </p>
          <span style={{ fontSize: '11px', color: '#5A6478', letterSpacing: '0.5px' }}>1-DAY CHANGE</span>
        </div>
      </div>

      {/* Buy / Sell / Stop */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {[
          { label: 'Buy At', val: `$${data.buyPrice.toLocaleString()}`, color: '#00FF87' },
          { label: 'Sell At', val: `$${data.sellPrice.toLocaleString()}`, color: '#FF4757' },
          { label: 'Stop Loss', val: `$${data.stopLoss.toLocaleString()}`, color: '#FFD700' },
        ].map(item => (
          <div key={item.label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '10px 8px', textAlign: 'center'
          }}>
            <p style={{ fontSize: '10px', color: '#5A6478', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</p>
            <p style={{ fontSize: '13px', fontWeight: 700, color: item.color, fontFamily: "'JetBrains Mono',monospace" }}>{item.val}</p>
          </div>
        ))}
      </div>

      {/* Confidence + Risk */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{
            fontSize: '10px', padding: '3px 8px', borderRadius: '6px', fontWeight: 600, letterSpacing: '0.5px',
            background: data.confidence === 'HIGH' ? 'rgba(0,255,135,0.1)' : data.confidence === 'MEDIUM' ? 'rgba(255,215,0,0.1)' : 'rgba(255,71,87,0.1)',
            color: data.confidence === 'HIGH' ? '#00FF87' : data.confidence === 'MEDIUM' ? '#FFD700' : '#FF4757',
            border: `1px solid ${data.confidence === 'HIGH' ? 'rgba(0,255,135,0.3)' : data.confidence === 'MEDIUM' ? 'rgba(255,215,0,0.3)' : 'rgba(255,71,87,0.3)'}`,
          }}>
            {data.confidence} CONF
          </span>
          <span style={{
            fontSize: '10px', padding: '3px 8px', borderRadius: '6px', fontWeight: 600, letterSpacing: '0.5px',
            background: 'rgba(168,85,247,0.1)', color: '#A855F7',
            border: '1px solid rgba(168,85,247,0.3)',
          }}>
            {data.timeframe.replace('_', ' ')}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#5A6478' }}>{expanded ? '▲ collapse' : '▼ details'}</span>
      </div>

      {/* Support / Resistance Bar */}
      <div style={{ marginBottom: expanded ? '16px' : 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '10px', color: '#5A6478' }}>Support ${data.support.toLocaleString()}</span>
          <span style={{ fontSize: '10px', color: '#5A6478' }}>Resistance ${data.resistance.toLocaleString()}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{
            width: `${((data.price - data.support) / (data.resistance - data.support)) * 100}%`,
            background: 'linear-gradient(90deg, #00FF87, #FFD700, #FF4757)'
          }} />
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', marginTop: '8px' }}>
          {/* AI Reasoning */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '10px', color: '#5A6478', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>🤖 AI Reasoning</p>
            <p style={{ fontSize: '13px', color: '#B8C4D0', lineHeight: 1.7 }}>{data.reasoning}</p>
          </div>

          {/* Indicators */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px', padding: '10px 12px',
            }}>
              <p style={{ fontSize: '10px', color: '#5A6478', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Prev Close</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
                ${((data.price || 0) - (data.change || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            {Object.entries(data.indicators || {}).map(([k, v]) => (
              <div key={k} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px', padding: '10px 12px',
              }}>
                <p style={{ fontSize: '10px', color: '#5A6478', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{k}</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFD700', fontFamily: "'JetBrains Mono',monospace" }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Target */}
          <div style={{ marginTop: '12px', background: 'rgba(0,255,135,0.06)', border: '1px solid rgba(0,255,135,0.15)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#8892A4' }}>🎯 Price Target</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#00FF87', fontFamily: "'JetBrains Mono',monospace" }}>${data.target.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
