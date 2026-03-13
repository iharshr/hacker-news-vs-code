# Hacker News in VSCode (text only)

Browse Hacker News stories, comments, and linked articles as markdown inside VSCode. A distraction-free, text-only reading experience that looks like documentation, not a social media site.

## Features

- **Front Page**: Browse top 30 stories with pagination (up to 500 stories)
- **Story View**: Read external articles converted to markdown + threaded comments
- **Comments Only**: Jump directly to the discussion
- **Text Only**: No images, no avatars, no vote buttons — pure text
- **Native Theming**: Uses VSCode's color theme automatically
- **Keyboard Friendly**: All navigation via command palette

## Usage

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type "Hacker News"
3. Select "Hacker News: Open Front Page"

## Keyboard Shortcuts

- `Ctrl+Shift+P` → "Hacker News: Open Front Page"

## Screenshots

*(Add screenshots here before publishing)*

## Requirements

- VSCode 1.75.0 or higher
- Node.js 18+ and npm

## Development

### Setup

```bash
# Clone and install dependencies
git clone https://github.com/your-username/hacker-news-vscode.git
cd hacker-news-vscode
npm install
```

### Build

```bash
# Development build (with source maps)
npm run compile

# Watch mode for development
npm run watch

# Production build (minified)
npm run vscode:prepublish
```

### Package & Deploy

```bash
# Package as VSIX for local testing
npx vsce package

# Install locally to test
code --install-extension hacker-news-vscode-0.0.1.vsix

# Uninstall
code --uninstall-extension your-publisher-name.hacker-news-vscode

# Publish to VSCode Marketplace (requires publisher account)
npx vsce publish

# Publish patch version
npx vsce publish patch
```

### Project Structure

```
src/
├── extension.ts         # Entry point, command registration
├── types.ts             # TypeScript interfaces
├── hnApi.ts             # Hacker News API client
├── timeUtils.ts         # Relative time formatting
├── markdownRenderer.ts  # HTML shell with VSCode CSS vars
├── commentRenderer.ts   # Comment tree renderer
├── articleFetcher.ts    # Article → markdown (Turndown)
├── frontPagePanel.ts    # Front page webview
├── storyPanel.ts        # Story detail webview
└── articlePanel.ts      # External article webview
```

## Known Limitations

- Some articles may not load due to paywalls or restrictions
- No login/voting/posting functionality (read-only)
- No images displayed (text only by design)

## Release Notes

### 0.0.1

Initial release

---

**Enjoy reading Hacker News in your favorite editor!**
