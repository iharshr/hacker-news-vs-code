# Task 4: Install Dependencies

**Phase:** 1 - Project Setup
**Files:** None (package operation)

---

## Step 1: Install npm dependencies

**Command:**
```bash
npm install
```

**Expected:** node_modules created with turndown, esbuild, typescript, @types packages

---

## Step 2: Verify installation

**Command:**
```bash
ls node_modules | grep -E "turndown|esbuild|typescript"
```

**Expected:** All three directories listed

---

## Checklist
- [ ] `npm install` completed without errors
- [ ] turndown installed
- [ ] esbuild installed
- [ ] typescript installed
- [ ] @types/node installed
- [ ] @types/vscode installed
