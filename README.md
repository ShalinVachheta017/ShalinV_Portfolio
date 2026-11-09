# Beyond the Model — Portfolio

Personal engineering portfolio of Shalin Vachheta.

**Website:** https://shalinvachheta017.github.io/ShalinV_Portfolio/

This website focuses on what I built, which engineering challenges I encountered, and what the experiments taught me. It connects short introductions to full project case studies and the corresponding GitHub repositories.

## Pages

- `index.html` — homepage, project overview, interactive thesis evaluation and featured case studies.
- `cases/thesis.html` — smartwatch activity recognition, honest evaluation and the ten-stage MLOps workflow.
- `cases/rag.html` — multilingual document retrieval and evidence-grounded answer generation.
- `cases/insurance.html` — ML pipeline, packaging and AWS deployment workflow.
- `cases/kubernetes.html` — Kubernetes self-healing and load balancing, with an illustrative interactive experiment.
- `cases/seq2seq.html` — event-sequence prediction and research engineering.
- `cases/pegasus.html` — dialogue summarization model, five training stages and local inference.
- `assets/base.css` — shared editorial design foundation.
- `assets/studio.css` — theme styles, interactions and responsive case layouts.
- `assets/studio.js` — theme switch, navigation progress and interactive examples.
- `assets/architecture.js` — five data-driven source-linked C4/UML-inspired architecture explorers (16 technical views).
- `shalin-bridge.jpg` — existing profile photograph.

## Run locally

This is a static website. It does not require an API server, package installation or secret credentials.

```bash
python -m http.server 8000
```

Open `http://localhost:8000/ShalinV_Portfolio/` if serving from the parent directory, or `http://localhost:8000/` if starting the server inside this repository.

You can also host the files as static assets on GitHub Pages.

## Interaction integrity

- The thesis evaluation numbers are **documented historic evaluation results**, not live measurements.
- The architecture explorer describes implemented components, sequence-like workflows and local/deployment setups; it does **not** execute the models, call cloud services or infer from user data.
- Each architecture node links to its related source file in the original project repository.
- Diagram styles are **UML/C4-inspired explanatory views**, not formal UML generated from source code.
- The RAG question walkthrough and Kubernetes pod-recovery demo are **illustrative simulations**, not live production workloads.
- The insurance model's old performance claims are deliberately omitted pending leakage-free reevaluation.

## Accessibility and design

The site supports light/dark mode, a reduced-motion preference, keyboard-usable controls, semantic headings, responsive layouts and direct links to technical evidence. There is no tracker, site analytics script, AI chat widget or user-data submission form.

## Update a project

Update the corresponding case page and verify its GitHub links and results before publishing. Avoid presenting an experiment, synthetic demonstration, or planned feature as a proven deployed system.

## Publishing

Main branch is published via GitHub Pages. For larger design changes, edit on a branch, verify the pages and then merge or promote the approved result.

## Architecture design decisions

The thesis distinguishes seven core stages from three optional, human-approved retraining stages and documents a local Docker Compose runtime. RAG diagrams show ingestion, retrieval, answer grounding and a local Qdrant/Ollama runtime. Insurance distinguishes training, serving and configured GitHub Actions/AWS delivery without implying production readiness. Seq2Seq and PEGASUS are explicitly described as research/model pipelines rather than live hosted services.

Diagrams use semantic HTML buttons over SVG arrow connectors, keyboard-operable view tabs and direct source links. Downloadable PlantUML files in `diagrams/` document the high-level structure in textual UML notation. On mobile, the architecture board can be scrolled horizontally; the selected component explanation stays readable outside the board.

## QA

`node scripts/check-site.mjs` validates local references and JavaScript syntax. `npm install` followed by `npm test` starts a local static server and runs the Playwright browser regression suite on desktop, mobile and small mobile breakpoints. GitHub Actions runs both suites on updates to main or the active architecture branch.

## Languages and privacy

The default English portfolio is served from `/`. The German version is served from `/de/`, with German-language project narratives at `/de/cases/`. The German case studies explain the architecture in German and link to the more detailed interactive technical diagrams in English. No private study plan or future project roadmap is published.
