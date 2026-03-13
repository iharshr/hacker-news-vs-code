# Task 1: Project Foundation - package.json

**Phase:** 1 - Project Setup
**Files:** Create: `package.json`

---

## Step 1: Create package.json with VSCode extension manifest

```json
{
  "name": "hacker-news-vscode",
  "displayName": "Hacker News in VSCode (text only)",
  "description": "Browse Hacker News stories, comments, and linked articles as markdown inside VSCode",
  "version": "0.0.1",
  "publisher": "your-publisher-name",
  "engines": {
    "vscode": "^1.75.0"
  },
  "categories": ["Other"],
  "activationEvents": [],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "hacker-news.open",
        "title": "Hacker News: Open Front Page"
      }
    ]
  },
  "scripts": {
    "vscode:prepublish": "esbuild src/extension.ts --bundle --outfile=dist/extension.js --external:vscode --format=cjs --platform=node --minify",
    "compile": "esbuild src/extension.ts --bundle --outfile=dist/extension.js --external:vscode --format=cjs --platform=node",
    "watch": "esbuild src/extension.ts --bundle --outfile=dist/extension.js --external:vscode --format=cjs --platform=node --watch"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/vscode": "^1.75.0",
    "esbuild": "^0.19.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "turndown": "^7.1.3"
  }
}
```

---

## Step 2: Verify package.json syntax

**Command:**
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('package.json')))"
```

**Expected:** No errors, prints parsed JSON

---

## Checklist
- [ ] `package.json` created
- [ ] Syntax verified with node command
