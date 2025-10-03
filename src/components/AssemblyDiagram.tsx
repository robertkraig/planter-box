import type { SVGDiagram } from '../types';

interface AssemblyDiagramProps {
  svg: SVGDiagram;
}

export function AssemblyDiagram({ svg }: AssemblyDiagramProps) {
  if (!svg) return null;

  return (
    <div
      className="assembly-diagram"
      style={{
        width: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '30px',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Assembly Diagram
      </h2>
      <svg
        width={svg.width || 700}
        height={svg.height || 340}
        viewBox={`0 0 ${svg.width || 700} ${svg.height || 340}`}
        fontFamily="sans-serif"
      >
        {svg.sections?.map((section, sectionIdx) => (
          <g key={sectionIdx}>
            {section.elements?.map((el, elIdx) => {
              if (el.type === 'rect') {
                return (
                  <rect
                    key={elIdx}
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill={el.fill}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth || 2}
                    strokeDasharray={el.strokeDasharray}
                  />
                );
              } else if (el.type === 'text') {
                return (
                  <text
                    key={elIdx}
                    x={el.x}
                    y={el.y}
                    fontSize={el.fontSize}
                    fill={el.fill}
                    fontWeight={el.fontWeight}
                  >
                    {el.content}
                  </text>
                );
              }
              return null;
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
