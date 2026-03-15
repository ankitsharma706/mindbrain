'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * useMarketData — React hook for real-time market prices via Socket.IO.
 *
 * Returns:
 *  - prices:      { [id]: { price, change, pct, name, ... } }
 *  - alerts:      [{ id, message, severity, ... }]  (last 20)
 *  - status:      { connected, source, symbolCount }
 *  - isConnected: boolean
 *  - getHistory:  (symbolId) => Promise<[{ price, time }]>
 */
export default function useMarketData() {
  const [prices, setPrices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [status, setStatus] = useState({ connected: false, source: 'CONNECTING', symbolCount: 0 });
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 50,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 30000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[MarketData] 🟢 Connected to WebSocket');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('[MarketData] 🔴 Disconnected from WebSocket');
      setIsConnected(false);
      setStatus(prev => ({ ...prev, connected: false, source: 'DISCONNECTED' }));
    });

    // Full price snapshot (on initial connect)
    socket.on('market:snapshot', (data) => {
      setPrices(data || {});
    });

    // Individual price update
    socket.on('market:price', (data) => {
      setPrices(prev => ({ ...prev, [data.id]: data }));
    });

    // Batch price updates (simulated feed sends these)
    socket.on('market:batch', (batch) => {
      setPrices(prev => {
        const next = { ...prev };
        for (const item of batch) {
          next[item.id] = item;
        }
        return next;
      });
    });

    // Alerts
    socket.on('market:alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 20));
    });

    // Connection status
    socket.on('market:status', (data) => {
      setStatus(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getHistory = useCallback((symbolId) => {
    return new Promise((resolve) => {
      if (socketRef.current) {
        socketRef.current.emit('market:getHistory', symbolId, (data) => {
          resolve(data || []);
        });
      } else {
        resolve([]);
      }
    });
  }, []);

  return { prices, alerts, status, isConnected, getHistory };
}
