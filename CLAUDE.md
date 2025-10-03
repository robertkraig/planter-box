# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start Vite dev server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run ESLint on TypeScript files
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Deployment
- `npm run deploy` - Deploy to GitHub Pages (runs build first)

## Architecture

This is a React-based planter box cutlist generator that calculates optimal wood cutting patterns from configurable dimensions.

### Core Architecture Flow

1. **Configuration** (`config.json5`) - User-editable dimensions and material specs
   - Can be loaded from URL parameters for sharing configurations
   - Managed through draft state in ConfigForm to prevent expensive recalculations on every input change
2. **Computation** (`src/hooks/usePlanterConfig.ts`) - Central hook that:
   - Auto-calculates panel rows, bottom slats, and part counts from box dimensions
   - Generates optimal cut patterns accounting for kerf (saw blade width)
   - Produces plank-by-plank cutting instructions
   - Creates SVG assembly diagrams
3. **UI/UX** - Slide-out configuration sidebar with draft state management
   - Changes are staged in draft until "Apply Changes" is clicked
   - Pending changes show visual overlay on diagrams to indicate uncommitted state
   - Share button encodes configuration to shareable URL
4. **Rendering** (`src/components/`) - React components for cutlist display and assembly diagrams

### Key Design Patterns

**Auto-calculation**: The `usePlanterConfig` hook automatically computes:
- How many plank rows fit within the box height
- Bottom slat count based on interior width
- Optimal cuts per plank considering kerf losses
- Which planks need ripping to custom widths

**Plank Types** (detected automatically):
- `normal` - Standard width planks with crosscuts only
- `ripped` - Single-width rip (legs, top rim pieces)
- `multi-rip` - Multiple parallel rips from one plank
- `spare` - Extra planks for waste/mistakes

**Cut Pattern Generation** (`generatePlanks` function):
- Calculates how many pieces fit per plank accounting for kerf between cuts
- Creates plank objects with cut sequences
- Automatically determines ripping needs based on part width vs plank width
- Generates specialized patterns for legs (multi-rip) and top rim (ripped strips)

### Data Flow

```
config.json5 → usePlanterConfig → Parts + CutPatterns + Planks + SVG → PlanterCutlist
```

The `ExpandedConfig` type extends `PlanterConfig` with all computed values, making them available throughout the component tree.

### UI Components

**ConfigForm** (`src/components/ConfigForm.tsx`):
- Slide-out sidebar (350px) with permanent 60px navigation bar on left
- Draft state management: changes staged locally until "Apply Changes" clicked
- Share functionality: encodes config to base64 URL parameter for sharing
- Auto-closes 1 second after applying changes

**Layout System**:
- Fixed left navigation bar (60px) with settings (⚙️) and share (🔗) buttons
- Main content shifts right when sidebar opens (60px → 410px margin)
- Pending changes overlay (10% white with blur) indicates uncommitted state

### Important Files

- `src/types.ts` - All TypeScript interfaces
- `src/hooks/usePlanterConfig.ts` - Core calculation logic (350+ lines)
- `src/utils/generateSVG.ts` - Assembly diagram generation
- `src/utils/formatFraction.ts` - Decimal to fraction conversion for measurements
- `src/components/ConfigForm.tsx` - Configuration UI with draft state and share functionality
- `config.json5` - User-editable configuration (loaded dynamically or from URL params)

### Deployment

GitHub Pages deployment via GitHub Actions (`.github/workflows/deploy.yml`). The `base` path in `vite.config.ts` must match the repository name.
