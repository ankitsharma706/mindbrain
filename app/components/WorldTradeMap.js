'use client';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

/**
 * WorldTradeMap — Interactive map showing global trade hubs.
 * Uses OpenStreetMap via Leaflet.
 */
export default function WorldTradeMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Dynamically import Leaflet only on client
    const initMap = async () => {
      const L = (await import('leaflet')).default;

      if (!mapInstance.current && mapRef.current) {
        mapInstance.current = L.map(mapRef.current).setView([20, 0], 2);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 20
        }).addTo(mapInstance.current);

        // Define major hubs
        const hubs = [
          { name: 'Shanghai, China', pos: [31.2304, 121.4737], type: 'Export Hub', desc: 'World biggest port' },
          { name: 'Dubai, UAE', pos: [25.2048, 55.2708], type: 'Gold Hub', desc: 'Trade center for metals' },
          { name: 'Mumbai, India', pos: [19.0760, 72.8777], type: 'Import Hub', desc: 'Major gold importing hub' },
          { name: 'Rotterdam, EU', pos: [51.9225, 4.4792], type: 'Energy Hub', desc: 'Main EU energy port' },
          { name: 'New York, USA', pos: [40.7128, -74.0060], type: 'Financial Hub', desc: 'COMEX Gold trading center' },
          { name: 'London, UK', pos: [51.5074, -0.1278], type: 'Trade Center', desc: 'LBMA Gold clearing' },
          { name: 'Singapore', pos: [1.3521, 103.8198], type: 'Oil/Gold Hub', desc: 'Major SE Asia trade center' },
        ];

        hubs.forEach(hub => {
          const marker = L.circleMarker(hub.pos, {
            radius: 8,
            fillColor: '#FFD700',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          }).addTo(mapInstance.current);

          marker.bindPopup(`
            <div style="color:#000; font-family:sans-serif;">
              <strong style="color:#FFD700; background:#000; padding:2px 6px; border-radius:4px; font-size:10px;">${hub.type}</strong>
              <div style="font-size:14px; font-weight:700; margin-top:4px;">${hub.name}</div>
              <div style="font-size:12px; color:#666; margin-top:2px;">${hub.desc}</div>
            </div>
          `);
        });
      }
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="glass-card-static" style={{ overflow: 'hidden', height: '450px', position: 'relative' }}>
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: '100%', background: '#050510' }} 
      />
      <div style={{
        position: 'absolute', top: '16px', right: '16px', zIndex: 1000,
        background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,215,0,0.3)',
        padding: '10px 16px', borderRadius: '12px', backdropFilter: 'blur(8px)'
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#FFD700', marginBottom: '4px' }}>Global Trade Infrastructure</h3>
        <p style={{ fontSize: '11px', color: '#8892A4' }}>Real-time monitoring of maritime and financial hubs</p>
      </div>
    </div>
  );
}
