import type { LegendItem } from '../types';

interface LegendProps {
  legend: LegendItem[];
  plankLength: number;
}

export function Legend({ legend, plankLength }: LegendProps) {
  return (
    <div className="legend">
      <b>Legend:</b>
      <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
        {legend.map((item, idx) => (
          <li key={idx}>
            <strong>{item.symbol}</strong> {item.description}
          </li>
        ))}
      </ul>
      <span style={{ fontSize: '12px', color: '#888' }}>
        Each row is one {plankLength / 12}' plank. Dotted lines = rips. Spare =
        waste or material for errors/optional trim.
      </span>
    </div>
  );
}
