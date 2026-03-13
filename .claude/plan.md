# Hacker News in VSCode Extension — Full Spec

## Project Overview

Build a VSCode extension called **"Hacker News in VSCode (Text Only)"** that lets developers browse Hacker News entirely within VSCode using markdown previews. The goal is a distraction-free, text-only reading experience that looks like documentation, not a social media site.

---

## Extension Identity

- **Name:** hacker-news-vscode
- **Display Name:** Hacker News in VSCode (text only)
- **Publisher:** (user fills in)
- **Description:** Browse Hacker News stories, comments, and linked articles as markdown inside VSCode
- **Activation Event:** Command palette only
- **Main Command:** `hacker-news.open` triggered by typing "Hacker News" in the command palette (Ctrl+Shift+P)

---

## Tech Stack

- **Language:** TypeScript
- **VSCode API:** WebviewPanel with markdown-style HTML rendering (not a true markdown file, but styled to look exactly like VSCode's markdown preview)
- **HN Data:** Hacker News Firebase REST API — https://hacker-news.firebaseio.com/v0/
- **HTML-to-Markdown conversion:** Turndown (npm package) — used when fetching external URLs linked from HN posts
- **HTTP requests:** Node's built-in `https` module or `node-fetch` (no heavy dependencies)
- **Bundler:** esbuild for packaging
- **No React, no UI frameworks, no CSS frameworks** — pure HTML with VSCode's native CSS variables for theming

---

## Core User Flow

1. User opens command palette with Ctrl+Shift+P
2. User types "Hacker News" and selects the command
3. A new VSCode tab opens — it is a Webview Panel styled to look like a markdown preview
4. The panel shows the HN front page (Top 30 stories) rendered as markdown-style text
5. User clicks a story title link → opens a new Webview Panel showing the story detail: the external article parsed to markdown + all comments in a threaded tree
6. User clicks any external link inside a story or comment → fetches that page, runs Turndown on the HTML body, opens a new Webview Panel showing the result as markdown
7. User clicks a "Comments" link on the front page → goes directly to the comment thread view without fetching the external article

---

## Front Page View — Markdown Structure

The front page should render exactly like a numbered markdown list, mimicking the actual HN front page. Each story entry should look like this when rendered:

```
# Hacker News

*Top Stories — updated just now*   [Refresh]

---

**1.** [Story Title Here](command:openStory?id=12345)
↑ 342 points | by username | 4 hours ago | [147 comments](command:openComments?id=12345)

**2.** [Another Story Title](command:openStory?id=12346)
↑ 201 points | by username | 2 hours ago | [89 comments](command:openComments?id=12346)

...up to 30 stories per page

---

[← Prev 30](command:hnPrevPage)  |  Page 2 of 17  |  [Next 30 →](command:hnNextPage)

---
*Hacker News in VSCode (text only)*
```

On page 1, only show `[Next 30 →]` with no Prev link. On the last page, only show `[← Prev 30]` with no Next link. Story numbers are global and continuous — story 1 on page 1, story 31 on page 2, and so on.

---

## Pagination Model

**ID list fetching**

On first open, immediately call `/v0/topstories.json` which returns up to 500 story IDs. Store the full ID array in memory on the panel object. This single call is the only time the full list is fetched. Do not fetch all 500 story details at once.

**Per-page fetching**

Each page shows exactly 30 stories. For page N, slice the ID array from index `(N-1)*30` to `N*30` and fetch those 30 item details in parallel using `Promise.all`. Total pages = `Math.ceil(ids.length / 30)`, which will be 17 for a full 500-item list.

**In-memory page cache**

Maintain a `pageCache: Map<number, Story[]>` on the panel instance. When the user navigates to a page, check the cache first. If the page is cached, render it instantly with no API calls. If not, fetch the 30 items, store the result in the cache, then render. The cache lives for the lifetime of the panel session only — no persistence to disk.

**Loading state**

While a page fetch is in flight, replace the story list area with a centered `*Loading stories 31–60...*` message (using the actual range for that page). The header and footer navigation remain visible during loading so the user knows where they are.

**Refresh behavior**

The Refresh link at the top re-fetches `/v0/topstories.json` to get a fresh ID list, clears the entire page cache, resets to page 1, and fetches the first 30 stories fresh. This is the only way to get updated rankings within a session.

**Navigation links**

The bottom of every page has a single line:

- Page 1: `Page 1 of 17  |  [Next 30 →](command:hnNextPage)`
- Middle pages: `[← Prev 30](command:hnPrevPage)  |  Page 3 of 17  |  [Next 30 →](command:hnNextPage)`
- Last page: `[← Prev 30](command:hnPrevPage)  |  Page 17 of 17`

---

## Story Detail View — Markdown Structure

When user clicks a story title, this view opens in a new tab:

```
# [Story Title](original_url)

*Submitted by username | 342 points | 4 hours ago | Ask HN / Show HN tag if applicable*

[← Back to Front Page] | [View Comments ↓]

---

## Article Content

(The external URL is fetched, its HTML is passed through Turndown, and the resulting markdown is rendered here. Images are stripped — text only. Code blocks are preserved.)

If the article cannot be fetched (paywalled, timeout, 403), show:
> *Article could not be loaded. Original URL: [link]*

---

## Comments (147)

(threaded comment tree — see below)
```

---

## Comment Thread Rendering

Comments are rendered as a nested markdown tree using blockquote indentation to represent depth. Each level of nesting gets one more `>` prefix:

```
---

**username** | 3 hours ago
The main comment text goes here and can be multiple lines.

> **reply_user** | 2 hours ago
> This is a reply to the above comment.
>
> > **nested_user** | 1 hour ago
> > This is a reply to the reply.

---

**another_top_comment** | 4 hours ago
Another top-level comment here.
```

Rules for comments:
- Maximum nesting depth to visually render is 6 levels — beyond that, flatten and add a `*(nested reply)*` note
- Collapsed/dead comments are shown as `*[deleted]*` or `*[flagged]*`
- HN comment HTML (which uses `<p>`, `<a>`, `<code>`, `<pre>`) must be converted to markdown properly
- Each comment shows username (bold) and relative time
- No avatars, no vote buttons, no expand/collapse — pure text

---

## External Link / Article View

When any link is clicked that points to an external website:
1. The extension fetches the URL using https/node-fetch inside the extension host (not in the webview)
2. The raw HTML response body is passed to Turndown with these settings:
   - Images: strip entirely (text only)
   - Links: keep as markdown links
   - Code blocks: preserve with fenced code blocks
   - Tables: convert to markdown tables
   - Strip nav, header, footer, aside elements before passing to Turndown using basic regex or a minimal DOM approach
3. The resulting markdown is displayed in a new Webview Panel with the page title as the tab title
4. At the top of the view: `# Page Title` then `*Source: [original url](url)*` then a horizontal rule then the content
5. If fetch fails: show a friendly error message with the raw URL so user can open it in browser manually

---

## Navigation Model

- Each "page" opens in a new Webview Panel tab — standard VSCode tabs
- No browser-style back button (VSCode tabs handle navigation via tab switching)
- Every view has a `[← Front Page]` link at the top that re-opens or focuses the main HN panel
- The front page panel is a singleton (only one instance — if already open, focus it instead of opening another)
- Story and article panels are not singletons — multiple can be open simultaneously as tabs

---

## Webview Styling Rules

The webview HTML should use VSCode's built-in CSS variables so it automatically adapts to light/dark/high-contrast themes:

- `--vscode-editor-background` for background
- `--vscode-editor-foreground` for text
- `--vscode-textLink-foreground` for links
- `--vscode-textBlockQuote-border` for blockquote left border
- `--vscode-textPreformat-foreground` for inline code
- Font: `--vscode-editor-font-family` or fallback to system monospace
- Font size: `--vscode-editor-font-size`
- Max content width: 800px, centered — like a markdown preview document
- No custom colors hardcoded — everything uses VSCode variables
- The overall impression should be: "this looks like a README"

---

## API Usage Plan

Use the official HN Firebase REST API:

- **Top stories list:** `GET /v0/topstories.json` — returns array of up to 500 item IDs; store all, fetch 30 at a time per page
- **Single item:** `GET /v0/item/{id}.json` — returns story or comment object
- Fetch the current page's 30 story items in parallel via `Promise.all`
- For a story's comments, fetch top-level comment IDs from the story item, then fetch each comment recursively (with depth limit of 6 levels, max ~200 comments total per story to avoid freezing)
- Show `*Loading comments...*` while fetching since comment trees can take a second

---

## Error Handling

- Network failure on front page: show `*Could not load Hacker News. Check your internet connection.*`
- Individual story fails to load: show story title as plain text with `*(could not load)*`
- External article fetch fails: show error message + raw URL
- Turndown parsing throws: catch the error, show `*Could not parse article content.*` + raw URL
- All fetch calls should have a 10 second timeout

---

## Extension Packaging Requirements

- `package.json` with all required VSCode extension fields: name, displayName, description, version, publisher, engines.vscode, activationEvents, contributes.commands
- The command contribution should have a clear title: `"Hacker News: Open Front Page"`
- `esbuild` script to bundle everything into a single `dist/extension.js`
- `.vscodeignore` to exclude node_modules and source files from the packaged `.vsix`
- A `README.md` describing the extension for the VSCode Marketplace listing
- A simple icon — an orange Y on a dark background to evoke HN
- The extension should work on VSCode 1.75.0 and above

---

## What This Extension Is NOT

- Not a full browser embed
- No images displayed anywhere
- No voting, posting, or logging in
- No persistent storage or caching between sessions (in-memory only)
- No settings panel for MVP
- No sidebar panel — command palette only
- No notifications or background polling

---

## File Structure to Generate

```
hacker-news-vscode/
├── src/
│   ├── extension.ts         — activation, command registration
│   ├── hnApi.ts             — all HN Firebase API calls
│   ├── frontPagePanel.ts    — singleton webview for front page, owns pagination state
│   ├── storyPanel.ts        — webview for story + comments
│   ├── articlePanel.ts      — webview for external articles
│   ├── commentRenderer.ts   — recursive comment tree to markdown HTML
│   ├── articleFetcher.ts    — fetch URL + run Turndown
│   └── markdownRenderer.ts  — shared HTML shell with VSCode CSS variables
├── media/
│   └── icon.png
├── package.json
├── tsconfig.json
├── esbuild.js
├── .vscodeignore
└── README.md
```

---

This prompt describes a complete, publishable VSCode extension. Hand this to a code generator or developer and they can implement it file by file with no ambiguity.
