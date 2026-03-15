'use client';
import { useState, useEffect } from 'react';

/**
 * NewsFeed — Displays an aggregated list of commodity news.
 */
export default function NewsFeed({ asset = null }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const url = asset 
          ? `${baseUrl}/api/news/commodities?asset=${asset}&limit=100`
          : `${baseUrl}/api/news/commodities?limit=100`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setNews(data.news || []);
      } catch (err) {
        console.error('Failed to fetch aggregated news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [asset]);

  const displayedNews = news.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  if (loading && news.length === 0) {
    return (
      <div className="glass-card-static" style={{ padding: '40px', textAlign: 'center' }}>
        <div className="loader" style={{ margin: '0 auto 20px' }} />
        <p style={{ color: '#8892A4' }}>Aggregating global commodity news...</p>
      </div>
    );
  }

  return (
    <div className="glass-card-static" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
          📰 {asset ? asset.toUpperCase() : 'Global'} Market News
        </h3>
        <span style={{ fontSize: '11px', color: '#5A6478', letterSpacing: '1px' }}>{news.length} ARTICLES TODAY</span>
      </div>

      <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '12px' }}>
        {displayedNews.length > 0 ? displayedNews.map((item, idx) => (
          <a 
            key={idx} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'block', textDecoration: 'none', padding: '14px', 
              borderBottom: '1px solid rgba(255,255,255,0.04)', 
              borderRadius: '8px', transition: 'background 0.2s'
            }}
            className="news-item-hover"
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ 
                minWidth: '45px', height: '45px', background: 'rgba(255,215,0,0.05)', 
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', border: '1px solid rgba(255,215,0,0.1)'
              }}>
                {item.source === 'Reuters' ? '🚩' : item.source.includes('Yahoo') ? '💜' : '🌐'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#FFD700', fontWeight: 700, letterSpacing: '0.5px' }}>{item.source.toUpperCase()}</span>
                  <span style={{ fontSize: '10px', color: '#5A6478' }}>
                    {new Date(item.publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#fff', fontWeight: 600, lineHeight: 1.4, marginBottom: '4px' }}>{item.title}</p>
                <p style={{ fontSize: '12px', color: '#8892A4', textDecoration: 'none' }}>Click to read full coverage →</p>
              </div>
            </div>
          </a>
        )) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#5A6478' }}>No articles found for this category.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i} 
              onClick={() => setPage(i + 1)}
              style={{
                width: '32px', height: '32px', borderRadius: '8px', border: page === i + 1 ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                background: page === i + 1 ? 'rgba(255,215,0,0.1)' : 'transparent',
                color: page === i + 1 ? '#FFD700' : '#5A6478', cursor: 'pointer', fontSize: '12px', fontWeight: 700
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
