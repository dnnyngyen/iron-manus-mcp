# Cross-Platform Setup Guide

This guide provides comprehensive platform-specific instructions for setting up Iron Manus MCP on Windows, macOS, and Linux.

## Quick Installation (All Platforms)

The fastest way to get started is using our cross-platform installation script:

```bash
# Clone the repository
git clone https://github.com/dnnyngyen/iron-manus-mcp
cd iron-manus-mcp

# Run automated installation
npm run setup
```

This will automatically detect your platform and handle all setup steps.

## Platform-Specific Prerequisites

### Windows

**Required:**
- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **Git**: Download from [git-scm.com](https://git-scm.com/)
- **npm**: Included with Node.js

**Optional (for Claude Code hooks):**
- **Python 3.7+**: Download from [python.org](https://www.python.org/)

**PowerShell vs Command Prompt:**
- We recommend using **PowerShell** for better compatibility
- All examples include both PowerShell and Command Prompt alternatives

### macOS

**Required:**
- **Node.js 18+**: Install via [nodejs.org](https://nodejs.org/) or Homebrew
- **Git**: Pre-installed or via Xcode Command Line Tools
- **npm**: Included with Node.js

**Optional (for Claude Code hooks):**
- **Python 3.7+**: Pre-installed or via Homebrew

**Installation via Homebrew:**
```bash
# Install dependencies via Homebrew
brew install node git python3
```

### Linux (Ubuntu/Debian)

**Required:**
- **Node.js 18+**: Install via NodeSource or package manager
- **Git**: Install via package manager
- **npm**: Included with Node.js

**Optional (for Claude Code hooks):**
- **Python 3.7+**: Usually pre-installed

**Installation commands:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm git python3 python3-pip

# Fedora/RHEL
sudo dnf install nodejs npm git python3 python3-pip

# Arch Linux
sudo pacman -S nodejs npm git python
```

## Manual Installation Steps

### 1. Clone and Install Dependencies

**All Platforms:**
```bash
git clone https://github.com/dnnyngyen/iron-manus-mcp
cd iron-manus-mcp
npm install
```

**If git clone fails (network issues):**

**Unix/Linux/macOS:**
```bash
# Try shallow clone
git clone --depth 1 https://github.com/dnnyngyen/iron-manus-mcp

# Or download ZIP
curl -L https://github.com/dnnyngyen/iron-manus-mcp/archive/main.zip -o iron-manus-mcp.zip
unzip iron-manus-mcp.zip
cd iron-manus-mcp-main
```

**Windows (PowerShell):**
```powershell
# Try shallow clone
git clone --depth 1 https://github.com/dnnyngyen/iron-manus-mcp

# Or download ZIP
Invoke-WebRequest -Uri "https://github.com/dnnyngyen/iron-manus-mcp/archive/main.zip" -OutFile "iron-manus-mcp.zip"
Expand-Archive -Path "iron-manus-mcp.zip" -DestinationPath "."
cd iron-manus-mcp-main
```

### 2. Build the Project

**All Platforms:**
```bash
npm run build
```

### 3. Run Tests (Optional)

**All Platforms:**
```bash
npm test
```

### 4. Install Git Hooks

**Automated (All Platforms):**
```bash
npm run install-hooks
```

**Manual Installation:**

**Unix/Linux/macOS:**
```bash
cp hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**Windows (PowerShell):**
```powershell
Copy-Item hooks\pre-commit .git\hooks\pre-commit
# Note: Windows doesn't require chmod
```

### 5. Set Up Claude Code Configuration

**Automated (All Platforms):**
```bash
npm run setup:claude
```

**Manual Setup:**

**Unix/Linux/macOS:**
```bash
# Copy hooks configuration
cp .claude/hooks-example.json ~/.claude/hooks.json

# Claude settings location
~/.claude/settings.json
```

**Windows (PowerShell):**
```powershell
# Copy hooks configuration
Copy-Item .claude\hooks-example.json $env:USERPROFILE\.claude\hooks.json

# Claude settings location
$env:USERPROFILE\.claude\settings.json
```

**Windows (Command Prompt):**
```cmd
# Copy hooks configuration
copy .claude\hooks-example.json %USERPROFILE%\.claude\hooks.json

# Claude settings location
%USERPROFILE%\.claude\settings.json
```

## Claude Desktop MCP Configuration

Add this to your Claude Desktop MCP settings file:

```json
{
  "mcpServers": {
    "iron-manus-mcp": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/full/path/to/your/iron-manus-mcp"
    }
  }
}
```

**Replace `/full/path/to/your/iron-manus-mcp` with your actual project path.**

### Finding Your Project Path

**Windows (PowerShell):**
```powershell
# Get current directory path
$PWD.Path
```

**Windows (Command Prompt):**
```cmd
# Get current directory path
cd
```

**Unix/Linux/macOS:**
```bash
# Get current directory path
pwd
```

## Troubleshooting

### Node.js Version Issues

**Check Node.js version:**
```bash
node --version
```

**If version is below 18.0.0:**

**Windows (using Node Version Manager for Windows):**
```powershell
# Install nvm for Windows first from: https://github.com/coreybutler/nvm-windows
nvm install 18
nvm use 18
```

**macOS/Linux (using nvm):**
```bash
# Install nvm first from: https://github.com/nvm-sh/nvm
nvm install 18
nvm use 18
```

### npm Installation Issues

**Clear npm cache and retry:**

**All Platforms:**
```bash
npm cache clean --force
npm install
```

**If packages fail to install:**

**Unix/Linux/macOS:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
```

**Windows (Command Prompt):**
```cmd
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
npm install
```

### Permission Issues

**macOS/Linux (if encountering permission errors):**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

**Windows (run as Administrator if needed):**
```powershell
# Run PowerShell as Administrator
Start-Process powershell -Verb runAs
```

### Python Issues (for Claude Code hooks)

**Check Python availability:**

**Windows:**
```cmd
python --version
# or
python3 --version
```

**macOS/Linux:**
```bash
python3 --version
```

**If Python is not found:**

**Windows:**
- Download from [python.org](https://www.python.org/)
- Make sure to check "Add Python to PATH" during installation

**macOS:**
```bash
# Using Homebrew
brew install python3
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip

# Fedora/RHEL
sudo dnf install python3 python3-pip
```

### Legacy File Cleanup

If you see `iron_manus_*.json` files, clean them up:

**Unix/Linux/macOS:**
```bash
pkill -f iron-manus
rm -f iron_manus_*.json
rm -rf dist/
npm run build
```

**Windows (PowerShell):**
```powershell
Get-Process -Name "*iron-manus*" | Stop-Process -Force -ErrorAction SilentlyContinue
Remove-Item iron_manus_*.json -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
npm run build
```

**Windows (Command Prompt):**
```cmd
taskkill /f /im node.exe /fi "WINDOWTITLE eq iron-manus*" 2>nul
del iron_manus_*.json 2>nul
rmdir /s /q dist 2>nul
npm run build
```

## Testing Your Installation

After setup, verify everything works:

```bash
# Verify the build
npm run build

# Run tests
npm test

# Start the server (test mode)
NODE_ENV=test npm start
```

## Platform-Specific Notes

### Windows Specific

- Use PowerShell for better compatibility with npm scripts
- Some antivirus software may interfere with npm installation
- Git Bash can be used as an alternative to Command Prompt
- Windows Defender may flag the executable - add an exclusion if needed

### macOS Specific

- Xcode Command Line Tools may be required: `xcode-select --install`
- Homebrew is the recommended package manager
- macOS Gatekeeper may require security permissions for first run

### Linux Specific

- Different distributions may have different package names
- AppArmor or SELinux may require additional configuration
- Some distributions require separate `nodejs-dev` packages

## Docker Alternative

For the most consistent cross-platform experience, use Docker:

```bash
# Pull and run the Docker image
docker pull dnnyngyen/iron-manus-mcp:0.2.3
docker run -d --name iron-manus-mcp dnnyngyen/iron-manus-mcp:0.2.3

# Or use Docker Compose
curl -O https://raw.githubusercontent.com/dnnyngyen/iron-manus-mcp/main/docker-compose.yml
docker-compose up -d
```

## Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Review the main [README.md](../README.md)
3. Check the [issues page](https://github.com/dnnyngyen/iron-manus-mcp/issues)
4. Create a new issue with:
   - Your operating system and version
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Complete error message
   - Steps to reproduce

## Quick Reference Commands

| Task | Command |
|------|---------|
| Full installation | `npm run setup` |
| Verify requirements | `npm run setup:verify` |
| Install hooks only | `npm run install-hooks` |
| Setup Claude config | `npm run setup:claude` |
| Build project | `npm run build` |
| Run tests | `npm test` |
| Start server | `npm start` |
| Clean build | `npm run clean && npm run build` |

---

**Need more help?** See the main [README.md](../README.md) for additional information and usage examples.