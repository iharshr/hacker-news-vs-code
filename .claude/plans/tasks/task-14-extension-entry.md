# Task 14: Extension Entry Point

**Phase:** 4 - Webview Panels
**Files:** Create: `src/extension.ts`

---

## Step 1: Create main extension file with command registration

```typescript
import * as vscode from 'vscode';
import { FrontPagePanel } from './frontPagePanel';
import { StoryPanel } from './storyPanel';
import { ArticlePanel } from './articlePanel';

export function activate(context: vscode.ExtensionContext): void {
  console.log('Hacker News VSCode extension is now active');

  // Main command: Open Front Page
  const openCommand = vscode.commands.registerCommand('hacker-news.open', () => {
    FrontPagePanel.createOrShow();
  });

  // Open story detail (article + comments)
  const openStoryCommand = vscode.commands.registerCommand(
    'hacker-news.openStory',
    (storyId: number) => {
      StoryPanel.create(storyId);
    }
  );

  // Open comments only
  const openCommentsCommand = vscode.commands.registerCommand(
    'hacker-news.openComments',
    (storyId: number) => {
      StoryPanel.create(storyId);
    }
  );

  // Open external article
  const openArticleCommand = vscode.commands.registerCommand(
    'hacker-news.openArticle',
    (url: string) => {
      ArticlePanel.create(url);
    }
  );

  context.subscriptions.push(
    openCommand,
    openStoryCommand,
    openCommentsCommand,
    openArticleCommand
  );
}

export function deactivate(): void {
  console.log('Hacker News VSCode extension deactivated');
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
- [ ] `src/extension.ts` created
- [ ] TypeScript compiles without errors
