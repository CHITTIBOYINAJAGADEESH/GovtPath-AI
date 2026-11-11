# GovtPath AI Frontend

A responsive React frontend demo for exam preparation, student planning, practice, and performance tracking.

## Run locally

```sh
npm install
npm run dev
```

Run `npm run build` to create the production bundle.

## Deploy to Vercel

The project is configured for Vercel's Vite preset. Use `npm run build` as the build command and `dist` as the output directory. The Vercel rewrite configuration supports direct navigation to client-side routes.

## Student workspace

The authenticated workspace is available at `/app` and includes:

- Dashboard, exam exploration, and My Examinations.
- AI Roadmap and Syllabus & Learning.
- Daily Practice, Mock Tests, Results, and Analytics.
- AI Tutor, Study Planner, Government Jobs, Saved Items, and Settings.

The login and registration pages use simulated authentication. Student profile, selected exams, study preferences, progress, practice activity, test attempts, saved items, planner tasks, and tutor chat history persist in the browser through the Zustand store.

Catalogue and question-bank entries are representative demo data, not official or comprehensive exam information. Mock tests and tutor responses are local simulations. Job pages link to official portals but do not claim to show live recruitment notices.
