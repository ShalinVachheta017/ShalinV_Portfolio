# Beyond the Model — Portfolio

Personal engineering portfolio of Shalin Vachheta.

**Website:** https://shalinvachheta017.github.io/ShalinV_Portfolio/

This website focuses on what I built, which engineering challenges I encountered, and what the experiments taught me. It connects short introductions to full project case studies and the corresponding GitHub repositories.

## Pages

- `index.html` — homepage, project overview, interactive thesis evaluation and current learning focus.
- `cases/thesis.html` — smartwatch activity recognition, honest evaluation and the ten-stage MLOps workflow.
- `cases/rag.html` — multilingual document retrieval and evidence-grounded answer generation.
- `cases/insurance.html` — ML pipeline, packaging and AWS deployment workflow.
- `cases/kubernetes.html` — Kubernetes self-healing and load balancing, with an illustrative interactive experiment.
- `cases/seq2seq.html` — event-sequence prediction and research engineering.
- `assets/base.css` — shared editorial design foundation.
- `assets/studio.css` — theme styles, interactions and responsive case layouts.
- `assets/studio.js` — theme switch, diagrams, navigation progress and interactive examples.
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
- The architecture explorer describes pipeline stages; it does **not** run the models.
- The RAG question walkthrough and Kubernetes pod-recovery demo are **illustrative simulations**, not live production workloads.
- The insurance model's old performance claims are deliberately omitted pending leakage-free reevaluation.
- AWS Certified Cloud Practitioner is **in preparation through Udemy coursework**, not a certification already earned.
- Advanced Kubernetes autoscaling and Agentic AI capabilities are labeled as work in progress.

## Accessibility and design

The site supports light/dark mode, a reduced-motion preference, keyboard-usable controls, semantic headings, responsive layouts and direct links to technical evidence. There is no tracker, site analytics script, AI chat widget or user-data submission form.

## Update a project

Update the corresponding case page and verify its GitHub links and results before publishing. Avoid presenting an experiment, synthetic demonstration, or planned feature as a proven deployed system.

## Publishing

Main branch is published via GitHub Pages. For larger design changes, edit on a branch, verify the pages and then merge or promote the approved result.
