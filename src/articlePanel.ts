import * as vscode from 'vscode';
import { fetchArticle } from './articleFetcher';
import { renderMarkdownHTML, escapeHtml } from './markdownRenderer';

export class ArticlePanel {
  public static async create(url: string): Promise<void> {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    const panel = vscode.window.createWebviewPanel(
      'hackerNewsArticle',
      'Loading article...',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    const articlePanel = new ArticlePanel(panel, url);
    await articlePanel.load();
  }

  private constructor(
    private readonly panel: vscode.WebviewPanel,
    private readonly url: string
  ) {}

  private async load(): Promise<void> {
    this.panel.webview.html = renderMarkdownHTML('<p class="loading"><em>Loading article...</em></p>');

    const result = await fetchArticle(this.url);

    if (result.error) {
      this.renderError(result.error, result.url);
      return;
    }

    this.panel.title = result.title.slice(0, 50);
    this.render(result);
  }

  private render(article: { title: string; content: string; url: string }): void {
    const html = `
<h1>${escapeHtml(article.title)}</h1>

<p class="meta"><em>Source: <a href="${escapeHtml(article.url)}" target="_blank">${escapeHtml(article.url)}</a></em></p>

<hr>

<div>${this.markdownToHtml(article.content)}</div>
    `;

    this.panel.webview.html = renderMarkdownHTML(html);
  }

  private renderError(message: string, url: string): void {
    this.panel.webview.html = renderMarkdownHTML(`
      <div class="error">${escapeHtml(message)}</div>
      <p>Original URL: <a href="${escapeHtml(url)}" target="_blank">${escapeHtml(url)}</a></p>
    `);
  }

  private markdownToHtml(markdown: string): string {
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
}
