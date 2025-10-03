import type {
  PlanterConfig,
  Parts,
  ComputedBoxConfig,
  SVGDiagram,
} from '../types';

interface DiagramConfig extends PlanterConfig {
  parts: Parts;
  box: ComputedBoxConfig;
}

export function generateAssemblyDiagram(config: DiagramConfig): SVGDiagram {
  const { box, parts } = config;
  const scale = 5; // SVG scale factor (pixels per inch)

  // Calculate dimensions
  const panelWidth = parts.sidePanelLength.length * scale;
  const panelHeight = parts.sidePanelLength.width * scale * 0.7; // Slightly compressed for visual
  const legWidth = box.legWidth * scale;
  const legHeight = box.height * scale;
  const rimHeight = parts.topRimLength?.width * scale || 10;
  const rimLengthSide = parts.topRimLength?.length * scale || panelWidth;
  const rimWidthSide = parts.topRimWidth?.length * scale || panelWidth;

  // Side panel dimensions (compressed width for side view)
  const sidePanelWidth = box.interiorWidth * scale * 0.5;

  // Bottom slat dimensions
  const slatLength = parts.bottomSlat.length * scale;
  const slatHeight = parts.bottomSlat.width * scale * 0.4;
  const slatSpacing = 5;

  return {
    width: 700,
    height: 340,
    sections: [
      // FRONT PANEL ASSEMBLY
      {
        elements: [
          // Side panels (3 rows)
          ...Array.from({ length: box.panelRows }, (_, i) => ({
            type: 'rect',
            x: 60,
            y: 50 + i * panelHeight,
            width: panelWidth,
            height: panelHeight,
            fill: '#ffe5b4',
            stroke: '#986a3d',
            strokeWidth: 2,
          })),
          // Left leg
          {
            type: 'rect',
            x: 60 - legWidth / 2,
            y: 50 - 5,
            width: legWidth,
            height: legHeight,
            fill: '#d2a56d',
            stroke: '#7b6241',
            strokeWidth: 2,
          },
          // Right leg
          {
            type: 'rect',
            x: 60 + panelWidth - legWidth / 2,
            y: 50 - 5,
            width: legWidth,
            height: legHeight,
            fill: '#d2a56d',
            stroke: '#7b6241',
            strokeWidth: 2,
          },
          // Top rim (if exists)
          ...(parts.topRimLength
            ? [
                {
                  type: 'rect',
                  x: 60 - legWidth / 2,
                  y: 50 - 5 - rimHeight,
                  width: rimLengthSide,
                  height: rimHeight,
                  fill: '#ffe6ba',
                  stroke: '#b1976e',
                  strokeWidth: 1,
                },
              ]
            : []),
          // Callout labels
          {
            type: 'text',
            x: 60 + panelWidth / 2,
            y: 50 + panelHeight + 5,
            fontSize: 19,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '①',
          },
          {
            type: 'text',
            x: 60 - legWidth - 10,
            y: 50 + legHeight / 2 + 5,
            fontSize: 19,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '③',
          },
          ...(parts.topRimLength
            ? [
                {
                  type: 'text',
                  x: 60 + panelWidth + 15,
                  y: 50 - 5,
                  fontSize: 17,
                  fill: '#7d5a3a',
                  fontWeight: 'bold',
                  content: '⑤',
                },
              ]
            : []),
          {
            type: 'text',
            x: 75,
            y: 32,
            fontSize: 14,
            fill: '#444',
            content: 'Front Panel Assembly',
          },
        ],
      },

      // SIDE PANEL ASSEMBLY
      {
        elements: [
          // Side panels (3 rows)
          ...Array.from({ length: box.panelRows }, (_, i) => ({
            type: 'rect',
            x: 300,
            y: 50 + i * panelHeight,
            width: sidePanelWidth,
            height: panelHeight,
            fill: '#ffdca8',
            stroke: '#986a3d',
            strokeWidth: 2,
          })),
          // Left leg (thinner for side view)
          {
            type: 'rect',
            x: 300 - legWidth * 0.7,
            y: 50 - 5,
            width: legWidth * 0.7,
            height: legHeight,
            fill: '#cfac7e',
            stroke: '#7b6241',
            strokeWidth: 2,
          },
          // Right leg (thinner for side view)
          {
            type: 'rect',
            x: 300 + sidePanelWidth,
            y: 50 - 5,
            width: legWidth * 0.7,
            height: legHeight,
            fill: '#cfac7e',
            stroke: '#7b6241',
            strokeWidth: 2,
          },
          // Top rim (if exists)
          ...(parts.topRimWidth
            ? [
                {
                  type: 'rect',
                  x: 300 - legWidth * 0.7,
                  y: 50 - 5 - rimHeight,
                  width: sidePanelWidth + legWidth * 1.4,
                  height: rimHeight,
                  fill: '#ffe6ba',
                  stroke: '#b1976e',
                  strokeWidth: 1,
                },
              ]
            : []),
          // Callout labels
          {
            type: 'text',
            x: 300 + sidePanelWidth / 2 - 5,
            y: 50 + panelHeight + 5,
            fontSize: 19,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '②',
          },
          {
            type: 'text',
            x: 300 - legWidth - 10,
            y: 50 + legHeight / 2 + 5,
            fontSize: 19,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '③',
          },
          ...(parts.topRimWidth
            ? [
                {
                  type: 'text',
                  x: 300 + sidePanelWidth + 20,
                  y: 50 - 5,
                  fontSize: 17,
                  fill: '#7d5a3a',
                  fontWeight: 'bold',
                  content: '⑥',
                },
              ]
            : []),
          {
            type: 'text',
            x: 302,
            y: 32,
            fontSize: 14,
            fill: '#444',
            content: 'Side Panel Assembly',
          },
        ],
      },

      // BOTTOM VIEW (SLATS)
      {
        elements: [
          // Frame outline (dashed) - shows interior dimensions
          {
            type: 'rect',
            x: 510,
            y: 90,
            width: box.interiorLength * scale,
            height: box.interiorWidth * scale,
            fill: 'none',
            stroke: '#aaa',
            strokeWidth: 2,
            strokeDasharray: '6,4',
          },
          // Bottom slats - arranged across the width
          ...Array.from({ length: box.bottomSlats }, (_, i) => ({
            type: 'rect',
            x: 510,
            y: 90 + i * (slatHeight + slatSpacing),
            width: slatLength,
            height: slatHeight,
            fill: '#fff1cf',
            stroke: '#ad893c',
            strokeWidth: 2,
          })),
          // Callout
          {
            type: 'text',
            x: 510 + slatLength / 2 - 5,
            y: 90 + slatHeight - 2,
            fontSize: 19,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '④',
          },
          {
            type: 'text',
            x: 520,
            y: 80,
            fontSize: 14,
            fill: '#444',
            content: 'Bottom View (Slats)',
          },
        ],
      },

      // TOP RIM CORNER ASSEMBLY (showing how ④ and ⑤ meet)
      ...(parts.topRimLength && parts.topRimWidth
        ? [
            {
              elements: [
                // Title
                {
                  type: 'text',
                  x: 70,
                  y: 200,
                  fontSize: 14,
                  fill: '#444',
                  content: 'Top Rim Corner (Top View)',
                },
                // Length side rim (④) - horizontal
                {
                  type: 'rect',
                  x: 60,
                  y: 220,
                  width: rimLengthSide * 0.6,
                  height: rimHeight,
                  fill: '#ffe6ba',
                  stroke: '#b1976e',
                  strokeWidth: 2,
                },
                // Width side rim (⑤) - vertical
                {
                  type: 'rect',
                  x: 60,
                  y: 220,
                  width: rimHeight,
                  height: rimWidthSide * 0.6,
                  fill: '#ffd89a',
                  stroke: '#b1976e',
                  strokeWidth: 2,
                },
                // Corner overlap indicator (darker)
                {
                  type: 'rect',
                  x: 60,
                  y: 220,
                  width: rimHeight,
                  height: rimHeight,
                  fill: '#d4a574',
                  stroke: '#8b6f47',
                  strokeWidth: 2,
                },
                // Label for length side
                {
                  type: 'text',
                  x: 60 + rimLengthSide * 0.3,
                  y: 220 + rimHeight / 2 + 5,
                  fontSize: 17,
                  fill: '#7d5a3a',
                  fontWeight: 'bold',
                  content: '⑤',
                },
                // Label for width side
                {
                  type: 'text',
                  x: 60 + rimHeight / 2 - 4,
                  y: 220 + rimWidthSide * 0.3,
                  fontSize: 17,
                  fill: '#7d5a3a',
                  fontWeight: 'bold',
                  content: '⑥',
                },
                // Dimension arrows and text
                {
                  type: 'text',
                  x: 60 + rimLengthSide * 0.6 + 10,
                  y: 220 + rimHeight / 2 + 5,
                  fontSize: 11,
                  fill: '#666',
                  content: `${parts.topRimLength.length}"`,
                },
                {
                  type: 'text',
                  x: 60 + rimHeight + 5,
                  y: 220 + rimWidthSide * 0.6 + 15,
                  fontSize: 11,
                  fill: '#666',
                  content: `${parts.topRimWidth.length}"`,
                },
              ],
            },
          ]
        : []),
    ],
  };
}
