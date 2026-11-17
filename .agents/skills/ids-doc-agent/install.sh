#!/bin/bash

# Design System Documentation Agent Installation Script
# This script installs the agent to the global Cascade skills directory

set -e

AGENT_NAME="ids-doc-agent"
INSTALL_DIR="$HOME/.agents/skills"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🎨 Installing Design System Documentation Agent..."
echo ""

# Create the skills directory if it doesn't exist
if [ ! -d "$INSTALL_DIR" ]; then
    echo "Creating skills directory: $INSTALL_DIR"
    mkdir -p "$INSTALL_DIR"
fi

# Copy the agent to the skills directory
echo "Copying agent to: $INSTALL_DIR/$AGENT_NAME"
cp -r "$SCRIPT_DIR" "$INSTALL_DIR/$AGENT_NAME"

echo ""
echo "✅ Installation complete!"
echo ""
echo "The agent is now available. Invoke it in Cascade by typing:"
echo "  @$AGENT_NAME"
echo ""
echo "To uninstall, simply run:"
echo "  rm -rf $INSTALL_DIR/$AGENT_NAME"
