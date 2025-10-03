# Planter Box Cutlist Generator

A React-based tool that automatically generates optimized cutting lists for custom wooden planter boxes. Input your desired dimensions and material specs, and get a complete plank-by-plank cutting guide with visual assembly diagrams.

**🔗 Live App:** [https://robertkraig.github.io/planter-box/](https://robertkraig.github.io/planter-box/)

## ✨ Features

- **Smart Cut Optimization** - Automatically calculates the most efficient cutting patterns accounting for saw kerf
- **Visual Assembly Diagrams** - SVG diagrams show exactly how parts fit together
- **Fraction Support** - All measurements display in woodworking-friendly fractions (e.g., 22½")
- **Draft State Management** - Make changes without lag; apply when ready
- **Share Configurations** - Generate shareable URLs to send your exact planter design to others
- **Responsive UI** - Slide-out configuration panel that adapts to your workflow
- **Print-Ready** - Optimized print styles for taking cutlists to the workshop

## 🎯 How to Use

1. **Open the App** - Visit the deployed site or run locally
2. **Click Settings Icon (⚙️)** - Opens the configuration sidebar
3. **Adjust Dimensions**:
   - Box interior dimensions (length, width, height)
   - Plank specifications (length, width, thickness)
   - Material settings (kerf, leg dimensions)
4. **Click "Apply Changes"** - Regenerates the cutlist with your settings
5. **Share Your Design** - Click the share icon (🔗) to copy a shareable URL

## 🔗 Sharing Configurations

The share button encodes your entire configuration into a URL. Anyone who opens your shared link will see your exact planter design with all dimensions and settings preserved.

## 📦 Development

### Prerequisites
- Node.js 18+ and npm

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Project Structure

```
src/
├── components/     # React components
│   ├── ConfigForm.tsx      # Configuration sidebar with draft state
│   ├── PlanterCutlist.tsx  # Main cutlist display
│   └── AssemblyDiagram.tsx # SVG assembly diagrams
├── hooks/          # Custom React hooks
│   └── usePlanterConfig.ts # Core calculation logic
├── utils/          # Utility functions
│   ├── generateSVG.ts      # Assembly diagram generation
│   └── formatFraction.ts   # Decimal to fraction conversion
├── types.ts        # TypeScript type definitions
└── config.json5    # Default configuration
```

## 🛠️ Configuration

Edit `config.json5` to set default values for:
- Box dimensions (interior length, width, height)
- Plank specifications (length, width, thickness)
- Material properties (kerf, leg dimensions, spare planks)
- UI settings (title, top rim preference)

All values can be overridden through the UI or shared via URL parameters.

## 📝 License

MIT
