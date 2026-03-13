# Task 18: Final Verification

**Phase:** 5 - Build & Package
**Files:** None

---

## Step 1: Compile production build

**Command:**
```bash
npm run vscode:prepublish
```

**Expected:** dist/extension.js created with minification

---

## Step 2: Package as VSIX

**Command:**
```bash
npx vsce package
```

**Expected:** hacker-news-vscode-0.0.1.vsix created

---

## Step 3: Install locally to test

**Command:**
```bash
code --install-extension hacker-news-vscode-0.0.1.vsix
```

**Expected:** Extension installed successfully

---

## Step 4: Manual test in VSCode

1. Open VSCode
2. Press Ctrl+Shift+P
3. Type "Hacker News" and run the command
4. Verify front page loads
5. Click a story title - verify story view opens
6. Click "Next 30" - verify pagination works
7. Click "Refresh" - verify data refreshes

---

## Final Verification Checklist

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

## Checklist
- [ ] Production build completed
- [ ] VSIX package created
- [ ] Extension installed locally
- [ ] Manual testing passed
