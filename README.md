# ⚖️ CaseFlow — ADHD-Optimized Case Management

A legal case management app built specifically for people with ADHD and executive dysfunction. Every design decision is based on cognitive science research.

## Why it works for ADHD

- **External working memory** — the app holds all context, so your brain doesn't have to
- **Automatic task lists** — no blank-slate paralysis; pre-lit and lit templates generate on case creation
- **Salient urgency cues** — overdue items pulse red and cannot be missed (bypasses habituation)
- **Relative time** — "Due in 3 days" not just a date (compensates for time blindness)
- **FOCUS NOW panel** — surfaces only what needs attention today, right at the top
- **One-tap task completion** — satisfying checkbox = dopamine reward loop
- **Progress bar** — visible momentum keeps motivation going
- **Minimal friction** — quick-add task in two steps, no buried menus

---

## Setup

### Option A: GitHub Pages (free, access from any device)

1. **Fork or clone this repo** to your GitHub account
2. In your repo, go to **Settings → Pages**
3. Under "Source", select **GitHub Actions**
4. Push any change to `main` — the app will build and deploy automatically
5. Access it at `https://YOUR_USERNAME.github.io/case-manager/`

> **Note:** You'll need to update `"homepage"` in `package.json` to match your URL:
> ```json
> "homepage": "https://YOUR_USERNAME.github.io/case-manager"
> ```

### Option B: Run locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## Cross-device data sync

This app saves data to your browser's localStorage. To access your data on another device:

1. Click **⚙️** in the top right
2. Click **⬇ Export JSON** — save this file to **Google Drive or Dropbox**
3. On your other device, open the app, click **⬆ Import JSON**, and load the file

For automatic sync, consider setting up a cron reminder to export weekly.

---

## Customizing your task templates

Edit `src/data/templates.js` to match your actual workflow.

- `defaultDaysFromOpen` — how many days after the case opens this task is due
- `critical: true` — marks the task as a critical deadline (shown with extra urgency)
- `category` — groups tasks by color dot

---

## Features

- ✅ Pre-litigation and litigation case types
- ✅ Auto-generated task checklists with due dates from open date
- ✅ FOCUS NOW panel for overdue/critical tasks
- ✅ Visual urgency levels (overdue → today → critical → urgent → soon)
- ✅ Quick-add tasks to any case
- ✅ Progress tracking per case
- ✅ Search, filter, and sort cases
- ✅ Export/import for cross-device backup
- ✅ Works offline after first load
- ✅ Mobile responsive
