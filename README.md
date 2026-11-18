# CareerPilot prototype

This is a frontend/backend prototype for the CareerPilot placement-preparation platform described in the supplied UML design document and Software Engineering Lab write-up.

## Folder structure

- `frontend/` — the browser UI, styles, interactive prototype logic, and uploadable mock resumes.
- `backend/` — a small Node.js fake API that serves the frontend and returns placeholder profile, resume-analysis, and chatbot responses.
- `.github/workflows/validate.yml` — syntax validation for pushes and pull requests.

## Run locally

From this folder, start the fake backend:

```bash
node backend/server.js
```

Then open `http://localhost:4173`.

The frontend still falls back to its local mock data if opened directly without the backend.

## Included prototype flows

- Personalized overview dashboard with readiness, streak, practice time, skill map, and recommendations.
- Adaptive preparation plan with interactive task completion.
- Practice arena with topic filters, answer selection, hint, and feedback.
- Technical / HR mock interview configuration, live placeholder session, and feedback report.
- Resume coach with one normal file-picker upload control and analysis feedback.
- Two uploadable mock resumes are included in `mocks/`. Upload them one at a time: the Aarav PDF shows a Frontend Engineer analysis, while the Riya PDF shows a Data Analyst analysis.
- Progress insights and milestone tracking.
- Profile editing surface.
- Floating Pilot assistant with quick prompts and placeholder responses.

All persistence, authentication, LLM calls, code execution, uploads, and API calls are intentionally mocked for this prototype.

## Try the mock resume flow

1. Open **Resume Coach** from the left navigation.
2. Select **Choose resume file** and upload either PDF from `mocks/`.
3. Upload the other PDF afterward with **Choose another resume** to see the alternate sample statistics and suggestions.
