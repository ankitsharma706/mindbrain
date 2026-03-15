'use client';
import { useState, useEffect } from 'react';

/**
 * LiveTicker — Horizontally scrolling real-time price marquee.
 * Accepts `prices` from parent (useMarketData hook) rather than managing its own state.
 */

const DISPLAY_ORDER = [
  'gold', 'silver', 'brent', 'wti', 'natgas', 'nifty50', 'banknifty', 'sensex',
  'mcx_gold', 'mcx_crude', 'copper', 'platinum', 'eurusd', 'usdinr', 'gbpusd', 'usdjpy',
];

const SYMBOL_LABELS = {
  gold: 'GOLD', silver: 'SILVER', brent: 'BRENT', wti: 'WTI',
  natgas: 'NAT GAS', nifty50: 'NIFTY 50', banknifty: 'BANKNIFTY', sensex: 'SENSEX',
  mcx_gold: 'MCX GOLD', mcx_crude: 'MCX CRUDE', copper: 'COPPER', platinum: 'PLATINUM',
  eurusd: 'EUR/USD', usdinr: 'USD/INR', gbpusd: 'GBP/USD', usdjpy: 'USD/JPY',
};

function formatPrice(price) {
  if (price >= 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 100) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 10) return price.toFixed(2);
  return price.toFixed(4);
}

export default function LiveTicker({ prices = {} }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Build ticker items from real-time prices
  const tickers = DISPLAY_ORDER
    .filter(id => prices[id])
    .map(id => {
      const p = prices[id];
      const up = (p.change || 0) >= 0;
      return {
        symbol: SYMBOL_LABELS[id] || id.toUpperCase(),
        price: formatPrice(p.price),
        change: `${up ? '+' : ''}${(p.change || 0).toFixed(p.price > 100 ? 2 : 4)}`,
        pct: `${up ? '+' : ''}${(p.pct || 0).toFixed(2)}%`,
        up,
        flash: Math.abs(p.pct || 0) >= 1,
      };
    });

  // Double for seamless scroll
  const tickerText = [...tickers, ...tickers].map((t, i) => (
    <span key={i} style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px', marginRight: '40px',
      animation: t.flash ? 'tickerFlash 0.6s ease' : 'none',
    }}>
      <span style={{
        color: '#8892A4', fontSize: '11px', fontWeight: 600,
        letterSpacing: '1px', fontFamily: "'JetBrains Mono',monospace"
      }}>{t.symbol}</span>
      <span style={{
        color: '#fff', fontSize: '12px', fontWeight: 600,
        fontFamily: "'JetBrains Mono',monospace"
      }}>{t.price}</span>
      <span style={{
        color: t.up ? '#00FF87' : '#FF4757', fontSize: '11px',
        fontFamily: "'JetBrains Mono',monospace",
        textShadow: t.flash ? `0 0 8px ${t.up ? '#00FF87' : '#FF4757'}` : 'none',
      }}>
        {t.change} ({t.pct})
      </span>
      <span style={{ color: 'rgba(255,215,0,0.3)', fontSize: '10px' }}>|</span>
    </span>
  ));

  const hasData = tickers.length > 0;

  return (
    <div className="ticker-wrap" style={{ height: '36px', display: 'flex', alignItems: 'center' }}>
      <div style={{
        background: hasData ? 'linear-gradient(90deg, #FFD700, #FFA500)' : 'linear-gradient(90deg, #666, #888)',
        color: '#000',
        fontWeight: 700,
        fontSize: '10px',
        letterSpacing: '1.5px',
        padding: '0 14px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        zIndex: 10,
        gap: '6px',
      }}>
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: hasData ? '#00FF00' : '#FF0000',
          animation: hasData ? 'pulse 2s ease infinite' : 'none',
          boxShadow: hasData ? '0 0 6px #00FF00' : 'none',
        }} />
        LIVE
      </div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div className="ticker-content">{tickerText}</div>
      </div>
      <div style={{
        padding: '0 14px',
        fontSize: '11px',
        color: '#FFD700',
        fontFamily: "'JetBrains Mono',monospace",
        letterSpacing: '0.5px',
        flexShrink: 0,
        borderLeft: '1px solid rgba(255,215,0,0.15)',
      }}>
        IST {time}
      </div>
    </div>
  );
}
