export interface BoxConfig {
  interiorLength: number;
  interiorWidth: number;
  height: number;
  legWidth: number;
  legGap: number; // Gap below box (adds to leg length for elevation)
  hasTopRim: boolean;
  topRimWidth: number;
  bottomSlats?: number; // Optional - will be auto-calculated if not provided
  panelRows?: number; // Auto-calculated
}

export interface ComputedBoxConfig extends BoxConfig {
  bottomSlats: number;
  panelRows: number;
}

export interface PlanterConfig {
  title: string;
  plankLength: number;
  plankWidth: number;
  plankThickness: number;
  kerf: number;
  box: BoxConfig;
  sparePlanks: number;
}

export interface Part {
  length: number;
  width: number;
  count: number;
  symbol: string;
}

export interface Parts {
  sidePanelLength: Part;
  sidePanelWidth: Part;
  leg: Part;
  bottomSlat: Part;
  topRimLength?: Part;
  topRimWidth?: Part;
}

export interface Cut {
  length: number;
  label: string;
  count?: number;
  spare?: boolean;
  ripLabel?: string;
}

export interface Strip {
  ripLabel: string;
  cuts: Cut[];
}

export interface CutPattern {
  part?: string;
  count?: number;
  planks: number;
  ripped?: boolean;
  spare?: boolean;
}

export interface Plank {
  label: string;
  type?: 'normal' | 'ripped' | 'multi-rip' | 'spare';
  cuts?: Cut[];
  strips?: Strip[];
  ripWidth?: number;
}

export interface LegendItem {
  symbol: string;
  description: string;
}

export interface SVGElement {
  type: 'rect' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fontSize?: number;
  fontWeight?: string;
  content?: string;
}

export interface SVGSection {
  elements: SVGElement[];
}

export interface SVGDiagram {
  width: number;
  height: number;
  sections: SVGSection[];
}

export interface ExpandedConfig extends PlanterConfig {
  parts: Parts;
  cutPatterns: CutPattern[];
  totalPlanks: number;
  planks: Plank[];
  legend: LegendItem[];
  svg: SVGDiagram;
}
