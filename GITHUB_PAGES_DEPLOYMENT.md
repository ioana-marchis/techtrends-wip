# GitHub Pages Deployment Guide

This guide explains how to deploy the TechTrends WIP project to GitHub Pages.

## Automatic Deployment (Recommended)

The project is configured with GitHub Actions for automatic deployment. Every push to the `main` branch will trigger a deployment.

### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub: https://github.com/ioana-marchis/techtrends-wip
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

2. **Push your changes:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to the **Actions** tab in your repository
   - Watch the deployment workflow run
   - Once complete, your site will be available at:
     **https://ioana-marchis.github.io/techtrends-wip/**

## Manual Deployment

If you prefer to deploy manually, you can use the npm script:

```bash
npm run deploy
```

This will:
1. Build the project
2. Deploy the `dist` folder to the `gh-pages` branch

## Configuration Files

The following files have been configured for GitHub Pages:

- **vite.config.ts**: Set `base: '/techtrends-wip/'` for correct asset paths
- **.github/workflows/deploy.yml**: GitHub Actions workflow for automatic deployment
- **public/.nojekyll**: Prevents GitHub Pages from processing files with Jekyll
- **package.json**: Added `deploy` script

## Troubleshooting

### Site not loading correctly
- Make sure the base path in `vite.config.ts` matches your repository name
- Check that GitHub Pages is enabled and set to use GitHub Actions

### 404 errors for assets
- Verify the `base` configuration in `vite.config.ts`
- Clear your browser cache and try again

### Workflow failing
- Check the Actions tab for error messages
- Ensure all dependencies are listed in `package.json`
- Verify Node version compatibility (currently set to Node 20)

## Important Notes

- **API Keys**: Make sure not to commit sensitive API keys. Use environment variables and configure them in GitHub Secrets if needed for deployment.
- **CORS**: If you're using the proxy server for API calls, note that it won't work on GitHub Pages (static hosting only). You may need to configure CORS properly on your backend or use a different hosting solution for the proxy.
- **Development vs Production**: The site will be built in production mode for GitHub Pages deployment.

## Local Preview

To preview the production build locally:

```bash
npm run build
npm run preview
```

This will build and serve your site locally at http://localhost:4173
