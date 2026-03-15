'use client';
import { useState } from 'react';

export default function EmailSubscribe() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [time, setTime] = useState('07:00');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#00FF87', marginBottom: '8px' }}>You're Subscribed!</h3>
        <p style={{ color: '#8892A4', fontSize: '14px', lineHeight: 1.6 }}>
          Daily AI market analysis will be delivered to <strong style={{ color: '#FFD700' }}>{email}</strong> every morning at {time} IST.
        </p>
        <button
          onClick={() => { setSubmitted(false); setEmail(''); setName(''); }}
          style={{ marginTop: '20px' }}
          className="btn-ghost"
        >
          Add Another Email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#8892A4', fontWeight: 500, display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
            YOUR NAME
          </label>
          <input
            className="input-field"
            type="text"
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#8892A4', fontWeight: 500, display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
            EMAIL ADDRESS *
          </label>
          <input
            className="input-field"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#8892A4', fontWeight: 500, display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>
            DAILY REPORT TIME (IST)
          </label>
          <select
            className="input-field"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            <option value="06:00">6:00 AM IST (Before Market)</option>
            <option value="07:00">7:00 AM IST (Recommended)</option>
            <option value="08:00">8:00 AM IST</option>
            <option value="09:00">9:00 AM IST (Market Open)</option>
          </select>
        </div>

        <div style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '12px', padding: '14px 16px' }}>
          <p style={{ fontSize: '12px', color: '#8892A4', marginBottom: '10px', fontWeight: 600 }}>📧 Your daily email will include:</p>
          {[
            '🥇 Gold, Silver, Oil Buy/Sell signals with prices',
            '📊 NIFTY & BANKNIFTY F&O analysis',
            '🚨 Market crash risk score',
            '📰 Top 5 market-moving news with links',
            '🌍 Global market outlook',
          ].map(item => (
            <div key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', lineHeight: 1.5, color: '#B8C4D0' }}>{item}</span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading ? (
            <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '16px' }}>⏳</span> Subscribing...</>
          ) : (
            <>📧 Subscribe to Daily Reports</>
          )}
        </button>
        <p style={{ fontSize: '11px', color: '#5A6478', textAlign: 'center' }}>
          Free forever. Unsubscribe anytime. No spam.
        </p>
      </div>
    </form>
  );
}
