# Hacker News VSCode Extension - Project Board

> **Goal:** Build a VSCode extension that lets developers browse Hacker News entirely within VSCode using markdown-styled webview panels.

**Architecture:** Singleton front page panel with in-memory pagination cache. Story and article views open in separate webview tabs. All styling uses VSCode CSS variables for native theme integration. No external UI frameworks.

**Tech Stack:** TypeScript, VSCode Extension API, HN Firebase REST API, Turndown (HTML-to-markdown), esbuild

---

## Status Legend

- [ ] Not started
- [~] In progress
- [x] Completed
- [!] Blocked

---

## Phase 1: Project Setup

### Task 1: Project Foundation - package.json
- [ ] Create `package.json` with VSCode extension manifest
- [ ] Verify syntax with `node -e "console.log(JSON.parse(require('fs').readFileSync('package.json')))"`
**Files:** `package.json`

### Task 2: TypeScript Configuration
- [ ] Create `tsconfig.json` with compiler options
- [ ] Create source directories: `mkdir -p src media`
**Files:** `tsconfig.json`

### Task 3: VSCode Ignore File
- [ ] Create `.vscodeignore` for extension packaging
**Files:** `.vscodeignore`

### Task 4: Install Dependencies
- [ ] Run `npm install`
- [ ] Verify with `ls node_modules | grep -E "turndown|esbuild|typescript"`
**Files:** None (package operation)

---

## Phase 2: Core Types & API

### Task 5: Types for HN API
- [ ] Create type definitions for HN data structures
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
**Files:** `src/types.ts`

### Task 6: HN API Client
- [ ] Create HN API client with fetch functions
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
**Files:** `src/hnApi.ts`

### Task 7: Time Formatting Utility
- [ ] Create relative time formatter
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
**Files:** `src/timeUtils.ts`

---

## Phase 3: Rendering Layer

### Task 8: Markdown Renderer (HTML Shell)
- [ ] Create HTML shell with VSCode CSS variables
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
**Files:** `src/markdownRenderer.ts`

### Task 9: Comment Renderer
- [ ] Create comment tree to HTML renderer
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
**Files:** `src/commentRenderer.ts`

### Task 10: Article Fetcher (Turndown)
- [ ] Create article fetcher with Turndown conversion
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
**Files:** `src/articleFetcher.ts`

---

## Phase 4: Webview Panels

### Task 11: Front Page Panel (Core Structure)
- [ ] Create front page panel class with state management
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
**Files:** `src/frontPagePanel.ts`

### Task 12: Story Panel
- [ ] Create story detail panel with article and comments
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
**Files:** `src/storyPanel.ts`

### Task 13: Article Panel (External Links)
- [ ] Create article panel for external links
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
**Files:** `src/articlePanel.ts`

### Task 14: Extension Entry Point
- [ ] Create main extension file with command registration
- [ ] Verify TypeScript compiles: `npx tsc --noEmit`
**Files:** `src/extension.ts`

---

## Phase 5: Build & Package

### Task 15: Build and Bundle
- [ ] Create dist directory and compile: `mkdir -p dist && npm run compile`
- [ ] Verify bundle size: `ls -lh dist/extension.js` (should be < 500KB)
**Files:** None (build operation)

### Task 16: Create README
- [ ] Create marketplace README
**Files:** `README.md`

### Task 17: Create Extension Icon
- [ ] Create icon placeholder (orange Y on dark background, 128x128)
- [ ] Update package.json with icon reference
**Files:** `media/icon.png`

### Task 18: Final Verification
- [ ] Compile production build: `npm run vscode:prepublish`
- [ ] Package as VSIX: `npx vsce package`
- [ ] Install locally: `code --install-extension hacker-news-vscode-0.0.1.vsix`
- [ ] Manual test in VSCode
**Files:** None

---

## File Structure

```
hacker-news-vscode/
├── src/
│   ├── extension.ts         — Command registration, activation
│   ├── types.ts             — TypeScript interfaces for HN data
│   ├── hnApi.ts             — HN Firebase REST API client
│   ├── timeUtils.ts         — Relative time formatting
│   ├── markdownRenderer.ts  — HTML shell with VSCode CSS variables
│   ├── commentRenderer.ts   — Comment tree to HTML
│   ├── articleFetcher.ts    — Fetch URL + Turndown conversion
│   ├── frontPagePanel.ts    — Singleton webview for front page
│   ├── storyPanel.ts        — Story detail + comments webview
│   └── articlePanel.ts      — External article webview
├── media/
│   └── icon.png             — Extension icon (128x128)
├── dist/
│   └── extension.js         — Bundled output (generated)
├── package.json
├── tsconfig.json
├── .vscodeignore
└── README.md
```

---

## Verification Checklist

- [ ] `npm install` completes without errors
- [ ] `npm run compile` creates `dist/extension.js`
- [ ] `npx vsce package` creates `.vsix` file
- [ ] Extension activates when command is run
- [ ] Front page loads with 30 stories
- [ ] Pagination works (Next/Prev)
- [ ] Story detail view loads article + comments
- [ ] Comments render in threaded structure
- [ ] Refresh button clears cache and reloads
- [ ] Theme adapts to light/dark mode
- [ ] No console errors in VSCode developer tools

---

## Progress Summary

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| Phase 1: Setup | 4 | 3 | [~] |
| Phase 2: Core | 3 | 0 | [ ] |
| Phase 3: Rendering | 3 | 0 | [ ] |
| Phase 4: Panels | 4 | 0 | [ ] |
| Phase 5: Package | 4 | 0 | [ ] |
| **Total** | **18** | **3** | **17%** |
