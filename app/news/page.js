'use client';
import Sidebar from '../components/Sidebar';
import LiveTicker from '../components/LiveTicker';
import NewsCard, { NEWS_DATA } from '../components/NewsCard';
import NewsFeed from '../components/NewsFeed';
import { useState } from 'react';

export default function NewsPage() {
  return (
    <div className="hero-bg" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <LiveTicker />
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '6px' }}>
              📰 <span className="text-gradient-gold">Market News</span> & Analysis
            </h1>
            <p style={{ fontSize: '14px', color: '#8892A4' }}>AI-curated global financial news with impact analysis and crash risk scoring</p>
          </div>

          {/* Global News Section (Aggregated) */}
          <div style={{ marginBottom: '24px' }}>
            <NewsFeed />
          </div>

          {/* Global market links */}
          <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.12)', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '16px', fontFamily: "'Space Grotesk',sans-serif" }}>
              🔗 Live Global Market Sources
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { name: 'Reuters Markets', url: 'https://www.reuters.com/markets/' },
                { name: 'Bloomberg', url: 'https://www.bloomberg.com/markets' },
                { name: 'CNBC World Markets', url: 'https://www.cnbc.com/world-markets/' },
                { name: 'Financial Times', url: 'https://www.ft.com/markets' },
                { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/markets' },
                { name: 'Moneycontrol', url: 'https://www.moneycontrol.com/news/business/markets/' },
                { name: 'Investing.com', url: 'https://www.investing.com/news/' },
                { name: 'Kitco News', url: 'https://www.kitco.com/news/' },
              ].map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '8px 16px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#B8C4D0', fontSize: '13px', fontWeight: 500,
                    transition: 'all 0.2s', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'; e.currentTarget.style.color = '#FFD700'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#B8C4D0'; }}
                  >
                    {link.name} ↗
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
