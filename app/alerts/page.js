'use client';
import Sidebar from '../components/Sidebar';
import LiveTicker from '../components/LiveTicker';
import EmailSubscribe from '../components/EmailSubscribe';
import { useState } from 'react';

const PAST_SIGNALS = [
  { date: 'Mar 14', asset: 'Gold', signal: 'BUY', entry: 2162.00, target: 2200.00, sl: 2148.00, result: '+$23.40', pct: '+1.08%', status: 'WIN' },
  { date: 'Mar 13', asset: 'NIFTY', signal: 'SELL', entry: 22480, target: 22200, sl: 22600, result: '+₹280', pct: '+1.24%', status: 'WIN' },
  { date: 'Mar 12', asset: 'Silver', signal: 'BUY', entry: 24.10, target: 25.00, sl: 23.70, result: '-$0.40', pct: '-1.66%', status: 'LOSS' },
  { date: 'Mar 11', asset: 'Crude Oil', signal: 'SELL', entry: 82.50, target: 80.00, sl: 83.80, result: '+$2.50', pct: '+3.03%', status: 'WIN' },
  { date: 'Mar 10', asset: 'Gold', signal: 'BUY', entry: 2145.00, target: 2180.00, sl: 2130.00, result: '+$35.00', pct: '+1.63%', status: 'WIN' },
  { date: 'Mar 09', asset: 'BANKNIFTY', signal: 'BUY', entry: 47800, target: 48400, sl: 47500, result: '-₹300', pct: '-0.63%', status: 'LOSS' },
  { date: 'Mar 08', asset: 'Gold', signal: 'SELL', entry: 2178.00, target: 2150.00, sl: 2195.00, result: '+$28.00', pct: '+1.29%', status: 'WIN' },
  { date: 'Mar 07', asset: 'Silver', signal: 'BUY', entry: 23.50, target: 24.50, sl: 23.00, result: '+$1.00', pct: '+4.26%', status: 'WIN' },
  { date: 'Mar 06', asset: 'Crude Oil', signal: 'BUY', entry: 79.20, target: 82.00, sl: 77.80, result: '+$2.80', pct: '+3.54%', status: 'WIN' },
  { date: 'Mar 05', asset: 'NIFTY', signal: 'BUY', entry: 21950, target: 22200, sl: 21800, result: '-₹150', pct: '-0.68%', status: 'LOSS' },
];

const EMAILS_SENT = [
  { date: 'Mar 14, 2024', time: '07:00 AM', recipients: 847, opens: '73%', subject: 'Gold BUY ↑ | NIFTY Bullish | Crash Risk 42%' },
  { date: 'Mar 13, 2024', time: '07:00 AM', recipients: 831, opens: '69%', subject: 'Silver Signal | Oil HOLD | Global News Summary' },
  { date: 'Mar 12, 2024', time: '07:00 AM', recipients: 812, opens: '81%', subject: '🚨 CRASH ALERT 68% — CPI Data Risk Today' },
  { date: 'Mar 11, 2024', time: '07:00 AM', recipients: 798, opens: '65%', subject: 'Gold SELL Signal | Weekly Expiry F&O Analysis' },
  { date: 'Mar 10, 2024', time: '07:00 AM', recipients: 784, opens: '72%', subject: 'Monday Markets Preview | Gold Buy Zone $2,145' },
];

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState('subscribe');

  const wins = PAST_SIGNALS.filter(s => s.status === 'WIN').length;
  const total = PAST_SIGNALS.length;

  return (
    <div className="hero-bg" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <LiveTicker />
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '6px' }}>
              📧 <span className="text-gradient-gold">Email Alerts</span> & Signal History
            </h1>
            <p style={{ fontSize: '14px', color: '#8892A4' }}>Subscribe for daily AI market analysis delivered to your inbox every morning</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1px' }}>
            {[
              { key: 'subscribe', label: '📧 Subscribe' },
              { key: 'history', label: '📜 Signal History' },
              { key: 'emails', label: '📨 Email Log' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: '12px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                border: 'none', background: 'transparent',
                borderBottom: activeTab === tab.key ? '2px solid #FFD700' : '2px solid transparent',
                color: activeTab === tab.key ? '#FFD700' : '#8892A4',
                transition: 'all 0.2s', marginBottom: '-1px',
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Subscribe Tab */}
          {activeTab === 'subscribe' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div className="glass-card-static" style={{ padding: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px', fontFamily: "'Space Grotesk',sans-serif" }}>
                  Get Daily AI Reports
                </h2>
                <p style={{ fontSize: '13px', color: '#8892A4', marginBottom: '24px', lineHeight: 1.6 }}>
                  Join 847 traders receiving AI-powered daily market analysis every morning at 7 AM IST — completely free.
                </p>
                <EmailSubscribe />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'Subscribers', val: '847', icon: '👥', color: '#4ECDC4' },
                    { label: 'Emails Sent', val: '15,240', icon: '📨', color: '#A855F7' },
                    { label: 'Win Rate', val: '73.4%', icon: '✅', color: '#00FF87' },
                    { label: 'Open Rate', val: '71.2%', icon: '👀', color: '#FFD700' },
                  ].map(s => (
                    <div key={s.label} className="glass-card" style={{ padding: '18px' }}>
                      <p style={{ fontSize: '22px', marginBottom: '4px' }}>{s.icon}</p>
                      <p style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{s.val}</p>
                      <p style={{ fontSize: '12px', color: '#8892A4', marginTop: '4px' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Sample email preview */}
                <div style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '14px', padding: '20px' }}>
                  <p className="section-label" style={{ marginBottom: '14px' }}>📧 Sample Email Preview</p>
                  <div style={{ background: '#0a0a1a', borderRadius: '10px', padding: '16px', fontFamily: 'monospace', fontSize: '12px' }}>
                    <p style={{ color: '#FFD700', fontWeight: 700, marginBottom: '8px' }}>Subject: 📊 Gold BUY | NIFTY Bullish | Crash 42%</p>
                    <p style={{ color: '#8892A4', marginBottom: '6px' }}>— MarketMind AI Daily Report — Mar 14, 2024 —</p>
                    <p style={{ color: '#00FF87', marginBottom: '4px' }}>🥇 GOLD: BUY at $2,172 → Target $2,240 | SL $2,158</p>
                    <p style={{ color: '#C0C0C0', marginBottom: '4px' }}>🥈 SILVER: BUY at $24.40 → Target $26.50</p>
                    <p style={{ color: '#F97316', marginBottom: '4px' }}>🛢️ OIL: HOLD — Conflicting signals</p>
                    <p style={{ color: '#4ECDC4', marginBottom: '4px' }}>📊 NIFTY: Buy above 22,400 | PCR 1.24</p>
                    <p style={{ color: '#FFD700', marginBottom: '4px' }}>🚨 Crash Risk: 42% — MODERATE</p>
                    <p style={{ color: '#8892A4' }}>📰 5 news items + market links →</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Signal History Tab */}
          {activeTab === 'history' && (
            <div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Total Signals', val: total, color: '#fff' },
                  { label: 'Wins', val: wins, color: '#00FF87' },
                  { label: 'Losses', val: total - wins, color: '#FF4757' },
                  { label: 'Win Rate', val: `${((wins / total) * 100).toFixed(1)}%`, color: '#FFD700' },
                ].map(m => (
                  <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 20px' }}>
                    <p style={{ fontSize: '11px', color: '#5A6478', marginBottom: '4px' }}>{m.label}</p>
                    <p style={{ fontSize: '22px', fontWeight: 800, color: m.color, fontFamily: "'JetBrains Mono',monospace" }}>{m.val}</p>
                  </div>
                ))}
              </div>
              <div className="glass-card-static" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Date</th>
                        <th style={{ textAlign: 'left' }}>Asset</th>
                        <th>Signal</th>
                        <th>Entry</th>
                        <th>Target</th>
                        <th>Stop Loss</th>
                        <th>P&L</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PAST_SIGNALS.map((row, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'left', color: '#5A6478', fontSize: '12px' }}>{row.date}</td>
                          <td style={{ textAlign: 'left', fontWeight: 600 }}>{row.asset}</td>
                          <td>
                            <span className={row.signal === 'BUY' ? 'badge-buy' : 'badge-sell'}>{row.signal}</span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{row.entry}</td>
                          <td style={{ color: '#00FF87' }}>{row.target}</td>
                          <td style={{ color: '#FF4757' }}>{row.sl}</td>
                          <td style={{ color: row.status === 'WIN' ? '#00FF87' : '#FF4757', fontWeight: 700 }}>
                            {row.result} ({row.pct})
                          </td>
                          <td>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px',
                              background: row.status === 'WIN' ? 'rgba(0,255,135,0.15)' : 'rgba(255,71,87,0.15)',
                              color: row.status === 'WIN' ? '#00FF87' : '#FF4757',
                              border: `1px solid ${row.status === 'WIN' ? 'rgba(0,255,135,0.3)' : 'rgba(255,71,87,0.3)'}`,
                            }}>{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Email Log Tab */}
          {activeTab === 'emails' && (
            <div className="glass-card-static" style={{ overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Date</th>
                      <th style={{ textAlign: 'left' }}>Time (IST)</th>
                      <th>Recipients</th>
                      <th>Open Rate</th>
                      <th style={{ textAlign: 'left' }}>Subject Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EMAILS_SENT.map((row, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: 'left', color: '#FFD700', fontWeight: 600 }}>{row.date}</td>
                        <td style={{ textAlign: 'left', color: '#00FF87' }}>{row.time}</td>
                        <td style={{ fontWeight: 700 }}>{row.recipients}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                            <div style={{
                              width: '48px', height: '5px', background: 'rgba(255,255,255,0.1)',
                              borderRadius: '3px', overflow: 'hidden'
                            }}>
                              <div style={{ width: row.opens, height: '100%', background: '#00FF87', borderRadius: '3px' }} />
                            </div>
                            <span style={{ color: '#00FF87', fontSize: '12px', fontWeight: 600 }}>{row.opens}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'left', color: '#B8C4D0', fontSize: '12px', maxWidth: '300px' }}>{row.subject}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
