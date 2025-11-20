#!/bin/bash

# Setup script for local development with exoquery-site

set -e

echo "🔧 Setting up local development environment..."

# Check if exoquery-site exists
SITE_DIR="../exoquery-site"
if [ ! -d "$SITE_DIR" ]; then
    echo "❌ Error: exoquery-site not found at $SITE_DIR"
    echo "   Please ensure both repos are cloned in the same parent directory:"
    echo "   - git/exoquery-site/"
    echo "   - git/exoquery-examples-web/"
    exit 1
fi

echo "✅ Found exoquery-site"

# Build examples
echo "📦 Building examples..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Examples built successfully"

# Create symlink in exoquery-site/public
PUBLIC_DIR="$SITE_DIR/public"
SYMLINK_PATH="$PUBLIC_DIR/examples-local"

if [ -L "$SYMLINK_PATH" ]; then
    echo "⚠️  Symlink already exists at $SYMLINK_PATH"
    read -p "Remove and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm "$SYMLINK_PATH"
        echo "🗑️  Removed existing symlink"
    else
        echo "ℹ️  Keeping existing symlink"
        exit 0
    fi
elif [ -e "$SYMLINK_PATH" ]; then
    echo "❌ Error: $SYMLINK_PATH exists but is not a symlink"
    echo "   Please remove it manually and run this script again"
    exit 1
fi

# Create symlink
EXAMPLES_WEB_DIST="$(pwd)/dist"
ln -s "$EXAMPLES_WEB_DIST" "$SYMLINK_PATH"

if [ $? -eq 0 ]; then
    echo "✅ Created symlink: $SYMLINK_PATH -> $EXAMPLES_WEB_DIST"
else
    echo "❌ Failed to create symlink"
    exit 1
fi

# Create .env.development in exoquery-site if it doesn't exist
ENV_FILE="$SITE_DIR/.env.development"
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 Creating .env.development in exoquery-site"
    cat > "$ENV_FILE" << 'EOF'
# Local development with external examples
EXTERNAL_EXAMPLES_SOURCE=local
EOF
    echo "✅ Created $ENV_FILE"
else
    echo "ℹ️  .env.development already exists in exoquery-site"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. cd ../exoquery-site && npm run dev"
echo "   2. Navigate to http://localhost:4321/#home?example=window-functions"
echo ""
echo "💡 Tips:"
echo "   - Run 'npm run build' here after modifying examples"
echo "   - Changes will be instantly available in the site"
echo "   - Remove symlink with: rm $SYMLINK_PATH"
echo ""

