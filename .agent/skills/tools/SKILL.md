# Tools Skill

## Purpose

Guide AI agents in handling missing tools and dependencies.

## Common Tools

### pnpm
Package manager used in this project.

**Installation (macOS)**:
```bash
brew install pnpm
```

**Usage**:
```bash
pnpm install      # Install dependencies
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run linter
```

### git
Version control system.

**Installation (macOS)**:
```bash
# Usually pre-installed, or:
brew install git
```

**Usage**:
```bash
git status        # Check repository status
git add .         # Stage changes
git commit -m "message"  # Commit changes
git log           # View commit history
```

### brew (Homebrew)
Package manager for macOS.

**Installation**:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Usage**:
```bash
brew install <package>  # Install a package
brew update             # Update Homebrew
brew upgrade            # Upgrade installed packages
```

### vibe-launcher
Tool for managing experiments and worktrees.

**Installation**:
```bash
brew install vibe-launcher
```

**Usage**:
- Register experiments in `.vibe.launcher.json`
- Run `vibe-launcher` to manage worktrees
- Use `experiments/` folder for experimental branches

## Handling Missing Tools

1. **Identify Missing Tool**
   - Check error messages
   - Verify tool is in PATH: `which <tool>`

2. **Install Tool**
   - Use appropriate installation method
   - Verify installation: `<tool> --version`

3. **Update Environment**
   - May need to restart terminal
   - Check PATH if tool not found

4. **Continue Work**
   - Retry the command that failed
   - Verify tool works correctly

## Project-Specific Tools

### Node.js
Required for running the development server.

**Check version**:
```bash
node --version
```

**Installation**:
```bash
brew install node
```

### TypeScript
Used for type checking and compilation.

**Check version**:
```bash
tsc --version
```

**Installation**:
```bash
pnpm add -D typescript
```

## Troubleshooting

- **Command not found**: Tool may not be installed or not in PATH
- **Permission errors**: May need `sudo` or check file permissions
- **Version conflicts**: Check required versions in `package.json`
- **Network issues**: Verify internet connection for installations
