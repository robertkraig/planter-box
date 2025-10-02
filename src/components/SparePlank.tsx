import type { Plank } from '../types';

interface SparePlankProps {
  plank: Plank;
  plankLength: number;
  scale: number;
}

export function SparePlank({ plank, plankLength, scale }: SparePlankProps) {
  return (
    <div className="plank-row">
      <span className="plank-label">{plank.label}</span>
      <div className="plank">
        <div
          className="cut spare"
          style={{ width: `${plankLength * scale}px` }}
        >
          spare
          <br />
          <span>{plankLength}"</span>
        </div>
      </div>
    </div>
  );
}
