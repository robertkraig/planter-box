export function generateAssemblyDiagram(config) {
  const { box, parts } = config;
  const scale = 5; // SVG scale factor (pixels per inch)

  // Calculate dimensions
  const panelWidth = parts.sidePanel.length * scale;
  const panelHeight = (parts.sidePanel.width * scale) * 0.7; // Slightly compressed for visual
  const legWidth = box.legWidth * scale;
  const legHeight = box.height * scale;
  const rimHeight = parts.topRim?.width * scale || 10;
  const rimLength = parts.topRim?.length * scale || panelWidth;

  // Side panel dimensions (compressed width for side view)
  const sidePanelWidth = box.interiorWidth * scale * 0.5;

  // Bottom slat dimensions
  const slatLength = parts.bottomSlat.length * scale;
  const slatHeight = parts.bottomSlat.width * scale * 0.4;
  const slatSpacing = 5;

  return {
    width: 700,
    height: 240,
    sections: [
      // FRONT PANEL ASSEMBLY
      {
        elements: [
          // Side panels (3 rows)
          ...Array.from({ length: box.panelRows }, (_, i) => ({
            type: 'rect',
            x: 60,
            y: 50 + (i * panelHeight),
            width: panelWidth,
            height: panelHeight,
            fill: '#ffe5b4',
            stroke: '#986a3d',
            strokeWidth: 2
          })),
          // Left leg
          {
            type: 'rect',
            x: 60 - (legWidth / 2),
            y: 50 - 5,
            width: legWidth,
            height: legHeight,
            fill: '#d2a56d',
            stroke: '#7b6241',
            strokeWidth: 2
          },
          // Right leg
          {
            type: 'rect',
            x: 60 + panelWidth - (legWidth / 2),
            y: 50 - 5,
            width: legWidth,
            height: legHeight,
            fill: '#d2a56d',
            stroke: '#7b6241',
            strokeWidth: 2
          },
          // Top rim (if exists)
          ...(parts.topRim ? [{
            type: 'rect',
            x: 60 - (legWidth / 2),
            y: 50 - 5 - rimHeight,
            width: rimLength,
            height: rimHeight,
            fill: '#ffe6ba',
            stroke: '#b1976e',
            strokeWidth: 1
          }] : []),
          // Callout labels
          {
            type: 'text',
            x: 60 + (panelWidth / 2),
            y: 50 + panelHeight + 5,
            fontSize: 19,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '①'
          },
          {
            type: 'text',
            x: 60 - legWidth - 10,
            y: 50 + (legHeight / 2) + 5,
            fontSize: 19,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '②'
          },
          ...(parts.topRim ? [{
            type: 'text',
            x: 60 + panelWidth + 15,
            y: 50 - 5,
            fontSize: 17,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '④'
          }] : []),
          {
            type: 'text',
            x: 75,
            y: 32,
            fontSize: 14,
            fill: '#444',
            content: 'Front Panel Assembly'
          }
        ]
      },

      // SIDE PANEL ASSEMBLY
      {
        elements: [
          // Side panels (3 rows)
          ...Array.from({ length: box.panelRows }, (_, i) => ({
            type: 'rect',
            x: 300,
            y: 50 + (i * panelHeight),
            width: sidePanelWidth,
            height: panelHeight,
            fill: '#ffdca8',
            stroke: '#986a3d',
            strokeWidth: 2
          })),
          // Left leg (thinner for side view)
          {
            type: 'rect',
            x: 300 - (legWidth * 0.7),
            y: 50 - 5,
            width: legWidth * 0.7,
            height: legHeight,
            fill: '#cfac7e',
            stroke: '#7b6241',
            strokeWidth: 2
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
            strokeWidth: 2
          },
          // Top rim (if exists)
          ...(parts.topRim ? [{
            type: 'rect',
            x: 300 - (legWidth * 0.7),
            y: 50 - 5 - rimHeight,
            width: sidePanelWidth + (legWidth * 1.4),
            height: rimHeight,
            fill: '#ffe6ba',
            stroke: '#b1976e',
            strokeWidth: 1
          }] : []),
          // Callout labels
          {
            type: 'text',
            x: 300 + (sidePanelWidth / 2) - 5,
            y: 50 + panelHeight + 5,
            fontSize: 19,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '①'
          },
          {
            type: 'text',
            x: 300 - legWidth - 10,
            y: 50 + (legHeight / 2) + 5,
            fontSize: 19,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '②'
          },
          ...(parts.topRim ? [{
            type: 'text',
            x: 300 + sidePanelWidth + 20,
            y: 50 - 5,
            fontSize: 17,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '④'
          }] : []),
          {
            type: 'text',
            x: 302,
            y: 32,
            fontSize: 14,
            fill: '#444',
            content: 'Side Panel Assembly'
          }
        ]
      },

      // BOTTOM VIEW (SLATS)
      {
        elements: [
          // Frame outline (dashed)
          {
            type: 'rect',
            x: 510,
            y: 90,
            width: slatLength,
            height: slatLength,
            fill: 'none',
            stroke: '#aaa',
            strokeWidth: 2,
            strokeDasharray: '6,4'
          },
          // Bottom slats
          ...Array.from({ length: box.bottomSlats }, (_, i) => ({
            type: 'rect',
            x: 510,
            y: 100 + (i * (slatHeight + slatSpacing)),
            width: slatLength,
            height: slatHeight,
            fill: '#fff1cf',
            stroke: '#ad893c',
            strokeWidth: 2
          })),
          // Callout
          {
            type: 'text',
            x: 510 + (slatLength / 2) - 5,
            y: 100 + slatHeight - 2,
            fontSize: 19,
            fill: '#7d5a3a',
            fontWeight: 'bold',
            content: '③'
          },
          {
            type: 'text',
            x: 520,
            y: 85,
            fontSize: 14,
            fill: '#444',
            content: 'Bottom View (Slats)'
          }
        ]
      }
    ]
  };
}
