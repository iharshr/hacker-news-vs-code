import * as https from 'https';
import TurndownService from 'turndown';

const TIMEOUT_MS = 10000;

interface ArticleResult {
  title: string;
  content: string;
  error?: string;
  url: string;
}

function fetchHTML(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      req.destroy(new Error('Request timeout'));
    }, TIMEOUT_MS);

    const req = https.get(url, (res) => {
      // Handle redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timeout);
        fetchHTML(res.headers.location).then(resolve).catch(reject);
        return;
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        clearTimeout(timeout);
        resolve(data);
      });
    });

    req.on('error', (e) => {
      clearTimeout(timeout);
      reject(e);
    });
  });
}

function stripUnwantedElements(html: string): string {
  // Remove nav, header, footer, aside, script, style, noscript
  return html
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : 'Article';
}

function extractBody(html: string): string {
  // Try to get article or main content first
  let match = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  if (match) return match[1];

  match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (match) return match[1];

  match = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (match) return match[1];

  return html;
}

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Strip images
turndownService.addRule('stripImages', {
  filter: 'img',
  replacement: () => '',
});

// Strip image figures
turndownService.addRule('stripFigures', {
  filter: 'figure',
  replacement: (content) => content,
});

export async function fetchArticle(url: string): Promise<ArticleResult> {
  try {
    const html = await fetchHTML(url);
    const title = extractTitle(html);
    const stripped = stripUnwantedElements(html);
    const body = extractBody(stripped);
    const markdown = turndownService.turndown(body);

    return {
      title,
      content: markdown,
      url,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      title: 'Article',
      content: '',
      error: `Could not load article: ${errorMessage}`,
      url,
    };
  }
}
