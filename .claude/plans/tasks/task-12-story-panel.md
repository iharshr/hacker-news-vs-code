# Task 12: Story Panel

**Phase:** 4 - Webview Panels
**Files:** Create: `src/storyPanel.ts`

---

## Step 1: Create story detail panel with article and comments

```typescript
import * as vscode from 'vscode';
import { fetchItem, fetchStories, fetchComments } from './hnApi';
import { HNStory, Story, Comment } from './types';
import { formatRelativeTime } from './timeUtils';
import { renderMarkdownHTML, escapeHtml } from './markdownRenderer';
import { renderCommentsSection } from './commentRenderer';
import { fetchArticle } from './articleFetcher';

export class StoryPanel {
  public static async create(storyId: number): Promise<void> {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    const panel = vscode.window.createWebviewPanel(
      'hackerNewsStory',
      'Loading...',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    const storyPanel = new StoryPanel(panel, storyId);
    await storyPanel.load();
  }

  private constructor(
    private readonly panel: vscode.WebviewPanel,
    private readonly storyId: number
  ) {}

  private async load(): Promise<void> {
    this.panel.webview.html = renderMarkdownHTML('<p class="loading"><em>Loading story...</em></p>');

    try {
      const item = await fetchItem<HNStory>(this.storyId);
      if (!item) {
        this.renderError('Story not found.');
        return;
      }

      this.panel.title = item.title.slice(0, 50) + (item.title.length > 50 ? '...' : '');

      const story: Story = {
        id: item.id,
        title: item.title,
        url: item.url || null,
        by: item.by,
        score: item.score,
        time: item.time,
        descendants: item.descendants || 0,
        kids: item.kids || [],
        text: item.text,
        type: item.type,
      };

      // Fetch article and comments in parallel
      const [articleResult, comments] = await Promise.all([
        story.url ? fetchArticle(story.url) : Promise.resolve(null),
        fetchComments(story.id),
      ]);

      this.render(story, articleResult, comments);
    } catch (error) {
      this.renderError('Failed to load story.');
    }
  }

  private render(
    story: Story,
    article: { title: string; content: string; error?: string; url: string } | null,
    comments: Comment[]
  ): void {
    const timeStr = formatRelativeTime(story.time);
    const tagLabel = !story.url && story.text ? ' (Ask HN / Show HN)' : '';

    let articleSection = '';
    if (article) {
      if (article.error) {
        articleSection = `
<h2>Article</h2>
<blockquote>
  <p><em>Article could not be loaded. ${article.error}</em></p>
  <p><a href="${escapeHtml(article.url)}">Open original URL</a></p>
</blockquote>`;
      } else {
        articleSection = `
<h2>Article</h2>
<div>${this.markdownToHtml(article.content)}</div>`;
      }
    } else if (story.text) {
      // Ask HN / Show HN - render the text directly
      articleSection = `
<h2>Content</h2>
<div>${this.hnTextToHtml(story.text)}</div>`;
    }

    const html = `
<h1><a href="${escapeHtml(story.url || '#')}">${escapeHtml(story.title)}</a></h1>

<p class="meta">
  Submitted by <strong>${escapeHtml(story.by)}</strong> |
  ${story.score} points | ${timeStr}${tagLabel}
</p>

<p class="nav-links">
  <a href="#" class="command-link" onclick="goBack()">← Back to Front Page</a> |
  <a href="#comments">View Comments ↓</a>
</p>

<hr>

${articleSection}

<hr>

<a name="comments"></a>
${renderCommentsSection(comments, story.descendants)}

<p class="nav-links" style="margin-top: 24px;">
  <a href="#" class="command-link" onclick="goBack()">← Back to Front Page</a>
</p>
    `;

    this.panel.webview.html = renderMarkdownHTML(this.injectScripts(html));
  }

  private renderError(message: string): void {
    this.panel.webview.html = renderMarkdownHTML(`
      <div class="error">${escapeHtml(message)}</div>
      <p><a href="#" class="command-link" onclick="goBack()">← Back to Front Page</a></p>
    `);
  }

  private markdownToHtml(markdown: string): string {
    // Basic markdown to HTML conversion for article content
    // This is a simple implementation - Turndown gives us markdown, we convert back to safe HTML
    return markdown
      .split('\n\n')
      .map((para) => {
        if (para.startsWith('###')) {
          return `<h3>${escapeHtml(para.slice(4))}</h3>`;
        }
        if (para.startsWith('##')) {
          return `<h2>${escapeHtml(para.slice(3))}</h2>`;
        }
        if (para.startsWith('#')) {
          return `<h1>${escapeHtml(para.slice(2))}</h1>`;
        }
        if (para.startsWith('```')) {
          return `<pre><code>${escapeHtml(para.replace(/```\w*\n?/g, ''))}</code></pre>`;
        }
        if (para.startsWith('- ') || para.startsWith('* ')) {
          const items = para.split('\n')
            .filter((line) => line.startsWith('- ') || line.startsWith('* '))
            .map((line) => `<li>${escapeHtml(line.slice(2))}</li>`)
            .join('');
          return `<ul>${items}</ul>`;
        }
        return `<p>${this.processInlineMarkdown(para)}</p>`;
      })
      .join('\n');
  }

  private processInlineMarkdown(text: string): string {
    return text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  private hnTextToHtml(text: string): string {
    // HN text is already HTML-ish
    return text
      .replace(/<p>/gi, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/<p><\/p>/g, '');
  }

  private injectScripts(content: string): string {
    return content + `
<script>
const vscode = acquireVsCodeApi();

function goBack() {
  vscode.postMessage({ command: 'goBack' });
}
</script>`;
  }
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
- [ ] `src/storyPanel.ts` created
- [ ] TypeScript compiles without errors
