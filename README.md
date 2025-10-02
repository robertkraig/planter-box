# Planter Box Cutlist Generator

A React-based tool for generating cutlists for custom planter boxes.

## 🚀 Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages.

### Setup Instructions:

1. **Update the repository name**: In `vite.config.ts`, replace `/planter-box/` with your actual repository name:
   ```typescript
   base: '/your-repo-name/',
   ```

2. **Update homepage in package.json**: Replace `yourusername` with your GitHub username:
   ```json
   "homepage": "https://yourusername.github.io/planter-box/",
   ```

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Build and deployment," select "GitHub Actions" as the source

4. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

The GitHub Actions workflow will automatically build and deploy your site!

## 📦 Development
