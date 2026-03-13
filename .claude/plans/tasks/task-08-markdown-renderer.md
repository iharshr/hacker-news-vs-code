# Task 8: Markdown Renderer (HTML Shell)

**Phase:** 3 - Rendering Layer
**Files:** Create: `src/markdownRenderer.ts`

---

## Step 1: Create HTML shell with VSCode CSS variables

```typescript
export function renderMarkdownHTML(content: string, title: string = 'Hacker News'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: var(--vscode-editor-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      font-size: var(--vscode-editor-font-size, 14px);
      color: var(--vscode-editor-foreground, #333);
      background-color: var(--vscode-editor-background, #fff);
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    a {
      color: var(--vscode-textLink-foreground, #0066cc);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    a.command-link {
      cursor: pointer;
    }

    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }

    h1 { font-size: 2em; border-bottom: 1px solid var(--vscode-editorWidget-border, #e0e0e0); padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid var(--vscode-editorWidget-border, #e0e0e0); padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }

    hr {
      border: 0;
      border-top: 1px solid var(--vscode-editorWidget-border, #e0e0e0);
      margin: 24px 0;
    }

    blockquote {
      margin: 0 0 16px 0;
      padding: 0 16px;
      border-left: 4px solid var(--vscode-textBlockQuote-border, #ddd);
      color: var(--vscode-textBlockQuote-foreground, #666);
    }

    blockquote blockquote {
      margin-top: 8px;
    }

    code {
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 0.9em;
      padding: 0.2em 0.4em;
      background-color: var(--vscode-textCodeBlock-background, rgba(0,0,0,0.05));
      border-radius: 3px;
    }

    pre {
      padding: 16px;
      overflow: auto;
      background-color: var(--vscode-textCodeBlock-background, #f6f8fa);
      border-radius: 6px;
    }

    pre code {
      padding: 0;
      background-color: transparent;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }

    th, td {
      border: 1px solid var(--vscode-editorWidget-border, #ddd);
      padding: 8px 12px;
    }

    th {
      background-color: var(--vscode-editor-background, #f6f8fa);
    }

    .meta {
      color: var(--vscode-descriptionForeground, #666);
      font-size: 0.9em;
      margin-bottom: 16px;
    }

    .story-meta {
      color: var(--vscode-descriptionForeground, #666);
      font-size: 0.85em;
      margin-top: 4px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      font-style: italic;
      color: var(--vscode-descriptionForeground, #666);
    }

    .error {
      color: var(--vscode-errorForeground, #d32f2f);
      padding: 16px;
      border: 1px solid var(--vscode-inputValidation-errorBorder, #d32f2f);
      border-radius: 4px;
      background-color: var(--vscode-inputValidation-errorBackground, rgba(211, 47, 47, 0.1));
    }

    .nav-links {
      margin-bottom: 16px;
    }

    .pagination {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--vscode-editorWidget-border, #e0e0e0);
    }
  </style>
</head>
<body>
${content}
</body>
</html>`;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

---

## Step 2: Verify TypeScript compiles

**Command:**
```bash
npx tsc --noEmit
```

**Expected:** No errors

---

## Checklist
- [ ] `src/markdownRenderer.ts` created
- [ ] TypeScript compiles without errors
