'use client';

/**
 * ConnectionStatus — Small floating indicator showing WebSocket connection state.
 */
export default function ConnectionStatus({ isConnected, status }) {
  const source = status?.source || 'UNKNOWN';
  const symbols = status?.symbolCount || status?.symbols || 0;

  const sourceLabels = {
    FINNHUB_LIVE: 'Finnhub Live',
    SIMULATED: 'Simulated',
    DISCONNECTED: 'Disconnected',
    CONNECTING: 'Connecting...',
  };

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '6px 14px', borderRadius: '20px',
      background: isConnected ? 'rgba(0,255,135,0.08)' : 'rgba(255,71,87,0.08)',
      border: `1px solid ${isConnected ? 'rgba(0,255,135,0.25)' : 'rgba(255,71,87,0.25)'}`,
      fontSize: '11px', fontWeight: 600,
      transition: 'all 0.3s ease',
    }}>
      <span style={{
        width: '7px', height: '7px', borderRadius: '50%',
        background: isConnected ? '#00FF87' : '#FF4757',
        boxShadow: isConnected ? '0 0 8px #00FF87' : '0 0 8px #FF4757',
        animation: isConnected ? 'pulse 2s ease infinite' : 'none',
      }} />
      <span style={{ color: isConnected ? '#00FF87' : '#FF4757' }}>
        {sourceLabels[source] || source}
      </span>
      {isConnected && symbols > 0 && (
        <span style={{
          color: '#5A6478', fontSize: '10px',
          fontFamily: "'JetBrains Mono',monospace",
        }}>
          {symbols} symbols
        </span>
      )}
    </div>
  );
}
