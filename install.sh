#!/usr/bin/env bash
set -euo pipefail

REPO="https://github.com/askspecter/specter-cli"
INSTALL_DIR="${HOME}/.specter-cli"
BIN_DIR="${HOME}/.local/bin"

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║  SPECTER CLI — Install Script        ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "  ✗ Node.js not found. Install from https://nodejs.org (v18+)"
  exit 1
fi

NODE_MAJOR=$(node --version | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "  ✗ Node.js v18+ required (found v${NODE_MAJOR})"
  exit 1
fi
echo "  ✓ Node.js $(node --version)"

# Clone or update
if [ -d "$INSTALL_DIR/.git" ]; then
  echo "  Updating existing install..."
  git -C "$INSTALL_DIR" pull --ff-only origin main
else
  echo "  Cloning $REPO..."
  git clone --depth 1 "$REPO" "$INSTALL_DIR"
fi

# Build
cd "$INSTALL_DIR"
echo "  Installing dependencies..."
npm install --silent
echo "  Building..."
npm run build

# Link binary
mkdir -p "$BIN_DIR"
ln -sf "$INSTALL_DIR/dist/index.js" "$BIN_DIR/specter"
chmod +x "$INSTALL_DIR/dist/index.js"

echo ""
echo "  ✓ SPECTER CLI installed to $BIN_DIR/specter"
echo ""

# PATH hint
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
  echo "  Add this to your ~/.bashrc or ~/.zshrc:"
  echo "    export PATH=\"\$HOME/.local/bin:\$PATH\""
  echo ""
fi

echo "  Try: specter --help"
echo ""
