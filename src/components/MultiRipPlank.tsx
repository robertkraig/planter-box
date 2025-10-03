import type { Plank } from '../types';
import { formatFraction } from '../utils/formatFraction.ts';

interface MultiRipPlankProps {
  plank: Plank;
  plankLength: number;
  scale: number;
}

export function MultiRipPlank({ plank, plankLength }: MultiRipPlankProps) {
  if (!plankLength || plankLength <= 0) {
    return null;
  }

  let totalWidth = 0;

  return (
    <div className="plank-row">
      <span className="plank-label">{plank.label}</span>
      <div className="plank" style={{ height: '38px' }}>
        {(plank.cuts ?? []).map((cut, cutIdx) => {
          if (cut.spare) {
            const remaining = plankLength - totalWidth;
            const widthPercent = (remaining / plankLength) * 100;

            return (
              <div
                key={cutIdx}
                className="cut spare"
                style={{ width: `${widthPercent}%` }}
              >
                spare
                <br />
                <span>~{cut.length}&quot;</span>
              </div>
            );
          }
          const widthPercent = (cut.length / plankLength) * 100;

          return Array.from({ length: cut.count ?? 1 }, (_, i) => {
            const showBorder = i < (cut.count ?? 1) - 1;
            totalWidth += cut.length;

            return (
              <div
                key={`${cutIdx}-${i}`}
                className="rip-half"
                style={{
                  width: `${widthPercent}%`,
                  borderRight: showBorder ? '2px dotted #b14416' : 'none',
                }}
              >
                <span className="rip-label">{cut.ripLabel}</span>
                <div className="cut" style={{ width: '100%', height: '100%' }}>
                  <strong>{cut.label}</strong>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formatFraction(cut.length),
                    }}
                  ></span>
                </div>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
