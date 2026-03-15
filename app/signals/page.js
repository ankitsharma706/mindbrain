'use client';
import Sidebar from '../components/Sidebar';
import LiveTicker from '../components/LiveTicker';
import { useState, useEffect, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const REFRESH_MS = 60_000; // 60 seconds
const RETRY_MS = 5_000;

const ASSET_FILTERS = ['All', 'COMMODITY', 'INDEX'];
const SIGNAL_FILTERS = ['All', 'BUY', 'SELL', 'HOLD'];

export default function SignalsPage() {
  const [assetFilter, setAssetFilter] = useState('All');
  const [signalFilter, setSignalFilter] = useState('All');
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const retryRef = useRef(null);

  useEffect(() => {
    let iv;
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/signals`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        // Transform the backend signals object into a displayable array
        const signalList = [];
        const sigs = json.signals || {};
        const ts = json.timestamp || new Date().toISOString();
        const dateStr = new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const timeStr = new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        const assetMeta = {
          gold:     { name: 'Gold',        icon: '🥇', type: 'COMMODITY', symbol: 'XAU/USD' },
          silver:   { name: 'Silver',      icon: '🥈', type: 'COMMODITY', symbol: 'XAG/USD' },
          oil:      { name: 'Crude Oil',   icon: '🛢️', type: 'COMMODITY', symbol: 'WTI/USD' },
          gas:      { name: 'Natural Gas', icon: '🔥', type: 'COMMODITY', symbol: 'NG/USD' },
          copper:   { name: 'Copper',      icon: '🪙', type: 'COMMODITY', symbol: 'HG/USD' },
          platinum: { name: 'Platinum',    icon: '💎', type: 'COMMODITY', symbol: 'XPT/USD' },
        };

        Object.entries(sigs).forEach(([key, sig], idx) => {
          const meta = assetMeta[key] || { name: key, icon: '📊', type: 'COMMODITY', symbol: key.toUpperCase() };
          signalList.push({
            id: idx + 1,
            date: dateStr,
            time: timeStr,
            asset: meta.name,
            icon: meta.icon,
            symbol: meta.symbol,
            type: meta.type,
            signal: sig.signal || 'HOLD',
            entry: sig.buyPrice || 0,
            target: sig.targetPrice || sig.sellPrice || 0,
            sl: sig.stopLoss || 0,
            confidence: sig.confidence || 'MEDIUM',
            timeframe: (sig.timeframe || 'SHORT_TERM').replace('_', ' '),
            riskLevel: sig.riskLevel || 'MODERATE',
            reasoning: sig.reasoning || '',
            source: sig.source || 'BACKEND',
            status: 'ACTIVE',
            indicators: sig.indicators || {},
            support: sig.keyLevels?.support || 0,
            resistance: sig.keyLevels?.resistance || 0,
          });
        });

        setSignals(signalList);
        setLastUpdate(ts);
        setError(null);
        setLoading(false);
        if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null; }
      } catch (err) {
        console.error('[Signals] fetch failed:', err.message);
        setError('Unable to load market data. Retrying...');
        setLoading(false);
        retryRef.current = setTimeout(fetchData, RETRY_MS);
      }
    };
    fetchData();
    iv = setInterval(fetchData, REFRESH_MS);
    return () => { clearInterval(iv); if (retryRef.current) clearTimeout(retryRef.current); };
  }, []);

  const filtered = signals.filter(s => {
    return (
      (assetFilter === 'All' || s.type === assetFilter) &&
      (signalFilter === 'All' || s.signal === signalFilter)
    );
  });

  const buyCount = signals.filter(s => s.signal === 'BUY').length;
  const sellCount = signals.filter(s => s.signal === 'SELL').length;
  const holdCount = signals.filter(s => s.signal === 'HOLD').length;

  return (
    <div className="hero-bg" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <LiveTicker />
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '6px' }}>
              🎯 <span className="text-gradient-gold">AI Signals</span> Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#8892A4' }}>
              All AI-generated buy/sell/hold signals with reasoning, confidence, and live backend data
              {lastUpdate && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#5A6478' }}>• Updated {new Date(lastUpdate).toLocaleTimeString('en-IN')}</span>}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span style={{ fontSize: '13px', color: '#FF4757' }}>{error}</span>
            </div>
          )}

          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {[
              { label: 'Total Signals', val: signals.length, color: '#FFD700', icon: '⚡', bg: 'rgba(255,215,0,0.08)' },
              { label: 'BUY Signals', val: buyCount, color: '#00FF87', icon: '📈', bg: 'rgba(0,255,135,0.08)' },
              { label: 'SELL Signals', val: sellCount, color: '#FF4757', icon: '📉', bg: 'rgba(255,71,87,0.05)' },
              { label: 'HOLD Signals', val: holdCount, color: '#FFD700', icon: '⏸️', bg: 'rgba(255,215,0,0.06)' },
            ].map(m => (
              <div key={m.label} style={{ background: m.bg, border: `1px solid ${m.color}25`, borderRadius: '14px', padding: '18px 20px' }}>
                <p style={{ fontSize: '22px', marginBottom: '8px' }}>{m.icon}</p>
                <p style={{ fontSize: '26px', fontWeight: 800, color: m.color, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{m.val}</p>
                <p style={{ fontSize: '12px', color: '#8892A4', marginTop: '4px' }}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#5A6478', alignSelf: 'center', marginRight: '2px' }}>Type:</span>
              {ASSET_FILTERS.map(f => (
                <button key={f} onClick={() => setAssetFilter(f)} style={{
                  padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                  border: assetFilter === f ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  background: assetFilter === f ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
                  color: assetFilter === f ? '#FFD700' : '#8892A4', transition: 'all 0.2s',
                }}>{f}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#5A6478', alignSelf: 'center', marginRight: '2px' }}>Signal:</span>
              {SIGNAL_FILTERS.map(f => (
                <button key={f} onClick={() => setSignalFilter(f)} style={{
                  padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                  border: signalFilter === f ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  background: signalFilter === f ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
                  color: signalFilter === f ? '#FFD700' : '#8892A4', transition: 'all 0.2s',
                }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {loading && signals.length === 0 && (
            <div className="glass-card-static" style={{ padding: '40px', textAlign: 'center' }}>
              <div className="loader" style={{ margin: '0 auto 20px' }} />
              <p style={{ color: '#8892A4' }}>Loading AI signals from backend...</p>
            </div>
          )}

          {/* Signal cards */}
          <div style={{ display: 'grid', gap: '14px' }}>
            {filtered.map(sig => {
              const sColor = sig.signal === 'BUY' ? '#00FF87' : sig.signal === 'SELL' ? '#FF4757' : '#FFD700';

              return (
                <div key={sig.id} className="glass-card-static" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Signal badge */}
                    <div style={{
                      background: `${sColor}15`, border: `2px solid ${sColor}50`,
                      borderRadius: '12px', padding: '14px 18px', textAlign: 'center', flexShrink: 0, minWidth: '80px'
                    }}>
                      <p style={{ fontSize: '20px', fontWeight: 900, color: sColor, fontFamily: "'JetBrains Mono',monospace", letterSpacing: '1px' }}>{sig.signal}</p>
                      <p style={{ fontSize: '11px', color: '#5A6478', marginTop: '4px' }}>{sig.type}</p>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                        <div>
                          <span style={{ fontSize: '20px', marginRight: '8px' }}>{sig.icon}</span>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{sig.asset}</span>
                          <span style={{ marginLeft: '10px', fontSize: '11px', color: '#5A6478', fontFamily: "'JetBrains Mono',monospace" }}>
                            {sig.symbol} • {sig.date} • {sig.time}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '10px', padding: '3px 9px', borderRadius: '6px', fontWeight: 600, letterSpacing: '0.5px',
                            background: sig.confidence === 'HIGH' ? 'rgba(0,255,135,0.1)' : sig.confidence === 'MEDIUM' ? 'rgba(255,215,0,0.1)' : 'rgba(255,71,87,0.1)',
                            color: sig.confidence === 'HIGH' ? '#00FF87' : sig.confidence === 'MEDIUM' ? '#FFD700' : '#FF4757',
                            border: `1px solid ${sig.confidence === 'HIGH' ? 'rgba(0,255,135,0.3)' : sig.confidence === 'MEDIUM' ? 'rgba(255,215,0,0.3)' : 'rgba(255,71,87,0.3)'}`,
                          }}>{sig.confidence} CONF</span>
                          <span style={{ fontSize: '10px', padding: '3px 9px', borderRadius: '6px', fontWeight: 600, background: 'rgba(168,85,247,0.1)', color: '#A855F7', border: '1px solid rgba(168,85,247,0.3)' }}>
                            {sig.timeframe}
                          </span>
                          <span style={{
                            fontSize: '10px', padding: '3px 9px', borderRadius: '6px', fontWeight: 600,
                            background: sig.source === 'GEMINI' ? 'rgba(0,255,135,0.08)' : 'rgba(255,215,0,0.08)',
                            color: sig.source === 'GEMINI' ? '#00FF87' : '#FFD700',
                            border: `1px solid ${sig.source === 'GEMINI' ? 'rgba(0,255,135,0.2)' : 'rgba(255,215,0,0.2)'}`,
                          }}>{sig.source === 'GEMINI' ? '🤖 GEMINI AI' : '📊 FALLBACK'}</span>
                        </div>
                      </div>

                      {/* Price levels */}
                      <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        {[
                          { label: 'Buy At', val: sig.entry, color: '#00FF87' },
                          { label: 'Target', val: sig.target, color: '#FFD700' },
                          { label: 'Stop Loss', val: sig.sl, color: '#FF4757' },
                          { label: 'Support', val: sig.support, color: '#4ECDC4' },
                          { label: 'Resistance', val: sig.resistance, color: '#A855F7' },
                        ].filter(p => p.val > 0).map(p => (
                          <div key={p.label}>
                            <p style={{ fontSize: '10px', color: '#5A6478', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '3px' }}>{p.label}</p>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: p.color, fontFamily: "'JetBrains Mono',monospace" }}>
                              ${p.val.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Technical Indicators */}
                      {sig.indicators && Object.keys(sig.indicators).length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          {Object.entries(sig.indicators).map(([k, v]) => (
                            <span key={k} style={{
                              fontSize: '11px', color: '#B8C4D0', background: 'rgba(255,255,255,0.04)',
                              border: '1px solid rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: '6px',
                            }}>
                              <span style={{ color: '#FFD700', fontWeight: 600 }}>{k.toUpperCase()}</span>: {v}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Reasoning */}
                      <p style={{ fontSize: '13px', color: '#8892A4', lineHeight: 1.6 }}>
                        <span style={{ color: '#FFD700', fontSize: '12px' }}>🤖 AI: </span>
                        {sig.reasoning}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
