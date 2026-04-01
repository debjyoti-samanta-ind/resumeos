# ResumeOS

**A personal resume intelligence platform built for multi-function MBA job searches.**

ResumeOS solves a real problem: the same professional experience needs to be framed differently for a Product Management role vs. a Strategy role vs. an Operations role. Instead of maintaining separate resume docs, ResumeOS stores every achievement once — with multiple "lens" variants — and assembles the right resume for any job in seconds.

> Built by Debjyoti Samanta, MBA Candidate at UW Foster School of Business (STEM), actively job-searching across Product Management, Strategy, Operations, Analytics & Insights, and Program Management.

---

## What it does

- **Scores any resume against a job description** — tiered keyword extraction, 5-dimension ATS scoring, job fit analysis across seniority, function, industry, narrative coherence
- **Suggests targeted edits** — AI generates prioritized rewrites, swaps, and additions ranked by expected score impact, with per-point breakdowns explaining exactly why each edit matters
- **Live score preview** — accept or decline each edit and watch your score update in real time (no second AI call — deterministic interpolation)
- **Exports a tailored .docx** — ATS-compliant resume generated in-browser, ready to send
- **Tracks every application** — scores, edit decisions, resume snapshot, and HTML report saved per application

---

## Screenshots

<!-- SCREENSHOT 1: Analyzer page — score dial + keyword map -->
<!-- SCREENSHOT 2: EditReviewPanel — suggested edits with accept/decline + live score -->
<!-- SCREENSHOT 3: Application Tracker — sortable table with scores -->
<!-- Add screenshots to a /screenshots folder and update these paths -->

---

## Interesting engineering decisions

**Single AI call architecture** — The AI returns the current score, projected score (if all edits accepted), and all suggested edits in one pass. Post-edit scoring is deterministic interpolation between those two numbers. This eliminates the circular re-scoring loop where a second AI call would produce inconsistent results.

**Deterministic ATS scoring** — Layer 1 (keyword match) uses tiered weighting (Tier 1/2/3 at 3×/2×/1×) with placement multipliers (summary 2×, first bullet 1.5×). Layer 2 covers skills alignment, experience relevance, job fit, and format compliance. Overall = 35% keyword + 25% skills + 15% relevance + 15% fit + 10% format. Runs entirely client-side, no backend.

**Browser-native file saving** — Uses the File System Access API (Chrome/Edge) to write `.docx` and `.html` files directly to a user-chosen folder on disk. The directory handle is persisted in IndexedDB so the user only picks the folder once.

**Dual-mode AI** — Works in free mode (generates prompt → user pastes into Claude.ai → pastes response back) or API mode (direct Anthropic API call via Vite proxy). The rest of the app is unaware of which mode is active.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Storage | Browser localStorage + IndexedDB |
| AI | Anthropic Claude (dual-mode: free copy-paste or API key) |
| Resume export | `docx` — generates ATS-compliant .docx in-browser |
| PDF parsing | `pdfjs-dist` — extracts text from uploaded resume PDFs |

No backend. No database. No deployment required. Everything runs locally.

---

## Run locally

```bash
git clone https://github.com/Debjyoti-Samanta/resumeos.git
cd resumeos
npm install
npm run dev
```

Open your browser to `http://localhost:5173`.

To use AI features, either:
- **Free mode** (default) — copy the generated prompt to [Claude.ai](https://claude.ai) and paste the response back
- **API mode** — add your Anthropic API key in Settings

---

## Project scale

- 48 TypeScript/TSX source files, ~9,800 lines of code
- 31 React components across 5 feature areas
- 8 service modules (AI, storage, scoring, PDF parsing, DOCX export, file system, keyword extraction, report generation)
- Single AI prompt that produces scores + projected scores + all suggested edits in one pass
