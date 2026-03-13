# Task 2: TypeScript Configuration

**Phase:** 1 - Project Setup
**Files:** Create: `tsconfig.json`

---

## Step 1: Create tsconfig.json

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "lib": ["ES2020"],
    "outDir": "dist",
    "rootDir": "src",
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Step 2: Create source directory

**Command:**
```bash
mkdir -p src media
```

**Expected:** Directories created

---

## Checklist
- [ ] `tsconfig.json` created
- [ ] `src/` directory created
- [ ] `media/` directory created
