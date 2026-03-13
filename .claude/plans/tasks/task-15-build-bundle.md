# Task 15: Build and Bundle

**Phase:** 5 - Build & Package
**Files:** None (build operation)

---

## Step 1: Create dist directory and compile

**Command:**
```bash
mkdir -p dist && npm run compile
```

**Expected:** dist/extension.js created, no errors

---

## Step 2: Verify bundle size is reasonable

**Command:**
```bash
ls -lh dist/extension.js
```

**Expected:** File size < 500KB

---

## Checklist
- [ ] `dist/` directory created
- [ ] `npm run compile` completed without errors
- [ ] `dist/extension.js` created
- [ ] Bundle size < 500KB
