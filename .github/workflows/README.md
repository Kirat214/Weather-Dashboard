# GitHub Actions CI/CD Pipeline

This directory contains the CI/CD pipeline configuration for automated testing, building, and deployment.

## Required GitHub Secrets

Before the pipeline can run successfully, you need to configure these secrets in your GitHub repository:

### Setup Instructions:

1. **Get Vercel Token:**
   ```bash
   npm i -g vercel
   vercel login
   vercel token create
   ```

2. **Link Vercel Project:**
   ```bash
   vercel link
   ```
   This creates `.vercel/project.json` with your project details.

3. **Add GitHub Secrets:**
   Go to: Repository Settings → Secrets and variables → Actions → New repository secret

   Add these three secrets:
   - **VERCEL_TOKEN**: Your Vercel token from step 1
   - **VERCEL_ORG_ID**: Copy from `.vercel/project.json` (orgId field)
   - **VERCEL_PROJECT_ID**: Copy from `.vercel/project.json` (projectId field)

## Workflow File

- **`ci-cd.yml`**: Main pipeline with 6 stages
  - Code quality checks (ESLint, TypeScript)
  - Automated testing with coverage
  - Build validation
  - Security audit
  - Production deployment (main branch)
  - Preview deployment (pull requests)

## Testing Locally

Run these commands to test pipeline stages locally:

```bash
# Run linting
npm run lint

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Build the application
npm run build
```

## Documentation

See `DEVOPS_PIPELINE.md` in the root directory for complete documentation.
