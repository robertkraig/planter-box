import type { Plank } from '../types';

interface NormalPlankProps {
  plank: Plank;
  scale: number;
}

export function NormalPlank({ plank, scale }: NormalPlankProps) {
  return (
    <div className="plank-row">
      <span className="plank-label">{plank.label}</span>
      <div className="plank" style={{ position: 'relative' }}>
        {plank.ripWidth && (
          <span className="rip-label" style={{ right: '6px', top: '2px' }}>
            rip to {plank.ripWidth}"
          </span>
        )}
        {plank.cuts.map((cut, cutIdx) => {
          const width = cut.length * scale;
          const cssClass = cut.spare ? 'cut spare' : 'cut';
          const labelText = cut.spare ? 'spare' : cut.label;
          const count = cut.count || 1;

          return Array.from({ length: count }, (_, i) => (
            <div
              key={`${cutIdx}-${i}`}
              className={cssClass}
              style={{ width: `${width}px` }}
            >
              {labelText}<br />
              <span>{cut.length}"</span>
            </div>
          ));
        })}
      </div>
    </div>
  );
}
