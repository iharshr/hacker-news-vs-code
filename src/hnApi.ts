import * as https from 'https';
import { Story, Comment, HNItem, HNStory, HNComment } from './types';

const API_BASE = 'https://hacker-news.firebaseio.com/v0';
const TIMEOUT_MS = 10000;

function fetchJSON<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      req.destroy(new Error('Request timeout'));
    }, TIMEOUT_MS);

    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        clearTimeout(timeout);
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON parse error: ${e}`));
        }
      });
    });

    req.on('error', (e) => {
      clearTimeout(timeout);
      reject(e);
    });
  });
}

export async function fetchTopStoryIds(): Promise<number[]> {
  return fetchJSON<number[]>(`${API_BASE}/topstories.json`);
}

export async function fetchItem<T extends HNItem>(id: number): Promise<T | null> {
  return fetchJSON<T | null>(`${API_BASE}/item/${id}.json`);
}

function hnStoryToStory(item: HNStory | null): Story | null {
  if (!item || item.deleted || item.dead) return null;
  return {
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
}

export async function fetchStories(ids: number[]): Promise<Story[]> {
  const items = await Promise.all(
    ids.map((id) => fetchItem<HNStory>(id))
  );
  return items
    .map(hnStoryToStory)
    .filter((s): s is Story => s !== null);
}

export async function fetchComment(id: number, depth: number = 0): Promise<Comment | null> {
  if (depth > 6) return null;

  const item = await fetchItem<HNComment>(id);
  if (!item || item.deleted || item.dead) {
    return {
      id,
      by: '[deleted]',
      time: 0,
      text: item?.deleted ? '[deleted]' : '[flagged]',
      kids: [],
      deleted: !!item?.deleted,
      dead: !!item?.dead,
    };
  }

  let kids: Comment[] = [];
  if (item.kids && item.kids.length > 0 && depth < 6) {
    const childComments = await Promise.all(
      item.kids.map((kidId) => fetchComment(kidId, depth + 1))
    );
    kids = childComments.filter((c): c is Comment => c !== null);
  }

  return {
    id: item.id,
    by: item.by,
    time: item.time,
    text: item.text || '',
    kids,
    deleted: false,
    dead: false,
  };
}

export async function fetchComments(storyId: number): Promise<Comment[]> {
  const story = await fetchItem<HNStory>(storyId);
  if (!story || !story.kids || story.kids.length === 0) {
    return [];
  }

  const maxComments = 200;
  const commentIds = story.kids.slice(0, maxComments);

  const comments = await Promise.all(
    commentIds.map((id) => fetchComment(id, 0))
  );
  return comments.filter((c): c is Comment => c !== null);
}
