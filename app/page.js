'use client';
import Sidebar from './components/Sidebar';
import LiveTicker from './components/LiveTicker';
import CommodityCard from './components/CommodityCard';
import CrashGauge from './components/CrashGauge';
import NewsCard, { NEWS_DATA } from './components/NewsCard';
import NewsFeed from './components/NewsFeed';
import RealTimePriceTable from './components/RealTimePriceTable';
import PriceAlertBanner from './components/PriceAlertBanner';
import ConnectionStatus from './components/ConnectionStatus';
import useMarketData from './hooks/useMarketData';
import { useState, useEffect } from 'react';

const MARKET_LINKS = [
  { name: 'Kitco — Gold & Silver Live', url: 'https://www.kitco.com', icon: '🥇', desc: 'Real-time precious metals' },
  { name: 'Yahoo Finance Commodities', url: 'https://finance.yahoo.com/commodities', icon: '📊', desc: 'Full commodity indices' },
  { name: 'NSE Option Chain', url: 'https://www.nseindia.com/option-chain', icon: '🇮🇳', desc: 'Live F&O chain data' },
  { name: 'Investing.com Crude Oil', url: 'https://www.investing.com/commodities/crude-oil', icon: '🛢️', desc: 'WTI & Brent live charts' },
  { name: 'TradingEconomics Gold', url: 'https://www.tradingeconomics.com/commodity/gold', icon: '📈', desc: 'Historical gold data' },
  { name: 'Reuters Markets', url: 'https://www.reuters.com/markets/', icon: '🌐', desc: 'Breaking market news' },
];

const PERFORMANCE_STATS = [
  { label: 'Signals Sent', value: '342', sub: 'Last 30 days', icon: '🎯' },
  { label: 'Win Rate', value: '73.4%', sub: 'Buy/Sell accuracy', icon: '✅' },
  { label: 'Avg Return', value: '+4.2%', sub: 'Per trade', icon: '💰' },
  { label: 'Crash Alerts', value: '8', sub: 'Correctly predicted', icon: '🚨' },
];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState('');
  const [marketStatus, setMarketStatus] = useState('CLOSED');
  const [analysis, setAnalysis] = useState(null);

  // Real-time market data hook
  const { prices, alerts, status, isConnected } = useMarketData();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const fetchAnalysis = () => {
      fetch(`${apiUrl}/api/analysis`)
        .then(r => r.json())
        .then(d => setAnalysis(d))
        .catch(console.error);
    };
    fetchAnalysis();
    const iv = setInterval(fetchAnalysis, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const istHour = (now.getUTCHours() + 5) % 24;
      const istMinute = (now.getUTCMinutes() + 30) % 60;
      const timeStr = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long', day: 'numeric', month: 'long',
        hour: '2-digit', minute: '2-digit'
      });
      setCurrentTime(timeStr);

      const totalMins = istHour * 60 + istMinute;
      const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
      setMarketStatus(isWeekday && totalMins >= 555 && totalMins <= 930 ? 'OPEN' : 'CLOSED');
    };
    update();
    const iv = setInterval(update, 30000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="hero-bg" style={{ minHeight: '100vh' }}>
      <Sidebar />

      <div className="main-content">
        {/* Live Ticker — now real-time */}
        <LiveTicker prices={prices} />

        {/* Header */}
        <div style={{ padding: '32px 32px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>
                  <span className="text-gradient-gold">Market</span>
                  <span style={{ color: '#fff' }}>Mind AI</span>
                </h1>
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px',
                  letterSpacing: '1.5px',
                  background: marketStatus === 'OPEN' ? 'rgba(0,255,135,0.15)' : 'rgba(255,71,87,0.12)',
                  border: `1px solid ${marketStatus === 'OPEN' ? 'rgba(0,255,135,0.35)' : 'rgba(255,71,87,0.3)'}`,
                  color: marketStatus === 'OPEN' ? '#00FF87' : '#FF4757',
                }}>
                  {marketStatus === 'OPEN' ? '● MARKET OPEN' : '○ MARKET CLOSED'}
                </span>
                <ConnectionStatus isConnected={isConnected} status={status} />
              </div>
              <p style={{ fontSize: '14px', color: '#8892A4' }}>
                AI-powered daily analysis • {currentTime}
              </p>
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a href="/alerts" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '10px 20px' }}>
                  📧 Subscribe Alerts
                </button>
              </a>
              <a href="/signals" style={{ textDecoration: 'none' }}>
                <button className="btn-ghost" style={{ fontSize: '13px', padding: '10px 20px' }}>
                  🎯 View All Signals
                </button>
              </a>
            </div>
          </div>

          {/* Price Alert Banner */}
          <PriceAlertBanner alerts={alerts} />

          {/* Performance Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {PERFORMANCE_STATS.map((stat, i) => (
              <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
                }}>{stat.icon}</div>
                <div>
                  <p style={{ fontSize: '22px', fontWeight: 800, color: '#FFD700', fontFamily: "'JetBrains Mono',monospace", lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginTop: '4px' }}>{stat.label}</p>
                  <p style={{ fontSize: '10px', color: '#5A6478', marginTop: '2px' }}>{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ⚡ Real-Time Price Table */}
          <div style={{ marginBottom: '24px' }}>
            <RealTimePriceTable prices={prices} />
          </div>

          {/* Main Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>

            {/* Commodities */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: '#fff' }}>
                  🥇 Commodity Signals
                </h2>
                <a href="/commodities" style={{ textDecoration: 'none', fontSize: '12px', color: '#FFD700' }}>View All →</a>
              </div>
              <div style={{ display: 'grid', gap: '16px' }}>
                <CommodityCard type="gold" tradeData={analysis?.signals?.gold ? { price: analysis.prices.gold, signal: analysis.signals.gold } : null} />
                <CommodityCard type="silver" tradeData={analysis?.signals?.silver ? { price: analysis.prices.silver, signal: analysis.signals.silver } : null} />
                <CommodityCard type="oil" tradeData={analysis?.signals?.oil ? { price: analysis.prices.oil, signal: analysis.signals.oil } : null} />
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Crash Radar */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: '#fff' }}>🚨 Crash Radar</h2>
                  <a href="/crash-radar" style={{ textDecoration: 'none', fontSize: '12px', color: '#FFD700' }}>Details →</a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <CrashGauge score={analysis?.crash?.crashProbability || 42} riskLevel={analysis?.crash?.crashRisk || 'MODERATE'} />
                </div>
                <div style={{ background: 'rgba(255,215,0,0.05)', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,215,0,0.12)' }}>
                  <p style={{ fontSize: '12px', color: '#8892A4', marginBottom: '6px', fontWeight: 600 }}>Key Risk Factors Today</p>
                  {(analysis?.crash?.triggerEvents || ['Fed rate decision Wednesday', 'China PMI data weak', 'Middle East tensions stable']).slice(0,3).map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ color: '#FFD700', fontSize: '10px' }}>⚠</span>
                      <span style={{ fontSize: '12px', color: '#B8C4D0' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NIFTY F&O Overview */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk',sans-serif" }}>📊 NIFTY F&O</h2>
                  <a href="/options-chain" style={{ textDecoration: 'none', fontSize: '12px', color: '#FFD700' }}>Full Chain →</a>
                </div>
                {[
                  { label: 'Spot Price', val: analysis?.nse ? parseFloat(analysis.nse.spot).toLocaleString() : '22,350.45', color: '#fff' },
                  { label: 'Trend', val: analysis?.nifty ? `${analysis.nifty.trend === 'BULLISH' ? '📈' : '📉'} ${analysis.nifty.trend}` : '📈 BULLISH', color: analysis?.nifty?.trend === 'BEARISH' ? '#FF4757' : '#00FF87' },
                  { label: 'Max Pain', val: analysis?.nifty ? analysis.nifty.maxPainLevel.toLocaleString() : '22,200', color: '#FFD700' },
                  { label: 'PCR Ratio', val: analysis?.nifty ? `${analysis.nifty.pcr} (${analysis.nifty.sentiment})` : '1.24 (Bullish)', color: analysis?.nifty?.sentiment === 'BEARISH' ? '#FF4757' : '#00FF87' },
                  { label: 'Buy Above', val: analysis?.nifty ? analysis.nifty.buyAbove.toLocaleString() : '22,400', color: '#00FF87' },
                  { label: 'Sell Below', val: analysis?.nifty ? analysis.nifty.sellBelow.toLocaleString() : '22,100', color: '#FF4757' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '12px', color: '#8892A4' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: row.color, fontFamily: "'JetBrains Mono',monospace" }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Global News Section (Aggregated) */}
          <div style={{ marginBottom: '24px' }}>
            <NewsFeed />
          </div>

          {/* Global Market Links */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: '#fff', marginBottom: '16px' }}>
              🔗 Global Market Links
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {MARKET_LINKS.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0
                    }}>{link.icon}</div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '3px' }}>{link.name}</p>
                      <p style={{ fontSize: '11px', color: '#5A6478' }}>{link.desc}</p>
                    </div>
                    <span style={{ marginLeft: 'auto', color: '#FFD700', fontSize: '14px', flexShrink: 0 }}>↗</span>
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
