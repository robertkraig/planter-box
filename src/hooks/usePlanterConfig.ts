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

    const { box, plankLength, plankWidth, sparePlanks } = config;

    // Calculate how many plank rows fit within the box height
    const panelRows = Math.floor(box.height / plankWidth);

    // Calculate part dimensions and counts based on box geometry
    const sidePanelLength = box.interiorLength;
    const sidePanelCount = panelRows * 4;

    const legHeight = box.height;
    const legCount = 8;

    // Calculate bottom slat count dynamically based on interior width
    // Slats run along the length, spaced across the width
    const bottomSlatLength = box.interiorLength;
    const bottomSlatCount =
      box.bottomSlats ?? Math.ceil(box.interiorWidth / plankWidth);
    const bottomSlatGap = box.interiorWidth - bottomSlatCount * plankWidth;

    const topRimLength = box.interiorLength + box.legWidth * 2;

    // Auto-generate parts
    const parts: Parts = {
      sidePanel: {
        length: sidePanelLength,
        width: plankWidth,
        count: sidePanelCount,
        symbol: '①',
      },
      leg: {
        length: legHeight,
        width: box.legWidth,
        count: legCount,
        symbol: '②',
      },
      bottomSlat: {
        length: bottomSlatLength,
        width: plankWidth,
        count: bottomSlatCount,
        symbol: '③',
      },
      ...(box.hasTopRim && {
        topRim: {
          length: topRimLength,
          width: box.topRimWidth,
          count: 4,
          symbol: '④',
        },
      }),
    };

    // Generate cut patterns
    const cutPatterns = [];

    // Side panels
    const sidePanelsPerPlank = Math.floor(plankLength / sidePanelLength);
    const sidePanelPlanksNeeded = Math.ceil(
      sidePanelCount / sidePanelsPerPlank
    );

    for (let i = 0; i < sidePanelPlanksNeeded; i++) {
      const cutsInThisPlank = Math.min(
        sidePanelsPerPlank,
        sidePanelCount - i * sidePanelsPerPlank
      );
      cutPatterns.push({
        part: 'sidePanel',
        count: cutsInThisPlank,
        planks: 1,
      });
    }

    // Legs (ripped planks)
    const legsPerStripLengthwise = Math.floor(plankLength / legHeight);
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

    // Bottom slats
    const bottomSlatsPerPlank = Math.floor(plankLength / bottomSlatLength);
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

    // Top rim
    if (box.hasTopRim && parts.topRim) {
      // Calculate how many pieces fit on one plank (considering both dimensions)
      const piecesPerStripLengthwise = Math.floor(plankLength / topRimLength);
      const stripsPerPlankWidthwise = Math.floor(
        plankWidth / parts.topRim.width
      );
      const topRimPerPlank = piecesPerStripLengthwise * stripsPerPlankWidthwise;
      const topRimPlanksNeeded = Math.ceil(4 / topRimPerPlank);

      for (let i = 0; i < topRimPlanksNeeded; i++) {
        const cutsInThisPlank = Math.min(
          topRimPerPlank,
          4 - i * topRimPerPlank
        );
        cutPatterns.push({
          part: 'topRim',
          count: cutsInThisPlank,
          planks: 1,
          ripped: true,
        });
      }
    }

    // Spare planks
    if (sparePlanks > 0) {
      cutPatterns.push({ spare: true, planks: sparePlanks });
    }

    // Calculate total planks
    const totalPlanks = cutPatterns.reduce(
      (sum, pattern) => sum + pattern.planks,
      0
    );

    // Generate planks
    const planks = generatePlanks(cutPatterns, parts, plankLength, plankWidth);

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
  plankWidth: number
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

      const totalCutLength = part.length * (pattern.count ?? 0);
      const spareLength = plankLength - totalCutLength;

      // Automatically detect if ripping is needed based on part width
      const needsRip = part.width < plankWidth;

      if (needsRip) {
        switch (pattern.part) {
          case 'leg':
            return {
              label,
              ...createLegPlank(part, pattern, plankLength),
            };
          case 'topRim':
            return {
              label,
              ...createTopRimPlank(part, pattern, plankLength),
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
  plankLength: number
): Omit<Plank, 'label'> {
  // Calculate how many pieces fit on one strip lengthwise
  const piecesPerStrip = Math.floor(plankLength / part.length);
  const totalPieces = pattern.count ?? 0;

  // Calculate how many strips we need
  const stripsNeeded = Math.ceil(totalPieces / piecesPerStrip);

  const strips: Strip[] = [];
  let remainingPieces = totalPieces;

  for (let i = 0; i < stripsNeeded; i++) {
    const piecesInThisStrip = Math.min(piecesPerStrip, remainingPieces);
    const totalCutLength = piecesInThisStrip * part.length;

    strips.push({
      ripLabel: `rip to ${part.width}"`,
      cuts: [
        { length: part.length, label: part.symbol, count: piecesInThisStrip },
        { length: plankLength - totalCutLength, label: 'spare', spare: true },
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
  plankLength: number
): Omit<Plank, 'label'> {
  // Calculate how many pieces fit on one strip lengthwise
  const piecesPerStrip = Math.floor(plankLength / part.length);
  const totalPieces = pattern.count ?? 0;

  // Calculate how many strips we need (optimize to use fewer strips)
  const stripsNeeded = Math.ceil(totalPieces / piecesPerStrip);

  const strips: Strip[] = [];
  let remainingPieces = totalPieces;

  for (let i = 0; i < stripsNeeded; i++) {
    const piecesInThisStrip = Math.min(piecesPerStrip, remainingPieces);
    const totalCutLength = piecesInThisStrip * part.length;

    strips.push({
      ripLabel: `rip to ${part.width}"`,
      cuts: [
        { length: part.length, label: part.symbol, count: piecesInThisStrip },
        { length: plankLength - totalCutLength, label: 'spare', spare: true },
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
