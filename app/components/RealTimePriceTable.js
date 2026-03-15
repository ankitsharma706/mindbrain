'use client';
import { useState, useMemo } from 'react';

/**
 * RealTimePriceTable — Live-updating price table with sorting, filtering, and sparkline indicators.
 */

const CATEGORY_FILTERS = ['All', 'Commodity', 'Index', 'Forex', 'MCX'];

function formatPrice(price) {
  if (price >= 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 100) return price.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (price >= 10) return price.toFixed(2);
  return price.toFixed(4);
}

function MiniSparkline({ data = [], color = '#00FF87', width = 80, height = 24 }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`
  ).join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RealTimePriceTable({ prices = {}, onSymbolClick }) {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const rows = useMemo(() => {
    let items = Object.values(prices).filter(p => p && p.price);

    // Category filter
    if (filter !== 'All') {
      items = items.filter(p => (p.category || '').toLowerCase() === filter.toLowerCase());
    }

    // Sort
    items.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case 'name':   va = (a.name || '').toLowerCase(); vb = (b.name || '').toLowerCase(); break;
        case 'price':  va = a.price; vb = b.price; break;
        case 'change': va = a.pct || 0; vb = b.pct || 0; break;
        default:       va = a.name; vb = b.name;
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return items;
  }, [prices, filter, sortBy, sortDir]);

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const sortIcon = (col) => sortBy === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '4px' }}>
            ⚡ Real-Time Prices
          </h2>
          <p style={{ fontSize: '11px', color: '#5A6478' }}>
            {rows.length} symbols • Updates every 2s
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '5px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.5px', cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                background: filter === cat ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.04)',
                color: filter === cat ? '#FFD700' : '#8892A4',
                outline: filter === cat ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { key: 'name', label: 'Asset' },
                { key: 'price', label: 'Price' },
                { key: 'change', label: 'Change' },
                { key: null, label: 'Trend' },
                { key: null, label: 'RSI' },
                { key: null, label: '24h Range' },
              ].map((col, i) => (
                <th
                  key={i}
                  onClick={() => col.key && handleSort(col.key)}
                  style={{
                    padding: '10px 12px', textAlign: i === 0 ? 'left' : 'right',
                    fontSize: '10px', fontWeight: 600, color: '#5A6478',
                    letterSpacing: '1.2px', textTransform: 'uppercase',
                    cursor: col.key ? 'pointer' : 'default',
                    userSelect: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}{col.key ? sortIcon(col.key) : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const up = (row.change || 0) >= 0;
              const changeColor = up ? '#00FF87' : '#FF4757';
              const rsi = row.indicators?.rsi14;
              const rsiColor = rsi > 70 ? '#FF4757' : rsi < 30 ? '#00FF87' : '#FFD700';

              return (
                <tr
                  key={row.id}
                  onClick={() => onSymbolClick && onSymbolClick(row.id)}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    cursor: onSymbolClick ? 'pointer' : 'default',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,215,0,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Asset Name */}
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', flexShrink: 0,
                    }}>{row.icon || '📊'}</span>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{row.name}</p>
                      <p style={{
                        fontSize: '10px', color: '#5A6478',
                        fontFamily: "'JetBrains Mono',monospace",
                        letterSpacing: '0.5px', textTransform: 'uppercase'
                      }}>{row.unit}</p>
                    </div>
                  </td>

                  {/* Price */}
                  <td style={{
                    padding: '12px', textAlign: 'right',
                    fontSize: '14px', fontWeight: 700, color: '#fff',
                    fontFamily: "'JetBrains Mono',monospace",
                  }}>
                    {formatPrice(row.price)}
                  </td>

                  {/* Change */}
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: 600, color: changeColor,
                      fontFamily: "'JetBrains Mono',monospace",
                      padding: '3px 8px', borderRadius: '6px',
                      background: `${changeColor}12`,
                    }}>
                      {up ? '▲' : '▼'} {Math.abs(row.pct || 0).toFixed(2)}%
                    </span>
                  </td>

                  {/* Mini Sparkline */}
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <MiniSparkline
                      data={[
                        row.openPrice || row.price,
                        ...(row.price > (row.openPrice || row.price) ?
                          [row.price * 0.999, row.price * 1.001, row.price] :
                          [row.price * 1.001, row.price * 0.999, row.price])
                      ]}
                      color={changeColor}
                    />
                  </td>

                  {/* RSI */}
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {rsi != null ? (
                      <span style={{
                        fontSize: '12px', fontWeight: 600, color: rsiColor,
                        fontFamily: "'JetBrains Mono',monospace",
                      }}>
                        {rsi.toFixed(0)}
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: '#3A4050' }}>—</span>
                    )}
                  </td>

                  {/* 24h Range */}
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                      <span style={{ fontSize: '10px', color: '#5A6478', fontFamily: "'JetBrains Mono',monospace" }}>
                        {formatPrice(row.low24h || row.price)} — {formatPrice(row.high24h || row.price)}
                      </span>
                      <div style={{
                        width: '60px', height: '3px', borderRadius: '2px',
                        background: 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden'
                      }}>
                        <div style={{
                          position: 'absolute', height: '100%', borderRadius: '2px',
                          background: 'linear-gradient(90deg, #00FF87, #FFD700, #FF4757)',
                          width: row.high24h && row.low24h && row.high24h !== row.low24h
                            ? `${((row.price - row.low24h) / (row.high24h - row.low24h)) * 100}%`
                            : '50%',
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#5A6478' }}>
          <p style={{ fontSize: '14px' }}>Waiting for real-time data...</p>
          <p style={{ fontSize: '11px', marginTop: '4px' }}>Prices will appear once the WebSocket connects</p>
        </div>
      )}
    </div>
  );
}
