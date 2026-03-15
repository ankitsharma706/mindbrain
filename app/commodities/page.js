'use client';
import Sidebar from '../components/Sidebar';
import LiveTicker from '../components/LiveTicker';
import CommodityCard from '../components/CommodityCard';
import NewsFeed from '../components/NewsFeed';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { useEffect, useState } from 'react';

// Mock historical price data for charts
const generateChartData = (basePrice, days = 30, volatility = 0.015) => {
  const data = [];
  let price = basePrice;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const change = (Math.random() - 0.48) * basePrice * volatility;
    price = Math.max(price * 0.9, price + change);
    data.push({
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      price: parseFloat(price.toFixed(2)),
    });
  }
  return data;
};

const COMDTY_INFO = {
  gold: { name: 'Gold', icon: '🥇', base: 2185, unit: 'USD/oz', color: '#FFD700', data: generateChartData(2100, 30, 0.01) },
  silver: { name: 'Silver', icon: '🥈', base: 24.68, unit: 'USD/oz', color: '#C0C0C0', data: generateChartData(23, 30, 0.02) },
  oil: { name: 'Crude Oil', icon: '🛢️', base: 81.24, unit: 'USD/bbl', color: '#F97316', data: generateChartData(78, 30, 0.018) },
  naturalgas: { name: 'Natural Gas', icon: '🔥', base: 1.78, unit: 'USD/MMBtu', color: '#4ECDC4', data: generateChartData(1.6, 30, 0.03) },
  copper: { name: 'Copper', icon: '🪙', base: 4.12, unit: 'USD/lb', color: '#CD7F32', data: generateChartData(3.9, 30, 0.015) },
  platinum: { name: 'Platinum', icon: '💎', base: 915.2, unit: 'USD/oz', color: '#A855F7', data: generateChartData(890, 30, 0.012) },
};

const CustomTooltip = ({ active, payload, label, color }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(4,4,15,0.95)', border: `1px solid ${color}40`,
        borderRadius: '10px', padding: '12px 16px', fontSize: '13px'
      }}>
        <p style={{ color: '#8892A4', marginBottom: '4px', fontSize: '11px' }}>{label}</p>
        <p style={{ color, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function CommoditiesPage() {
  const [selected, setSelected] = useState('gold');
  const [range, setRange] = useState(30);
  const [analysis, setAnalysis] = useState(null);

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

  const info = COMDTY_INFO[selected];
  let chartData = info.data.slice(-range);
  
  const endPriceOriginal = chartData[chartData.length - 1]?.price || 1;
  const currentLivePrice = analysis?.prices?.[selected === 'naturalgas' ? 'gas' : selected]?.price;
  
  // Scale the mock chart data so the endpoint realistically matches the real API live price
  if (currentLivePrice) {
    const ratio = currentLivePrice / endPriceOriginal;
    chartData = chartData.map(d => ({
      ...d,
      price: parseFloat((d.price * ratio).toFixed(2))
    }));
  }

  const startPrice = chartData[0]?.price || 0;
  const endPrice = chartData[chartData.length - 1]?.price || 0;
  const chartChange = endPrice - startPrice;
  const chartChangePct = ((chartChange / startPrice) * 100).toFixed(2);

  return (
    <div className="hero-bg" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="main-content">
        <LiveTicker />
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '6px' }}>
              🥇 <span className="text-gradient-gold">Commodities</span> Analysis
            </h1>
            <p style={{ fontSize: '14px', color: '#8892A4' }}>AI-generated buy/sell signals with technical analysis for global commodity markets</p>
          </div>

          {/* Commodity selector tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {Object.entries(COMDTY_INFO).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelected(key)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: selected === key ? `1px solid ${val.color}60` : '1px solid rgba(255,255,255,0.08)',
                  background: selected === key ? `${val.color}15` : 'rgba(255,255,255,0.03)',
                  color: selected === key ? val.color : '#8892A4',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: selected === key ? 700 : 400,
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {val.icon} {val.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Chart */}
            <div>
              <div className="glass-card-static" style={{ padding: '24px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '24px' }}>{info.icon}</span>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: "'Space Grotesk',sans-serif" }}>{info.name}</span>
                      <span style={{ fontSize: '11px', color: '#5A6478', letterSpacing: '1px' }}>{info.unit}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                      <span style={{ fontSize: '28px', fontWeight: 800, fontFamily: "'JetBrains Mono',monospace", color: '#fff' }}>
                        ${(analysis?.prices?.[selected === 'naturalgas' ? 'gas' : selected]?.price || endPrice).toLocaleString()}
                      </span>
                      <span style={{ fontSize: '13px', color: (analysis?.prices?.[selected === 'naturalgas' ? 'gas' : selected]?.change || chartChange) >= 0 ? '#00FF87' : '#FF4757', fontFamily: "'JetBrains Mono',monospace" }}>
                        {(analysis?.prices?.[selected === 'naturalgas' ? 'gas' : selected]?.change || chartChange) >= 0 ? '+' : ''}{(analysis?.prices?.[selected === 'naturalgas' ? 'gas' : selected]?.change || chartChange || 0).toFixed(2)} ({(analysis?.prices?.[selected === 'naturalgas' ? 'gas' : selected]?.pct || chartChangePct) >= 0 ? '+' : ''}{analysis?.prices?.[selected === 'naturalgas' ? 'gas' : selected]?.pct || chartChangePct}%)
                      </span>
                    </div>
                  </div>

                  {/* Range selector */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[7, 14, 30].map(r => (
                      <button
                        key={r}
                        onClick={() => setRange(r)}
                        style={{
                          padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                          border: range === r ? `1px solid ${info.color}60` : '1px solid rgba(255,255,255,0.08)',
                          background: range === r ? `${info.color}15` : 'rgba(255,255,255,0.03)',
                          color: range === r ? info.color : '#8892A4',
                          transition: 'all 0.2s',
                        }}
                      >{r}D</button>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id={`grad-${selected}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={info.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={info.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tick={{ fill: '#5A6478', fontSize: 11 }} tickLine={false} axisLine={false} interval={Math.floor(chartData.length / 6)} />
                    <YAxis tick={{ fill: '#5A6478', fontSize: 11 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={v => `$${v.toLocaleString()}`} width={75} />
                    <Tooltip content={<CustomTooltip color={info.color} />} />
                    <ReferenceLine y={startPrice} stroke="rgba(255,255,255,0.1)" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="price" stroke={info.color} strokeWidth={2} dot={false}
                      activeDot={{ r: 5, fill: info.color, stroke: '#04040f', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* World trade context */}
              <div className="glass-card-static" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>🌍 Global Trade Impact</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'India Import', val: selected === 'gold' ? '₹2.8L Cr/yr' : selected === 'silver' ? '₹65K Cr/yr' : '₹8L Cr/yr', color: '#FF4757' },
                    { label: 'Global Demand', val: selected === 'gold' ? '4,448 tonnes' : selected === 'silver' ? '35,000 tonnes' : '100M bbl/day', color: '#FFD700' },
                    { label: 'USD Correlation', val: selected === 'gold' ? '-0.82' : selected === 'silver' ? '-0.75' : '+0.48', color: '#4ECDC4' },
                    { label: 'Inflation Hedge', val: selected === 'gold' ? '⭐⭐⭐⭐⭐' : selected === 'silver' ? '⭐⭐⭐⭐' : '⭐⭐⭐', color: '#A855F7' },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px' }}>
                      <p style={{ fontSize: '10px', color: '#5A6478', marginBottom: '4px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{item.label}</p>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: item.color, fontFamily: "'JetBrains Mono',monospace" }}>{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Signal card */}
            <div>
              <CommodityCard 
                type={['gold', 'silver', 'oil'].includes(selected) ? selected : 'oil'} 
                tradeData={
                  analysis?.signals?.[selected === 'naturalgas' ? 'gas' : selected] 
                  ? { 
                      price: analysis.prices[selected === 'naturalgas' ? 'gas' : selected], 
                      signal: analysis.signals[selected === 'naturalgas' ? 'gas' : selected] 
                    } 
                  : null
                }
              />
            </div>
          </div>

          {/* Aggregated Asset News */}
          <div style={{ marginTop: '24px' }}>
            <NewsFeed asset={selected === 'naturalgas' ? 'gas' : selected} />
          </div>
        </div>
      </div>
    </div>
  );
}
