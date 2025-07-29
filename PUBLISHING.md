# Publishing Guide for @kodefactory/acm

## Pre-Publishing Checklist

### ✅ Prerequisites
- [ ] npm account created
- [ ] Logged in to npm (`npm login`)
- [ ] Git repository set up
- [ ] On main branch
- [ ] Working directory clean (no uncommitted changes)

### ✅ Package Configuration
- [ ] Package name is correct (`@kodefactory/acm`)
- [ ] Version is appropriate
- [ ] All dependencies are correct
- [ ] Build scripts work (`yarn build`)
- [ ] Tests pass (`yarn test`)

### ✅ Files Ready
- [ ] Source code is complete
- [ ] README.md is updated
- [ ] LICENSE file exists
- [ ] .npmignore is configured
- [ ] package.json has correct exports

## Publishing Steps

### 1. Login to npm
```bash
npm login
```

### 2. Test the package (Dry Run)
```bash
./scripts/dry-run.sh
```

### 3. Publish
```bash
# For patch version (0.0.1 -> 0.0.2)
./scripts/publish.sh patch

# For minor version (0.0.1 -> 0.1.0)
./scripts/publish.sh minor

# For major version (0.0.1 -> 1.0.0)
./scripts/publish.sh major
```

## What the Publish Script Does

1. **Checks prerequisites**:
   - Main branch
   - Clean working directory
   - npm login status

2. **Runs tests**: Ensures all tests pass

3. **Builds package**: Creates optimized build

4. **Bumps version**: Updates package.json version

5. **Creates git tag**: Tags the release

6. **Publishes to npm**: Uploads to npm registry

7. **Pushes to git**: Updates remote repository

## Package Contents

### ✅ Included in npm package:
- `dist/` - Built files (CommonJS + ESM)
- `package.json` - Package metadata
- `README.md` - Documentation
- `LICENSE` - License file

### ❌ Excluded from npm package:
- `src/` - Source files
- `test/` - Test files
- Configuration files
- Development dependencies

## Troubleshooting

### "Not logged in to npm"
```bash
npm login
```

### "Working directory not clean"
```bash
git add .
git commit -m "feat: prepare for release"
```

### "Must be on main branch"
```bash
git checkout main
```

### "Build failed"
```bash
yarn clean
yarn build
```

## After Publishing

1. **Verify on npm**: Check https://www.npmjs.com/package/@kodefactory/acm
2. **Test installation**: `npm install @kodefactory/acm`
3. **Update documentation**: If needed
4. **Create release notes**: On GitHub if applicable

## Version Guidelines

- **Patch** (0.0.1 → 0.0.2): Bug fixes, no breaking changes
- **Minor** (0.0.1 → 0.1.0): New features, backward compatible
- **Major** (0.0.1 → 1.0.0): Breaking changes, major features