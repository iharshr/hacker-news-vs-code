import * as vscode from 'vscode';
import { fetchTopStoryIds, fetchStories } from './hnApi';
import { Story } from './types';
import { formatRelativeTime } from './timeUtils';
import { renderMarkdownHTML, escapeHtml } from './markdownRenderer';

const STORIES_PER_PAGE = 30;

export class FrontPagePanel {
  public static currentPanel: FrontPagePanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private storyIds: number[] = [];
  private pageCache: Map<number, Story[]> = new Map();
  private currentPage: number = 1;
  private totalPages: number = 1;
  private isLoading: boolean = false;

  private constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;

    this.panel.onDidDispose(() => {
      FrontPagePanel.currentPanel = undefined;
    });

    this.panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'openStory':
          vscode.commands.executeCommand('hacker-news.openStory', message.id);
          break;
        case 'openComments':
          vscode.commands.executeCommand('hacker-news.openComments', message.id);
          break;
        case 'nextPage':
          this.goToPage(this.currentPage + 1);
          break;
        case 'prevPage':
          this.goToPage(this.currentPage - 1);
          break;
        case 'refresh':
          this.refresh();
          break;
      }
    });

    this.loadInitial();
  }

  public static createOrShow(): void {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (FrontPagePanel.currentPanel) {
      FrontPagePanel.currentPanel.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'hackerNewsFrontPage',
      'Hacker News',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    FrontPagePanel.currentPanel = new FrontPagePanel(panel);
  }

  private async loadInitial(): Promise<void> {
    this.isLoading = true;
    this.render();

    try {
      this.storyIds = await fetchTopStoryIds();
      this.totalPages = Math.ceil(this.storyIds.length / STORIES_PER_PAGE);
      await this.goToPage(1);
    } catch (error) {
      this.renderError('Could not load Hacker News. Check your internet connection.');
    }
  }

  private async refresh(): Promise<void> {
    this.pageCache.clear();
    this.currentPage = 1;
    await this.loadInitial();
  }

  private async goToPage(page: number): Promise<void> {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

    if (this.pageCache.has(page)) {
      this.render();
      return;
    }

    this.isLoading = true;
    this.render();

    try {
      const start = (page - 1) * STORIES_PER_PAGE;
      const end = start + STORIES_PER_PAGE;
      const pageIds = this.storyIds.slice(start, end);

      const stories = await fetchStories(pageIds);
      this.pageCache.set(page, stories);
      this.isLoading = false;
      this.render();
    } catch (error) {
      this.isLoading = false;
      this.renderError('Failed to load stories for this page.');
    }
  }

  private render(): void {
    const stories = this.pageCache.get(this.currentPage) || [];
    const html = this.generateHTML(stories);
    this.panel.webview.html = html;
  }

  private renderError(message: string): void {
    this.panel.webview.html = renderMarkdownHTML(`
      <div class="error">${escapeHtml(message)}</div>
    `);
  }

  private generateHTML(stories: Story[]): string {
    const content = `
<h1>Hacker News</h1>

<p class="meta"><em>Top Stories — updated just now</em> | <a href="#" class="command-link" onclick="refreshPage()">[Refresh]</a></p>

<hr>

${this.isLoading ? '<p class="loading"><em>Loading stories...</em></p>' : this.renderStoryList(stories)}

${this.renderPagination()}
    `;

    return renderMarkdownHTML(this.injectScripts(content));
  }

  private renderStoryList(stories: Story[]): string {
    const startNum = (this.currentPage - 1) * STORIES_PER_PAGE;

    return stories
      .map((story, index) => {
        const num = startNum + index + 1;
        const timeStr = formatRelativeTime(story.time);
        const storyUrl = story.url
          ? `<a href="#" class="command-link" onclick="openStory(${story.id})">${escapeHtml(story.title)}</a>`
          : `<a href="#" class="command-link" onclick="openComments(${story.id})">${escapeHtml(story.title)}</a>`;

        const externalLink = story.url
          ? ''
          : '<span class="meta">(Ask HN / Show HN)</span>';

        return `
<p><strong>${num}.</strong> ${storyUrl}</p>
<p class="story-meta">
  ↑ ${story.score} points | by ${escapeHtml(story.by)} | ${timeStr} | <a href="#" class="command-link" onclick="openComments(${story.id})">${story.descendants} comments</a>
  ${externalLink}
</p>`;
      })
      .join('\n');
  }

  private renderPagination(): string {
    const prevLink = this.currentPage > 1
      ? `<a href="#" class="command-link" onclick="prevPage()">← Prev ${STORIES_PER_PAGE}</a>`
      : '';

    const nextLink = this.currentPage < this.totalPages
      ? `<a href="#" class="command-link" onclick="nextPage()">Next ${STORIES_PER_PAGE} →</a>`
      : '';

    const pageInfo = `Page ${this.currentPage} of ${this.totalPages}`;

    if (this.currentPage === 1) {
      return `<p class="pagination">${pageInfo} | ${nextLink}</p>`;
    }
    if (this.currentPage === this.totalPages) {
      return `<p class="pagination">${prevLink} | ${pageInfo}</p>`;
    }
    return `<p class="pagination">${prevLink} | ${pageInfo} | ${nextLink}</p>`;
  }

  private injectScripts(content: string): string {
    return content + `
<script>
const vscode = acquireVsCodeApi();

function openStory(id) {
  vscode.postMessage({ command: 'openStory', id });
}

function openComments(id) {
  vscode.postMessage({ command: 'openComments', id });
}

function nextPage() {
  vscode.postMessage({ command: 'nextPage' });
}

function prevPage() {
  vscode.postMessage({ command: 'prevPage' });
}

function refreshPage() {
  vscode.postMessage({ command: 'refresh' });
}
</script>`;
  }
}
