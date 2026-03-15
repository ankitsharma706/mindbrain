'use client';
import Sidebar from '../components/Sidebar';
import LiveTicker from '../components/LiveTicker';
import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const REFRESH_MS = 60_000; // 1 minute
const RETRY_MS = 5_000;

export default function OptionsChainPage() {
  const [index, setIndex] = useState('NIFTY');
  const [data, setData] = useState(null);    // nifty AI analysis
  const [nseRaw, setNseRaw] = useState(null); // raw NSE chain
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryRef = useRef(null);

  useEffect(() => {
    let iv;
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/options-chain`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json.nifty || null);
        setNseRaw(json.nse || null);
        setError(null);
        setLoading(false);
        // clear any retry timer
        if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null; }
      } catch (err) {
        console.error('[OptionsChain] fetch failed:', err.message);
        setError('Unable to load market data. Retrying...');
        setLoading(false);
        retryRef.current = setTimeout(fetchData, RETRY_MS);
      }
    };
    fetchData();
    iv = setInterval(fetchData, REFRESH_MS);
    return () => { clearInterval(iv); if (retryRef.current) clearTimeout(retryRef.current); };
  }, []);

  const spotPrice = nseRaw?.spot || 22350;
  const chain = nseRaw?.strikes || [];
  const pcr = data?.pcr || (nseRaw?.pcr) || 1.0;
  const maxPain = data?.maxPainLevel || nseRaw?.maxPain || 22300;
  const oiData = chain.map(r => ({ strike: r.strike.toString(), callOI: r.callOI, putOI: r.putOI }));

  const formatK = (v) => v >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${(v / 1000).toFixed(0)}K`;

  return (
    <div className="hero-bg" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <LiveTicker />
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '6px' }}>
              📊 <span className="text-gradient-gold">Options Chain</span> Analysis
            </h1>
            <p style={{ fontSize: '14px', color: '#8892A4' }}>AI-analyzed Indian F&O chain with OI heatmap, max pain, and directional signals</p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span style={{ fontSize: '13px', color: '#FF4757' }}>{error}</span>
            </div>
          )}

          {/* Index selector */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            {['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY'].map(idx => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                style={{
                  padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  border: index === idx ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  background: index === idx ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
                  color: index === idx ? '#FFD700' : '#8892A4',
                  transition: 'all 0.2s',
                }}
              >{idx}</button>
            ))}
          </div>

          {/* Key metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Spot Price', val: `₹${spotPrice.toLocaleString()}`, color: '#fff', icon: '📍' },
              { label: 'PCR Ratio', val: pcr, color: pcr > 1 ? '#00FF87' : '#FF4757', icon: '⚖️' },
              { label: 'Max Pain', val: `₹${maxPain.toLocaleString()}`, color: '#FFD700', icon: '😣' },
              { label: 'AI Trend', val: `📈 ${data?.trend || '—'}`, color: data?.trend === 'BEARISH' ? '#FF4757' : '#00FF87', icon: '🤖' },
              { label: 'Buy Above', val: data?.buyAbove ? `₹${data.buyAbove.toLocaleString()}` : '—', color: '#00FF87', icon: '🟢' },
              { label: 'Sell Below', val: data?.sellBelow ? `₹${data.sellBelow.toLocaleString()}` : '—', color: '#FF4757', icon: '🔴' },
            ].map(m => (
              <div key={m.label} className="glass-card" style={{ padding: '16px 18px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>{m.icon}</span>
                  <span style={{ fontSize: '11px', color: '#5A6478', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 600 }}>{m.label}</span>
                </div>
                <p style={{ fontSize: '18px', fontWeight: 800, color: m.color, fontFamily: "'JetBrains Mono',monospace" }}>{m.val}</p>
              </div>
            ))}
          </div>

          {/* OI Bar Chart */}
          {oiData.length > 0 && (
            <div className="glass-card-static" style={{ padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '16px', fontFamily: "'Space Grotesk',sans-serif" }}>
                📊 Open Interest Distribution — {index}
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={oiData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barCategoryGap="20%">
                  <XAxis dataKey="strike" tick={{ fill: '#5A6478', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#5A6478', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={formatK} width={45} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(4,4,15,0.95)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '10px', fontSize: '12px' }}
                    labelStyle={{ color: '#FFD700', fontWeight: 700 }}
                    itemStyle={{ color: '#B8C4D0' }}
                    formatter={(v, name) => [formatK(v), name === 'callOI' ? 'Call OI' : 'Put OI']}
                  />
                  <Bar dataKey="callOI" name="callOI" radius={[4, 4, 0, 0]}>
                    {oiData.map((entry, i) => (
                      <Cell key={i} fill={entry.strike === maxPain.toString() ? '#FFD700' : 'rgba(255,71,87,0.6)'} />
                    ))}
                  </Bar>
                  <Bar dataKey="putOI" name="putOI" radius={[4, 4, 0, 0]}>
                    {oiData.map((entry, i) => (
                      <Cell key={i} fill={entry.strike === maxPain.toString() ? '#FFD700' : 'rgba(0,255,135,0.6)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255,71,87,0.7)' }} />
                  <span style={{ fontSize: '12px', color: '#8892A4' }}>Call OI (Resistance)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(0,255,135,0.7)' }} />
                  <span style={{ fontSize: '12px', color: '#8892A4' }}>Put OI (Support)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#FFD700' }} />
                  <span style={{ fontSize: '12px', color: '#8892A4' }}>Max Pain Level</span>
                </div>
              </div>
            </div>
          )}

          {/* Option Chain Table */}
          <div className="glass-card-static" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,215,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk',sans-serif" }}>
                Option Chain — {index} Weekly Expiry
              </h2>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
                <span style={{ color: '#FF4757' }}>■ Calls</span>
                <span style={{ color: '#00FF87' }}>■ Puts</span>
                <span style={{ color: '#FFD700' }}>★ ATM</span>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ color: '#FF4757', textAlign: 'right' }}>OI (C)</th>
                    <th style={{ color: '#FF4757', textAlign: 'right' }}>IV%</th>
                    <th style={{ color: '#FF4757', textAlign: 'right' }}>LTP (C)</th>
                    <th style={{ color: '#FFD700', textAlign: 'center' }}>STRIKE</th>
                    <th style={{ color: '#00FF87', textAlign: 'left' }}>LTP (P)</th>
                    <th style={{ color: '#00FF87', textAlign: 'left' }}>IV%</th>
                    <th style={{ color: '#00FF87', textAlign: 'left' }}>OI (P)</th>
                  </tr>
                </thead>
                <tbody>
                  {chain.map((row, i) => {
                    const isATM = row.strike === nseRaw?.atm || row.isATM;
                    return (
                      <tr key={i} style={{
                        background: isATM
                          ? 'rgba(255,215,0,0.06)'
                          : row.strike < spotPrice
                          ? 'rgba(255,71,87,0.02)'
                          : 'rgba(0,255,135,0.02)',
                      }}>
                        <td style={{ color: '#FF4757', textAlign: 'right' }}>{formatK(row.callOI)}</td>
                        <td style={{ color: '#FF6B81', textAlign: 'right' }}>{row.callIV}%</td>
                        <td style={{ color: row.callChange > 0 ? '#00FF87' : '#FF4757', textAlign: 'right', fontWeight: 600 }}>
                          {row.callPrice || row.callLTP}
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: isATM ? '#FFD700' : row.strike < spotPrice ? '#8892A4' : '#fff', fontSize: '14px' }}>
                          {row.strike} {isATM ? '★' : ''}
                        </td>
                        <td style={{ color: row.putChange > 0 ? '#00FF87' : '#FF4757', textAlign: 'left', fontWeight: 600 }}>
                          {row.putPrice || row.putLTP}
                        </td>
                        <td style={{ color: '#6BCC89', textAlign: 'left' }}>{row.putIV}%</td>
                        <td style={{ color: '#00FF87', textAlign: 'left' }}>{formatK(row.putOI)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Strategy Recommendation */}
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'rgba(0,255,135,0.06)', border: '1px solid rgba(0,255,135,0.2)', borderRadius: '14px', padding: '20px' }}>
              <p className="section-label" style={{ marginBottom: '12px' }}>🤖 AI Strategy For Today</p>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#00FF87', marginBottom: '8px' }}>{data?.recommendedStrategy || 'Waiting for analysis...'}</p>
              <p style={{ fontSize: '13px', color: '#B8C4D0', lineHeight: 1.6 }}>
                {data?.strategyDetails || 'Backend analysis loading...'} 
                {data?.reasoning && <><br />{data.reasoning}</>}
              </p>
            </div>
            <div style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '14px', padding: '20px' }}>
              <p className="section-label" style={{ marginBottom: '12px' }}>⚠️ Risk Management</p>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#FFD700', marginBottom: '8px' }}>Key Levels to Watch</p>
              <p style={{ fontSize: '13px', color: '#B8C4D0', lineHeight: 1.6 }}>
                Support: {data?.strongSupport?.toLocaleString() || '—'} (high put OI). Resistance: {data?.strongResistance?.toLocaleString() || '—'} (high call OI).
                Max pain at {maxPain?.toLocaleString()} — expiry likely to settle around this level.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
