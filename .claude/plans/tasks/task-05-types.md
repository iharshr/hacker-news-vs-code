# Task 5: Types for HN API

**Phase:** 2 - Core Types & API
**Files:** Create: `src/types.ts`

---

## Step 1: Create type definitions for HN data structures

```typescript
// HN Item types from Firebase API
export interface HNStory {
  id: number;
  type: 'story';
  by: string;
  time: number;
  title: string;
  url?: string;
  score: number;
  descendants?: number;
  kids?: number[];
  text?: string;
  deleted?: boolean;
  dead?: boolean;
}

export interface HNComment {
  id: number;
  type: 'comment';
  by: string;
  time: number;
  text?: string;
  kids?: number[];
  parent: number;
  deleted?: boolean;
  dead?: boolean;
}

export interface HNJob {
  id: number;
  type: 'job';
  by: string;
  time: number;
  title: string;
  score: number;
  text?: string;
  url?: string;
}

export interface HNPoll {
  id: number;
  type: 'poll';
  by: string;
  time: number;
  title: string;
  score: number;
  text?: string;
  kids?: number[];
  parts?: number[];
  descendants?: number;
}

export interface HNPollOpt {
  id: number;
  type: 'pollopt';
  by: string;
  time: number;
  poll: number;
  score: number;
  text?: string;
}

export type HNItem = HNStory | HNComment | HNJob | HNPoll | HNPollOpt;

export interface Story {
  id: number;
  title: string;
  url: string | null;
  by: string;
  score: number;
  time: number;
  descendants: number;
  kids: number[];
  text?: string;
  type: string;
}

export interface Comment {
  id: number;
  by: string;
  time: number;
  text: string;
  kids: Comment[];
  deleted: boolean;
  dead: boolean;
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
- [ ] `src/types.ts` created
- [ ] TypeScript compiles without errors
