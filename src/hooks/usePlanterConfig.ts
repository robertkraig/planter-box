import { useMemo } from 'react';
import { generateAssemblyDiagram } from '../utils/generateSVG';
import type {
  PlanterConfig,
  ExpandedConfig,
  Parts,
  CutPattern,
  Plank,
  Part,
  Strip,
} from '../types';

export function usePlanterConfig(config: PlanterConfig): ExpandedConfig {
  return useMemo((): ExpandedConfig => {
    // Return early if config is not ready
    if (!config || !config.box) {
      return config as ExpandedConfig;
    }

    const { box, plankLength, plankWidth, kerf } = config;

    // Validate dimensions to prevent division by zero
    if (!plankLength || plankLength <= 0 || !plankWidth || plankWidth <= 0) {
      return config as ExpandedConfig;
    }

    // Calculate how many plank rows fit within the box height
    const panelRows = Math.floor(box.height / plankWidth);

    // Calculate part dimensions and counts based on box geometry
    const sidePanelLengthDim = box.interiorLength;
    const sidePanelWidthDim = box.interiorWidth;
    const sidePanelLengthCount = panelRows * 2; // 2 length sides
    const sidePanelWidthCount = panelRows * 2; // 2 width sides

    const legHeight = box.height + box.legGap;
    const legCount = 8;

    // Calculate bottom slat count dynamically based on interior width
    // Slats run along the length, spaced across the width
    const bottomSlatLength = box.interiorLength;
    const bottomSlatCount =
      box.bottomSlats ?? Math.ceil(box.interiorWidth / plankWidth);
    const bottomSlatGap = box.interiorWidth - bottomSlatCount * plankWidth;

    const topRimLengthSide = box.interiorLength + box.legWidth * 2;
    const topRimWidthSide = box.interiorWidth + box.legWidth * 2;

    // Auto-generate parts
    const parts: Parts = {
      sidePanelLength: {
        length: sidePanelLengthDim,
        width: plankWidth,
        count: sidePanelLengthCount,
        symbol: '①',
      },
      sidePanelWidth: {
        length: sidePanelWidthDim,
        width: plankWidth,
        count: sidePanelWidthCount,
        symbol: '②',
      },
      leg: {
        length: legHeight,
        width: box.legWidth,
        count: legCount,
        symbol: '③',
      },
      bottomSlat: {
        length: bottomSlatLength,
        width: plankWidth,
        count: bottomSlatCount,
        symbol: '④',
      },
      ...(box.hasTopRim && {
        topRimLength: {
          length: topRimLengthSide,
          width: box.topRimWidth,
          count: 2,
          symbol: '⑤',
        },
        topRimWidth: {
          length: topRimWidthSide,
          width: box.topRimWidth,
          count: 2,
          symbol: '⑥',
        },
      }),
    };

    // Generate cut patterns
    const cutPatterns = [];

    // Side panels - LENGTH sides (accounting for kerf between cuts)
    const sidePanelsLengthPerPlank = Math.floor(
      (plankLength + kerf) / (sidePanelLengthDim + kerf)
    );
    const sidePanelLengthPlanksNeeded = Math.ceil(
      sidePanelLengthCount / sidePanelsLengthPerPlank
    );

    for (let i = 0; i < sidePanelLengthPlanksNeeded; i++) {
      const cutsInThisPlank = Math.min(
        sidePanelsLengthPerPlank,
        sidePanelLengthCount - i * sidePanelsLengthPerPlank
      );
      cutPatterns.push({
        part: 'sidePanelLength',
        count: cutsInThisPlank,
        planks: 1,
      });
    }

    // Side panels - WIDTH sides (accounting for kerf between cuts)
    const sidePanelsWidthPerPlank = Math.floor(
      (plankLength + kerf) / (sidePanelWidthDim + kerf)
    );
    const sidePanelWidthPlanksNeeded = Math.ceil(
      sidePanelWidthCount / sidePanelsWidthPerPlank
    );

    for (let i = 0; i < sidePanelWidthPlanksNeeded; i++) {
      const cutsInThisPlank = Math.min(
        sidePanelsWidthPerPlank,
        sidePanelWidthCount - i * sidePanelsWidthPerPlank
      );
      cutPatterns.push({
        part: 'sidePanelWidth',
        count: cutsInThisPlank,
        planks: 1,
      });
    }

    // Legs (ripped planks, accounting for kerf between cuts)
    const legsPerStripLengthwise = Math.floor(
      (plankLength + kerf) / (legHeight + kerf)
    );
    const stripsPerPlankWidthwise = Math.floor(plankWidth / box.legWidth);
    const legsPerPlank = legsPerStripLengthwise * stripsPerPlankWidthwise;
    const legPlanksNeeded = Math.ceil(legCount / legsPerPlank);

    for (let i = 0; i < legPlanksNeeded; i++) {
      const remainingLegs = legCount - i * legsPerPlank;
      cutPatterns.push({
        part: 'leg',
        count: Math.min(legsPerPlank, remainingLegs),
        planks: 1,
        ripped: true,
      });
    }

    // Bottom slats (accounting for kerf between cuts)
    const bottomSlatsPerPlank = Math.floor(
      (plankLength + kerf) / (bottomSlatLength + kerf)
    );
    const bottomSlatPlanksNeeded = Math.ceil(
      bottomSlatCount / bottomSlatsPerPlank
    );

    for (let i = 0; i < bottomSlatPlanksNeeded; i++) {
      const cutsInThisPlank = Math.min(
        bottomSlatsPerPlank,
        bottomSlatCount - i * bottomSlatsPerPlank
      );
      cutPatterns.push({
        part: 'bottomSlat',
        count: cutsInThisPlank,
        planks: 1,
      });
    }

    // Top rim - length sides (accounting for kerf between cuts)
    if (box.hasTopRim && parts.topRimLength) {
      // Calculate how many pieces fit on one plank (considering both dimensions)
      const piecesPerStripLengthwise = Math.floor(
        (plankLength + kerf) / (topRimLengthSide + kerf)
      );
      const stripsPerPlankWidthwise = Math.floor(
        plankWidth / parts.topRimLength.width
      );
      const topRimPerPlank = piecesPerStripLengthwise * stripsPerPlankWidthwise;
      const topRimPlanksNeeded = Math.ceil(2 / topRimPerPlank);

      for (let i = 0; i < topRimPlanksNeeded; i++) {
        const cutsInThisPlank = Math.min(
          topRimPerPlank,
          2 - i * topRimPerPlank
        );
        cutPatterns.push({
          part: 'topRimLength',
          count: cutsInThisPlank,
          planks: 1,
          ripped: true,
        });
      }
    }

    // Top rim - width sides (accounting for kerf between cuts)
    if (box.hasTopRim && parts.topRimWidth) {
      // Calculate how many pieces fit on one plank (considering both dimensions)
      const piecesPerStripLengthwise = Math.floor(
        (plankLength + kerf) / (topRimWidthSide + kerf)
      );
      const stripsPerPlankWidthwise = Math.floor(
        plankWidth / parts.topRimWidth.width
      );
      const topRimPerPlank = piecesPerStripLengthwise * stripsPerPlankWidthwise;
      const topRimPlanksNeeded = Math.ceil(2 / topRimPerPlank);

      for (let i = 0; i < topRimPlanksNeeded; i++) {
        const cutsInThisPlank = Math.min(
          topRimPerPlank,
          2 - i * topRimPerPlank
        );
        cutPatterns.push({
          part: 'topRimWidth',
          count: cutsInThisPlank,
          planks: 1,
          ripped: true,
        });
      }
    }

    // Calculate total planks
    const totalPlanks = cutPatterns.reduce(
      (sum, pattern) => sum + pattern.planks,
      0
    );

    // Generate planks
    const planks = generatePlanks(
      cutPatterns,
      parts,
      plankLength,
      plankWidth,
      kerf
    );

    // Generate legend
    const legend = Object.entries(parts).map(([key, part]) => {
      let description = `${key.replace(/([A-Z])/g, ' $1').trim()} (${part.count}x): ${part.length}" × ${part.width}"`;

      // Add gap information for bottom slats
      if (key === 'bottomSlat' && bottomSlatGap > 0) {
        description += ` (${bottomSlatGap.toFixed(2)}" gap remaining)`;
      }

      return {
        symbol: part.symbol,
        description,
      };
    });

    // Calculate box volume
    const volumeCubicInches =
      box.interiorLength * box.interiorWidth * box.height;
    const volumeCubicFeet = volumeCubicInches / 1728;
    const volumeGallons = volumeCubicFeet * 7.48;

    // Add volume info to legend
    legend.push({
      symbol: '📦',
      description: `Capacity: ${volumeCubicFeet.toFixed(2)} ft³ (${volumeGallons.toFixed(1)} gallons)`,
    });

    // Generate SVG diagram dynamically
    const svg = generateAssemblyDiagram({
      ...config,
      parts,
      box: {
        ...box,
        panelRows,
        bottomSlats: bottomSlatCount,
      },
    });

    return {
      ...config,
      parts,
      cutPatterns,
      totalPlanks,
      planks,
      legend,
      svg,
    };
  }, [config]);
}

function generatePlanks(
  cutPatterns: CutPattern[],
  parts: Parts,
  plankLength: number,
  plankWidth: number,
  kerf: number
): Plank[] {
  let plankNum = 1;

  return cutPatterns.flatMap((pattern) =>
    Array.from({ length: pattern.planks }, (): Plank => {
      const label = `Plank ${plankNum++}`;

      if (pattern.spare) {
        return {
          label,
          type: 'spare',
        };
      }

      const partKey = pattern.part as keyof Parts;
      const part = parts[partKey];

      if (!part) {
        return { label, type: 'spare' };
      }

      const numPieces = pattern.count ?? 0;
      // Account for kerf: n pieces require n-1 cuts
      const totalCutLength = part.length * numPieces;
      const kerfLoss = kerf * Math.max(0, numPieces - 1);
      const spareLength = plankLength - totalCutLength - kerfLoss;

      // Automatically detect if ripping is needed based on part width
      const needsRip = part.width < plankWidth;

      if (needsRip) {
        switch (pattern.part) {
          case 'leg':
            return {
              label,
              ...createLegPlank(part, pattern, plankLength, kerf),
            };
          case 'topRimLength':
          case 'topRimWidth':
            return {
              label,
              ...createTopRimPlank(part, pattern, plankLength, kerf),
            };
          default:
            return {
              label,
              ...createNormalPlank(part, pattern, spareLength),
              ripWidth: part.width,
            };
        }
      } else {
        return {
          label,
          ...createNormalPlank(part, pattern, spareLength),
        };
      }
    })
  );
}

function createLegPlank(
  part: Part,
  pattern: CutPattern,
  plankLength: number,
  kerf: number
): Omit<Plank, 'label'> {
  // Calculate how many pieces fit on one strip lengthwise (accounting for kerf)
  const piecesPerStrip = Math.floor(
    (plankLength + kerf) / (part.length + kerf)
  );
  const totalPieces = pattern.count ?? 0;

  // Calculate how many strips we need
  const stripsNeeded = Math.ceil(totalPieces / piecesPerStrip);

  const strips: Strip[] = [];
  let remainingPieces = totalPieces;

  for (let i = 0; i < stripsNeeded; i++) {
    const piecesInThisStrip = Math.min(piecesPerStrip, remainingPieces);
    const totalCutLength = piecesInThisStrip * part.length;
    const kerfLoss = kerf * Math.max(0, piecesInThisStrip - 1);
    const spareLength = plankLength - totalCutLength - kerfLoss;

    strips.push({
      ripLabel: `rip to ${part.width}"`,
      cuts: [
        { length: part.length, label: part.symbol, count: piecesInThisStrip },
        { length: spareLength, label: 'spare', spare: true },
      ],
    });

    remainingPieces -= piecesInThisStrip;
  }

  return {
    type: 'ripped',
    ripWidth: part.width,
    strips,
  };
}

function createTopRimPlank(
  part: Part,
  pattern: CutPattern,
  plankLength: number,
  kerf: number
): Omit<Plank, 'label'> {
  // Calculate how many pieces fit on one strip lengthwise (accounting for kerf)
  const piecesPerStrip = Math.floor(
    (plankLength + kerf) / (part.length + kerf)
  );
  const totalPieces = pattern.count ?? 0;

  // Calculate how many strips we need (optimize to use fewer strips)
  const stripsNeeded = Math.ceil(totalPieces / piecesPerStrip);

  const strips: Strip[] = [];
  let remainingPieces = totalPieces;

  for (let i = 0; i < stripsNeeded; i++) {
    const piecesInThisStrip = Math.min(piecesPerStrip, remainingPieces);
    const totalCutLength = piecesInThisStrip * part.length;
    const kerfLoss = kerf * Math.max(0, piecesInThisStrip - 1);
    const spareLength = plankLength - totalCutLength - kerfLoss;

    strips.push({
      ripLabel: `rip to ${part.width}"`,
      cuts: [
        { length: part.length, label: part.symbol, count: piecesInThisStrip },
        { length: spareLength, label: 'spare', spare: true },
      ],
    });

    remainingPieces -= piecesInThisStrip;
  }

  return {
    type: 'ripped',
    ripWidth: part.width,
    strips,
  };
}

function createNormalPlank(
  part: Part,
  pattern: CutPattern,
  spareLength: number
): Omit<Plank, 'label'> {
  return {
    type: 'normal',
    cuts: [
      { length: part.length, label: part.symbol, count: pattern.count ?? 0 },
      { length: spareLength, label: 'spare', spare: true },
    ],
  };
}
