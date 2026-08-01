# Arg Anchor System File Map (FILETREE)

This document provides a highly structured directory inventory and architectural map of the **Arg Anchor** repository. It lists every major file and folder in the codebase with a precise, one-line technical description of its systemic purpose, structural alignment, and governance role.

---

## Root Configuration and Execution Context

- **`/`** — The root workspace directory hosting system manifests, build pipelines, stand-alone configurations, and core server configurations.
- **`/.env.example`** — Environment template documenting the mandatory runtime secrets and configurations (e.g., `GEMINI_API_KEY`, `APP_URL`).
- **`/.gitignore`** — Declares directories and build assets excluded from version control tracking (e.g., `node_modules`, compiled bundles, caches).
- **`/LICENSE`** — Core legal license governing usage, distribution, and operator sovereignty over the codebase.
- **`/README.md`** — Investor-grade documentation detailing the operational architecture, portability pipelines, and five conceptual system pillars.
- **`/index.html`** — Root single-page entry point serving as the viewport wrapper, importing the client-side TypeScript bootstrapper.
- **`/metadata.json`** — Declares system permissions and applet capabilities to the hosting container (including server-side Gemini API authority).
- **`/package.json`** — Node.js manifest defining project metadata, development runner dependencies, and build pipeline definitions.
- **`/server.ts`** — Stand-alone Node.js server mounting Vite development middleware or serving compiled static bundles with unified backend proxy APIs.
- **`/tsconfig.json`** — Declares compiler options, strict type-checking parameters, and module resolution paths for TypeScript compilation.
- **`/vite.config.ts`** — Fast compilation asset engine configuring Vite, React plugins, and Tailwind compilation triggers.

---

## Source Directory (`/src`)

- **`/src/`** — Root application source containing UI systems, core adapters, state managers, and autonomic runtime services.
- **`/src/App.tsx`** — Root React layout shell managing visual navigation frames, state context bindings, and viewport viewports.
- **`/src/index.css`** — Global styling gateway loading Tailwind CSS utility definitions and setting dark/light cybernetic variables.
- **`/src/main.tsx`** — Standard entry script that boots the virtual DOM, mounting the root `App` container inside the viewport frame.
- **`/src/types.ts`** — Domain model declaration hub defining state structures, vector enums, ledger contracts, and governance types.

### Architectural Core (`/src/core`)

- **`/src/core/`** — Foundations of state tracking, cognitive translation, and execution tracking.
- **`/src/core/RuntimeContext.tsx`** — Central state manager providing global state context, event ledger records, system alerts, and perspective switches.
- **`/src/core/TranslationLayer.ts`** — Cognitive intent compiler mapping human language input into canonical model states and specifications.

### Cognitive Adapters (`/src/adapters`)

- **`/src/adapters/`** — Orchestration boundary wrappers housing communication logic with external models or system APIs.
- **`/src/adapters/geminiAdapter.ts`** — Client-server proxy calling the modern `@google/genai` TypeScript SDK to securely execute server-side model tasks.

### Root Services (`/src/runtime`)

- **`/src/runtime/`** — Isolated system services handling autonomic operations, checking safety policies, and validating mandates.
- **`/src/runtime/MandateValidatorService.ts`** — Validation engine verifying translated models against constitutional rules and governance structures.

### Visual Subsystems (`/src/components`)

- **`/src/components/`** — Modular, presentation-level React dashboards representing the five pillars of the system.
- **`/src/components/CapabilityRegistryPanel.tsx`** — Visualizes current pipeline processes, latency logs, execution threads, and hardware utilization gauges.
- **`/src/components/ConsoleTerminal.tsx`** — Retro CLI interface displaying stream logs, system state transitions, and taking manual operator commands.
- **`/src/components/GovernancePanel.tsx`** — Review dashboard tracking systemic guidelines, organelle bounds, and simulated policy-conflict resolution.
- **`/src/components/HomePanel.tsx`** — Core welcoming panel detailing the consumer-facing continuity promise and providing fast landing shortcuts.
- **`/src/components/IntentTranslator.tsx`** — Interactive parser showing translated specifications, source codes, and the under-the-hood execution orchestration consoles.
- **`/src/components/KnowledgeObjectsPanel.tsx`** — Structural data browser exposing immutable schemas, operational templates, and technical metadata indexes.
- **`/src/components/OperationalStatePanel.tsx`** — Vector alignment view showing Caution, Aggression, and Exploration metrics plotted on a balance vector radar map.
- **`/src/components/PipelineVisualizer.tsx`** — Real-time state transit flowchart showing human input passing through parsing, validation, routing, and projection.
- **`/src/components/RestorationPanel.tsx`** — Disaster recovery suite showing append-only state snapshots, rollback triggers, and automated healing simulations.
