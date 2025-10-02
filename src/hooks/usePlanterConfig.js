import { useMemo } from 'react';
import { generateAssemblyDiagram } from '../utils/generateSVG';

export function usePlanterConfig(config) {
  return useMemo(() => {
    // Return early if config is not ready
    if (!config || !config.box) {
      return config;
    }

    const { box, plankLength, plankWidth, sparePlanks } = config;

    // Calculate how many plank rows fit within the box height
    const panelRows = Math.floor(box.height / plankWidth);

    // Calculate part dimensions and counts based on box geometry
    const sidePanelLength = box.interiorLength;
    const sidePanelCount = panelRows * 4;

    const legHeight = box.height;
    const legCount = 8;

    const bottomSlatLength = box.interiorLength;
    const bottomSlatCount = box.bottomSlats;

    const topRimLength = box.interiorLength + (box.legWidth * 2);

    // Auto-generate parts
    const parts = {
      sidePanel: {
        length: sidePanelLength,
        width: plankWidth,
        count: sidePanelCount,
        symbol: "①"
      },
      leg: {
        length: legHeight,
        width: box.legWidth,
        count: legCount,
        symbol: "②"
      },
      bottomSlat: {
        length: bottomSlatLength,
        width: plankWidth,
        count: bottomSlatCount,
        symbol: "③"
      }
    };

    if (box.hasTopRim) {
      parts.topRim = {
        length: topRimLength,
        width: box.topRimWidth,
        count: 4,
        symbol: "④"
      };
    }

    // Generate cut patterns
    const cutPatterns = [];

    // Side panels
    const sidePanelsPerPlank = Math.floor(plankLength / sidePanelLength);
    const sidePanelPlanksNeeded = Math.ceil(sidePanelCount / sidePanelsPerPlank);

    for (let i = 0; i < sidePanelPlanksNeeded; i++) {
      const cutsInThisPlank = Math.min(sidePanelsPerPlank, sidePanelCount - (i * sidePanelsPerPlank));
      cutPatterns.push({
        part: "sidePanel",
        count: cutsInThisPlank,
        planks: 1
      });
    }

    // Legs (ripped planks)
    const legsPerStripLengthwise = Math.floor(plankLength / legHeight);
    const stripsPerPlankWidthwise = Math.floor(plankWidth / box.legWidth);
    const legsPerPlank = legsPerStripLengthwise * stripsPerPlankWidthwise;
    const legPlanksNeeded = Math.ceil(legCount / legsPerPlank);

    for (let i = 0; i < legPlanksNeeded; i++) {
      const remainingLegs = legCount - (i * legsPerPlank);
      cutPatterns.push({
        part: "leg",
        count: Math.min(legsPerPlank, remainingLegs),
        planks: 1,
        ripped: true
      });
    }

    // Bottom slats
    const bottomSlatsPerPlank = Math.floor(plankLength / bottomSlatLength);
    const bottomSlatPlanksNeeded = Math.ceil(bottomSlatCount / bottomSlatsPerPlank);

    for (let i = 0; i < bottomSlatPlanksNeeded; i++) {
      const cutsInThisPlank = Math.min(bottomSlatsPerPlank, bottomSlatCount - (i * bottomSlatsPerPlank));
      cutPatterns.push({
        part: "bottomSlat",
        count: cutsInThisPlank,
        planks: 1
      });
    }

    // Top rim
    if (box.hasTopRim) {
      // Calculate how many pieces fit on one plank (considering both dimensions)
      const piecesPerStripLengthwise = Math.floor(plankLength / topRimLength);
      const stripsPerPlankWidthwise = Math.floor(plankWidth / parts.topRim.width);
      const topRimPerPlank = piecesPerStripLengthwise * stripsPerPlankWidthwise;
      const topRimPlanksNeeded = Math.ceil(4 / topRimPerPlank);

      for (let i = 0; i < topRimPlanksNeeded; i++) {
        const cutsInThisPlank = Math.min(topRimPerPlank, 4 - (i * topRimPerPlank));
        cutPatterns.push({
          part: "topRim",
          count: cutsInThisPlank,
          planks: 1,
          ripped: true
        });
      }
    }

    // Spare planks
    if (sparePlanks > 0) {
      cutPatterns.push({ spare: true, planks: sparePlanks });
    }

    // Calculate total planks
    const totalPlanks = cutPatterns.reduce((sum, pattern) => sum + pattern.planks, 0);

    // Generate planks
    const planks = generatePlanks(cutPatterns, parts, plankLength, plankWidth);

    // Generate legend
    const legend = Object.entries(parts).map(([key, part]) => ({
      symbol: part.symbol,
      description: `${key.replace(/([A-Z])/g, ' $1').trim()} (${part.count}x): ${part.length}" × ${part.width}"`
    }));

    // Generate SVG diagram dynamically
    const svg = generateAssemblyDiagram({ ...config, parts, box: { ...box, panelRows } });

    return {
      ...config,
      parts,
      cutPatterns,
      totalPlanks,
      planks,
      legend,
      svg
    };
  }, [config]);
}

function generatePlanks(cutPatterns, parts, plankLength, plankWidth) {
  let plankNum = 1;

  return cutPatterns.flatMap(pattern =>
    Array.from({ length: pattern.planks }, () => {
      const plank = { label: `Plank ${plankNum++}` };

      if (pattern.spare) {
        plank.type = "spare";
      } else {
        const part = parts[pattern.part];
        const totalCutLength = part.length * pattern.count;
        const spareLength = plankLength - totalCutLength;

        // Automatically detect if ripping is needed based on part width
        const needsRip = part.width < plankWidth;

        if (needsRip) {
          switch (pattern.part) {
            case "leg":
              // Ripped planks already have labels in each strip
              Object.assign(plank, createLegPlank(part, pattern, plankLength));
              break;
            case "topRim":
              // Multi-rip planks already have labels in each section
              Object.assign(plank, createTopRimPlank(part, pattern, plankLength));
              break;
            default:
              // For any other part that needs ripping, use normal plank with label
              Object.assign(plank, createNormalPlank(part, pattern, spareLength));
              plank.ripWidth = part.width;
              break;
          }
        } else {
          // Normal full-width planks - no rip label needed
          Object.assign(plank, createNormalPlank(part, pattern, spareLength));
        }
      }

      return plank;
    })
  );
}

function createLegPlank(part, pattern, plankLength) {
  // Calculate how many pieces fit on one strip lengthwise
  const piecesPerStrip = Math.floor(plankLength / part.length);
  const totalPieces = pattern.count;

  // Calculate how many strips we need
  const stripsNeeded = Math.ceil(totalPieces / piecesPerStrip);

  const strips = [];
  let remainingPieces = totalPieces;

  for (let i = 0; i < stripsNeeded; i++) {
    const piecesInThisStrip = Math.min(piecesPerStrip, remainingPieces);
    const totalCutLength = piecesInThisStrip * part.length;

    strips.push({
      ripLabel: `rip to ${part.width}"`,
      cuts: [
        { length: part.length, label: part.symbol, count: piecesInThisStrip },
        { length: plankLength - totalCutLength, label: "spare", spare: true }
      ]
    });

    remainingPieces -= piecesInThisStrip;
  }

  return {
    type: "ripped",
    ripWidth: part.width,
    strips
  };
}

function createTopRimPlank(part, pattern, plankLength) {
  // Calculate how many pieces fit on one strip lengthwise
  const piecesPerStrip = Math.floor(plankLength / part.length);
  const totalPieces = pattern.count;

  // Calculate how many strips we need (optimize to use fewer strips)
  const stripsNeeded = Math.ceil(totalPieces / piecesPerStrip);

  const strips = [];
  let remainingPieces = totalPieces;

  for (let i = 0; i < stripsNeeded; i++) {
    const piecesInThisStrip = Math.min(piecesPerStrip, remainingPieces);
    const totalCutLength = piecesInThisStrip * part.length;

    strips.push({
      ripLabel: `rip to ${part.width}"`,
      cuts: [
        { length: part.length, label: part.symbol, count: piecesInThisStrip },
        { length: plankLength - totalCutLength, label: "spare", spare: true }
      ]
    });

    remainingPieces -= piecesInThisStrip;
  }

  return {
    type: "ripped",
    ripWidth: part.width,
    strips
  };
}

function createNormalPlank(part, pattern, spareLength) {
  return {
    type: "normal",
    cuts: [
      { length: part.length, label: part.symbol, count: pattern.count },
      { length: spareLength, label: "spare", spare: true }
    ]
  };
}
