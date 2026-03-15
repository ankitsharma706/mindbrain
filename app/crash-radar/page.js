'use client';
import Sidebar from '../components/Sidebar';
import LiveTicker from '../components/LiveTicker';
import CrashGauge from '../components/CrashGauge';
import { useState, useEffect, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const REFRESH_MS = 120_000; // 2 minutes
const RETRY_MS = 5_000;

const CRASH_HISTORY = [
  { date: 'Mar 12, 2024', event: 'US CPI Beat — Inflation Spike', score: 72, actual: 'Markets -1.8% that day', correct: true },
  { date: 'Feb 28, 2024', event: 'China Credit Contraction', score: 65, actual: 'Commodities -2.1%', correct: true },
  { date: 'Feb 14, 2024', event: 'Gaza Ceasefire Talks', score: 28, actual: 'Markets +0.5%', correct: true },
  { date: 'Jan 30, 2024', event: 'FOMC Meeting — No Cut Signal', score: 58, actual: 'Gold -$18', correct: true },
  { date: 'Jan 15, 2024', event: 'Red Sea Shipping Crisis', score: 81, actual: 'Oil +4.2%, Markets -1.2%', correct: true },
];

const SAFE_HAVENS = [
  { asset: 'Gold', reason: 'Classic crisis hedge', expected: '+8 to +15%', icon: '🥇' },
  { asset: 'US T-Bills', reason: 'Risk-off flight', expected: '+3 to +6%', icon: '📄' },
  { asset: 'USD Index', reason: 'Safe currency demand', expected: '+2 to +5%', icon: '💵' },
  { asset: 'Silver', reason: 'Gold coattails + cheap', expected: '+5 to +12%', icon: '🥈' },
];

export default function CrashRadarPage() {
  const [crash, setCrash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryRef = useRef(null);

  useEffect(() => {
    let iv;
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/crash`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setCrash(json.crash || null);
        setError(null);
        setLoading(false);
        if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null; }
      } catch (err) {
        console.error('[CrashRadar] fetch failed:', err.message);
        setError('Unable to load market data. Retrying...');
        setLoading(false);
        retryRef.current = setTimeout(fetchData, RETRY_MS);
      }
    };
    fetchData();
    iv = setInterval(fetchData, REFRESH_MS);
    return () => { clearInterval(iv); if (retryRef.current) clearTimeout(retryRef.current); };
  }, []);

  const crashScore = crash?.crashProbability || 0;
  const riskLevel = crash?.crashRisk || 'LOADING';
  const recommendation = crash?.recommendation || 'Waiting for backend analysis...';
  const triggers = crash?.triggerEvents || [];
  const safeHavens = crash?.safeHavens || SAFE_HAVENS.map(s => s.asset);
  const keyRisks = crash?.keyRisks || {};

  const CRASH_CATEGORIES = [
    { category: 'Monetary Policy', key: 'monetary', defaultWeight: 35, triggers: ['Fed rate hike surprise', 'Bond yield spike above 5%', 'Dollar index surge'] },
    { category: 'Geopolitical', key: 'geopolitical', defaultWeight: 30, triggers: ['Major conflict escalation', 'Trade war tariffs', 'Energy supply cut'] },
    { category: 'Economic Data', key: 'economic', defaultWeight: 25, triggers: ['Recession confirmation', 'Bank failure news', 'CPI above 5%'] },
    { category: 'Market Structure', key: 'structural', defaultWeight: 10, triggers: ['VIX above 40', 'Margin calls cascade', 'Circuit breakers triggered'] },
  ];

  return (
    <div className="hero-bg" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <LiveTicker />
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '6px' }}>
              🚨 <span className="text-gradient-red">Crash</span> Radar
            </h1>
            <p style={{ fontSize: '14px', color: '#8892A4' }}>AI monitors 50+ real-time indicators to score market crash probability daily</p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span style={{ fontSize: '13px', color: '#FF4757' }}>{error}</span>
            </div>
          )}

          {/* Main gauge + triggers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
            {/* Gauge panel */}
            <div className="glass-card-static" style={{ padding: '28px', textAlign: 'center' }}>
              <p className="section-label" style={{ marginBottom: '20px' }}>Today's Crash Risk Score</p>
              <CrashGauge score={crashScore} riskLevel={riskLevel} />
              <div style={{ margin: '20px 0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                <p style={{ fontSize: '13px', color: '#B8C4D0', lineHeight: 1.7, textAlign: 'left' }}>
                  {recommendation}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { label: 'Risk Level', val: riskLevel, color: riskLevel === 'CRITICAL' ? '#FF1414' : riskLevel === 'HIGH' ? '#FF4757' : riskLevel === 'MODERATE' ? '#FFD700' : '#00FF87' },
                  { label: 'Time Horizon', val: crash?.timeHorizon || '—', color: '#FFD700' },
                  { label: 'Source', val: crash?.source || '—', color: '#4ECDC4' },
                  { label: 'Probability', val: `${crashScore}%`, color: crashScore >= 70 ? '#FF4757' : crashScore >= 40 ? '#FFD700' : '#00FF87' },
                ].map(m => (
                  <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px' }}>
                    <p style={{ fontSize: '10px', color: '#5A6478', marginBottom: '4px' }}>{m.label}</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: m.color, fontFamily: "'JetBrains Mono',monospace" }}>{m.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Crash triggers breakdown */}
            <div className="glass-card-static" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px', fontFamily: "'Space Grotesk',sans-serif" }}>
                ⚡ Crash Trigger Categories
              </h2>
              {CRASH_CATEGORIES.map((cat, i) => {
                const weight = keyRisks[cat.key] || cat.defaultWeight;
                return (
                  <div key={i} style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{cat.category}</span>
                      <span style={{ fontSize: '12px', color: '#FFD700', fontFamily: "'JetBrains Mono',monospace" }}>{weight}% risk</span>
                    </div>
                    <div className="progress-bar" style={{ marginBottom: '10px' }}>
                      <div className="progress-fill" style={{
                        width: `${weight}%`,
                        background: i === 0 ? 'linear-gradient(90deg, #FF4757, #FFD700)' :
                                    i === 1 ? 'linear-gradient(90deg, #F97316, #FFD700)' :
                                    i === 2 ? 'linear-gradient(90deg, #FFD700, #00FF87)' :
                                    'linear-gradient(90deg, #4ECDC4, #00FF87)',
                      }} />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {(i === 0 && triggers.length > 0 ? triggers : cat.triggers).map(t => (
                        <span key={t} style={{
                          fontSize: '11px', color: '#8892A4',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          padding: '3px 8px', borderRadius: '6px'
                        }}>{typeof t === 'string' ? t.slice(0, 80) : t}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe Havens */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', fontFamily: "'Space Grotesk',sans-serif" }}>🛡️ Safe Haven Assets During a Crash</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {SAFE_HAVENS.map((item, i) => (
                <div key={i} className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{item.asset}</p>
                  <p style={{ fontSize: '12px', color: '#8892A4', marginBottom: '10px' }}>{item.reason}</p>
                  <div style={{ background: safeHavens.includes(item.asset) ? 'rgba(0,255,135,0.08)' : 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px 12px', border: safeHavens.includes(item.asset) ? '1px solid rgba(0,255,135,0.2)' : '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ fontSize: '11px', color: '#5A6478', marginBottom: '2px' }}>Expected move in crash</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: safeHavens.includes(item.asset) ? '#00FF87' : '#8892A4', fontFamily: "'JetBrains Mono',monospace" }}>{item.expected}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crash prediction history */}
          <div className="glass-card-static" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '20px', fontFamily: "'Space Grotesk',sans-serif" }}>
              📜 Past Crash Alert History
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Date</th>
                    <th style={{ textAlign: 'left' }}>Event</th>
                    <th>Score</th>
                    <th style={{ textAlign: 'left' }}>Actual Outcome</th>
                    <th>Accurate</th>
                  </tr>
                </thead>
                <tbody>
                  {CRASH_HISTORY.map((row, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: 'left', color: '#8892A4', fontSize: '12px' }}>{row.date}</td>
                      <td style={{ textAlign: 'left', color: '#fff', fontSize: '13px', maxWidth: '200px' }}>{row.event}</td>
                      <td>
                        <span style={{
                          color: row.score >= 70 ? '#FF4757' : row.score >= 50 ? '#FFD700' : '#00FF87',
                          fontWeight: 700
                        }}>{row.score}%</span>
                      </td>
                      <td style={{ textAlign: 'left', color: '#8892A4', fontSize: '12px' }}>{row.actual}</td>
                      <td><span style={{ color: row.correct ? '#00FF87' : '#FF4757', fontSize: '16px' }}>{row.correct ? '✓' : '✗'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
