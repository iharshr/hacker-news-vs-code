import { Comment } from './types';
import { formatRelativeTime } from './timeUtils';
import { escapeHtml } from './markdownRenderer';

export function renderComments(comments: Comment[]): string {
  if (comments.length === 0) {
    return '<p class="meta"><em>No comments yet.</em></p>';
  }

  return comments.map((comment) => renderComment(comment, 0)).join('\n');
}

function renderComment(comment: Comment, depth: number): string {
  const timeStr = formatRelativeTime(comment.time);
  const header = `<strong>${escapeHtml(comment.by)}</strong> | ${timeStr}`;

  const textHtml = comment.text
    ? hnHtmlToMarkdownHtml(comment.text)
    : '<em>No content</em>';

  let childrenHtml = '';
  if (comment.kids.length > 0 && depth < 6) {
    childrenHtml = comment.kids
      .map((child) => renderComment(child, depth + 1))
      .join('\n');
  } else if (comment.kids.length > 0 && depth >= 6) {
    childrenHtml = '<blockquote><em>(nested replies hidden)</em></blockquote>';
  }

  if (depth === 0) {
    return `
<div style="margin-bottom: 24px;">
  <p class="meta">${header}</p>
  <div>${textHtml}</div>
  ${childrenHtml ? `<blockquote>${childrenHtml}</blockquote>` : ''}
</div>`;
  }

  return `
<p class="meta">${header}</p>
<div>${textHtml}</div>
${childrenHtml ? `<blockquote>${childrenHtml}</blockquote>` : ''}`;
}

function hnHtmlToMarkdownHtml(html: string): string {
  // HN sends HTML, we need to make it safe and convert to our format
  // Basic sanitization - remove script tags
  let result = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<p>/gi, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '');

  // Convert HN italic/bold to standard HTML
  result = result
    .replace(/<i>/g, '<em>')
    .replace(/<\/i>/g, '</em>')
    .replace(/<b>/g, '<strong>')
    .replace(/<\/b>/g, '</strong>');

  // Keep code/pre blocks as-is
  // Keep links as-is (HN links are relative, make absolute)
  result = result.replace(
    /<a href="([^"]*)"/g,
    '<a href="$1" target="_blank"'
  );

  return result;
}

export function renderCommentsSection(comments: Comment[], count: number): string {
  return `
<h2>Comments (${count})</h2>
${renderComments(comments)}`;
}
