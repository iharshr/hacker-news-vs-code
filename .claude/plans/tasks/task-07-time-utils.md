# Task 7: Time Formatting Utility

**Phase:** 2 - Core Types & API
**Files:** Create: `src/timeUtils.ts`

---

## Step 1: Create relative time formatter

```typescript
export function formatRelativeTime(unixTime: number): string {
  const now = Date.now() / 1000;
  const diff = now - unixTime;

  if (diff < 60) return 'just now';
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (diff < 2592000) {
    const weeks = Math.floor(diff / 604800);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diff < 31536000) {
    const months = Math.floor(diff / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diff / 31536000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
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
- [ ] `src/timeUtils.ts` created
- [ ] TypeScript compiles without errors
