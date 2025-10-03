import type { Plank } from '../types';
import {formatFraction} from "../utils/formatFraction.ts";

interface RippedPlankProps {
  plank: Plank;
  plankLength: number;
  scale: number;
}

export function RippedPlank({ plank, plankLength, scale }: RippedPlankProps) {
  if (!plank.strips || plank.strips.length === 0 || !plankLength || plankLength <= 0) {
    return null;
  }

  const stripHeight = `${100 / plank.strips.length}%`;
  const plankHeight = plank.strips.length * 19;

  return (
    <div className="plank-row">
      <span className="plank-label">{plank.label}</span>
      <div
        className="plank"
        style={{ height: `${plankHeight}px`, flexDirection: 'column' }}
      >
        {plank.strips.map((strip, idx) => (
          <div
            key={idx}
            className="rip-half"
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              height: stripHeight,
              position: 'relative',
              borderBottom:
                idx < plank.strips.length - 1 ? '2px dotted #b14416' : 'none',
            }}
          >
            {strip.cuts.map((cut, cutIdx) => {
              const cssClass = cut.spare ? 'cut spare' : 'cut';
              const labelText = cut.spare ? 'spare' : cut.label;
              const isLastCut = cutIdx === strip.cuts.length - 1;
              const count = cut.count || 1;

              return Array.from({ length: count }, (_, i) => {
                const cutWidth = cut.length * scale;
                // Don't show right border between cuts of the same type, only between different cut types
                const isLastOfType = i === count - 1;
                const showBorder = !isLastOfType && !cut.spare;
                // Show rip label in first non-spare cut only
                const showRipLabel = cutIdx === 0 && i === 0 && !cut.spare;

                return (
                  <div
                    key={`${cutIdx}-${i}`}
                    className={cssClass}
                    style={{
                      width: `${cutWidth}px`,
                      height: '100%',
                      borderBottom: 'none',
                      borderRight: showBorder ? '2px dashed #b14416' : 'none',
                      position: 'relative',
                    }}
                  >
                    {showRipLabel && (
                      <span
                        className="rip-label"
                        style={{
                          position: 'absolute',
                          right: '4px',
                          top: '2px',
                          fontSize: '11px',
                        }}
                      >
                        {strip.ripLabel}
                      </span>
                    )}
                    <strong>{labelText}</strong>
                      <span dangerouslySetInnerHTML={{__html: formatFraction(cut.length)}}></span>

                  </div>
                );
              });
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
