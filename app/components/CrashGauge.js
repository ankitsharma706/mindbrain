'use client';
import { useEffect, useState } from 'react';

export default function CrashGauge({ score = 42, riskLevel = 'MODERATE' }) {
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (s) => {
    if (s >= 80) return '#FF1414';
    if (s >= 60) return '#FF4757';
    if (s >= 40) return '#FFD700';
    return '#00FF87';
  };

  const getRiskLabel = (s) => {
    if (s >= 80) return { label: 'CRITICAL', color: '#FF1414' };
    if (s >= 60) return { label: 'HIGH', color: '#FF4757' };
    if (s >= 40) return { label: 'MODERATE', color: '#FFD700' };
    return { label: 'LOW', color: '#00FF87' };
  };

  const risk = getRiskLabel(animScore);
  const color = getColor(animScore);

  // SVG gauge
  const radius = 70;
  const strokeWidth = 12;
  const cx = 90, cy = 90;
  const startAngle = -210;
  const endAngle = 30;
  const totalAngle = endAngle - startAngle; // 240 degrees
  const progress = animScore / 100;
  const currentAngle = startAngle + totalAngle * progress;

  const polarToCartesian = (cx, cy, r, angleDeg) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: Number((cx + r * Math.cos(rad)).toFixed(3)),
      y: Number((cy + r * Math.sin(rad)).toFixed(3))
    };
  };

  const describeArc = (cx, cy, r, startDeg, endDeg) => {
    const start = polarToCartesian(cx, cy, r, endDeg);
    const end = polarToCartesian(cx, cy, r, startDeg);
    const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const needlePt = polarToCartesian(cx, cy, radius - 8, currentAngle);

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="180" height="120" viewBox="0 0 180 120">
        {/* Background track */}
        <path
          d={describeArc(cx, cy, radius, startAngle, endAngle)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Colored fill */}
        <path
          d={describeArc(cx, cy, radius, startAngle, currentAngle)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ transition: 'all 1.2s ease', filter: `drop-shadow(0 0 8px ${color})` }}
        />
        {/* Ticks */}
        {[0, 25, 50, 75, 100].map((val) => {
          const angle = startAngle + (totalAngle * val) / 100;
          const outer = polarToCartesian(cx, cy, radius + 10, angle);
          const inner = polarToCartesian(cx, cy, radius + 4, angle);
          return (
            <line key={val} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          );
        })}
        {/* Needle line */}
        <line
          x1={cx} y1={cy}
          x2={needlePt.x} y2={needlePt.y}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'all 1.2s ease' }}
        />
        <circle cx={cx} cy={cy} r="5" fill={color} style={{ transition: 'all 1.2s ease' }} />
        {/* Score text */}
        <text x={cx} y={cy + 24} textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="'JetBrains Mono',monospace">
          {animScore}%
        </text>
      </svg>

      {/* Risk label */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: `${color}18`,
        border: `1px solid ${color}50`,
        borderRadius: '20px',
        padding: '6px 18px',
        marginTop: '-8px'
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }} />
        <span style={{ fontSize: '12px', fontWeight: 700, color, letterSpacing: '1.5px' }}>
          {risk.label} RISK
        </span>
      </div>
    </div>
  );
}
