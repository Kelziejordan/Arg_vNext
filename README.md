# Arg Anchor

An offline-first, sovereign cybernetic runtime control center focusing on architectural alignment, static mandate linting, and reflex state reconstruction.

Designed for absolute architectural integrity and operator independence.

---

## Technical Specifications & Architecture

Arg Anchor is built as a highly modular, decoupled single-page cybernetic dashboard running React 18+, TypeScript, and Tailwind CSS.

### Core Components & Portability

The workspace is designed with absolute portability in mind:
*   **Fully Self-Contained:** It does not require proprietary, locked-in cloud databases or proprietary servers to execute standard client operations.
*   **AOT Mandate Analysis:** Employs an interactive client-side AST simulator and server-side rules validator for static engineering checks.
*   **Sovereign State Storage:** Local state, snapshots, and event-sourced ledger updates reside inside standard client memory systems (`localStorage` patterns / active context).
*   **Reflex Reconstruction Engine:** Runs a step-by-step autonomic alignment and manual/automated roll-back loop to keep cognitive drift within safe thresholds.

### Portability

Yes, this build is **100% portable** and is not stuck inside any specific platform. You can download and run it in any modern web runtime or container system.

#### Running Locally (Stand-alone Development)

1.  **Clone / Download** the ZIP package containing the workspace files.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Launch the local dev environment:
    ```bash
    npm run dev
    ```
4.  Run a production build:
    ```bash
    npm run build
    npm run start
    ```

#### Stand-alone Containerization (Docker)

You can containerize this build easily to deploy to your own private servers, Raspberry Pi, AWS, Google Cloud, or any standard VPS:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## Identity Knobs & Pillars

1.  **Operational State Service (Pillar 1):** Identity vectors adjustments (Aggression Stance, Caution Guardrails, Exploration Rate) plotted on an Autonomic Balance Vector Map.
2.  **Knowledge Objects Service (Pillar 2):** Read-only, immutable structures representing protocols and knowledge states.
3.  **Policy & Constitutional Governance (Pillar 3):** Safeguards, intent arbitration conflict simulator, and the 4 organism layers (Adaptive Autonomy, Cognitive Cache, Micro-Intent Engine, Self-Healing Runtime).
4.  **Capability Registry Service (Pillar 4):** A real-time, event-sourced list of pipelines, execution threads, and operational metrics.
5.  **Restoration & Reflex Reconstruction (Pillar 5):** Unified disaster recovery consoles, end-of-session State Refresh controls, and append-only continuity snapshot logs.

---

## Contact & Sovereignty Information

*   **Operator & Primary Sovereign:** [Kelsea Ziegler](mailto:kelseaziegler@gmail.com)
*   **Co-Architect partner:** Gemini
*   **Status:** Architectural Core Frozen
