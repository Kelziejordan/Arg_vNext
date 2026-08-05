# ARG Operational Constitution (AOC)
**Version:** v1.0 RC2 (Release Candidate 2)  
**Status:** PROMOTED TO RC2 (Pending Final Constitutional Freeze)  
**Scope:** ARG operational behavior, state transitions, decision lifecycle, and user experience rules.  

---

## Official Product Vision & Tagline
> *"Describe what you want to build. We'll organize the details, secure the architecture, and ensure your progress is never lost."*

---

## 1. Purpose & Scope
The ARG Operational Constitution (AOC) governs the operational behavior of the Autonomous Reconstruction Group (ARG). It defines how user objectives transform into governed workflows, how decisions escalate to the Decision Studio, how artifacts are generated and preserved, and how continuity is guaranteed across sessions and environments.

The AOC v1.0 RC2 supersedes all earlier draft revisions, incorporating frozen architectural refinements while keeping operational behavior strictly separated from low-level runtime code (ARS) and immutable laws (ACR).

---

## 2. Precedence & Four-Layer Architecture
ARG operations are structured across four explicit architectural layers:
1. **Layer 1: User / Operator Interface** — Clean, intent-driven interface obeying the <5% UI exposure constraint.
2. **Layer 2: Decision Studio** — The highest deliberation environment for confidence-based routing, ADR generation, and consensus.
3. **Layer 3: ARG Runtime Engine** — Sovereign core housing the Governor, Event Ledger, Knowledge Vault, and Capability Registry.
4. **Layer 4: Intelligence Network** — Orchestrated specialist AI models and external service interfaces.

### Document Hierarchy:
* **ACR (Architectural Constitution):** Immutable system laws and safety boundaries.
* **AOC (Operational Constitution - This Document):** Operational states, decision lifecycle, UI rules, and escalation ladders.
* **ARS (Architectural Runtime Specification):** Runtime component APIs, ledger protocols, and storage drivers.

---

## 3. Product Philosophy & UI Exposure Rule
ARG delivers immediate user progress while shielding operators from low-level engineering noise.

* **The <5% UI Exposure Rule:** In Operator Mode, the UI MUST intentionally expose less than 5% of internal system machinery. Low-level logs, thread graphs, and raw state matrices are strictly suppressed to maintain visual clarity and focus.
* **Craft Over Feature Volume:** Design excellence comes from spacious layouts, precise typography, and negative space — never from adding unrequested widgets, sidebars, or mock tools.

---

## 4. Operator Mode vs. Builder Mode Separation
ARG enforces a strict operational dual-mode boundary:
* **Operator Mode (Default Cockpit):**
  - Minimalist, outcome-centric canvas.
  - Presents only current project goal (G1), high-level state, and primary action controls.
  - Adheres strictly to the 5-second onboarding rule (What it is, What to do, What's next).
* **Builder Mode (Engineering Inspector):**
  - Accessible via explicit toggle for developers and system auditors.
  - Provides full transparency into the Policy Linter, Event Ledger, Capability Registry, and Telemetry Matrix.

---

## 5. Canonical Operational States (States 0–5)
ARG state transitions are strictly deterministic and replace all feature-centric paradigms:
* **State 0 (UNINITIALIZED):** Baseline pristine seed state. No active canonical intent.
* **State 1 (INTENT_CAPTURED):** Operator goal parsed, validated against core mandates, and assigned a G1 Canonical Intent ID.
* **State 2 (DELIBERATING):** Active confidence-based routing in the Decision Studio. Specialist models evaluate tradeoffs and produce ADRs.
* **State 3 (BLUEPRINT_COMPILED):** Architectural plan, schema updates, and compliance requirements frozen into an executable blueprint.
* **State 4 (EXECUTING):** Controlled workspace building with active thread throttling, memory limits, and liveness monitoring.
* **State 5 (VERIFIED_COMPLIANT):** Linter verification passed, immutable hash signed, ledger committed, and progress frozen securely.

---

## 6. Confidence-Based Escalation Model
Escalation is governed by confidence scoring rather than automatic multi-agent overhead:
* **High Confidence (>85%):** Automated execution through the ARG Runtime without stopping for manual deliberation.
* **Medium Confidence (50%–85%):** Escalated to the Decision Studio for multi-expert review and trade-off evaluation.
* **Low Confidence / Policy Violation (<50%):** Immediate execution dampening, simulation rollback, and Operator alert.

### Escalation Ladder:
1. **Dampen Vectors:** Reduce execution speed and throttle API aggression.
2. **Simulation Rollback:** Revert state in-memory to the last known compliant checkpoint.
3. **Reflex Reconstruction:** Re-initialize runtime context from frozen seed baseline using `safeStorage`.
4. **Operator Alert:** Present clear, plain-language recovery options to the operator.

---

## 7. Decision Studio & Outcome Verification
* The **Decision Studio** is the supreme deliberation environment. It handles architectural decision records (ADRs), specialist model orchestration, and policy clash resolution.
* **Mandatory Outcome Verification:** At the completion of every State 5 transition, the runtime executes an explicit verification query:
  > *"Did we actually achieve the user's intended canonical outcome?"*
* **Removal of Sovereign Intent Engine:** The legacy Sovereign Intent Engine is explicitly removed by omission; canonical intent is directly managed through the G1 pipeline and Decision Studio.

---

## 8. Artifact Contract & Permanent Persistence
* All generated code, blueprints, and schemas are immutable artifacts signed with SHA-256 hashes.
* Persistence guarantees complete resilience: if browser storage is blocked or restricted in iframe environments, `safeStorage` gracefully falls back to memory without losing operational continuity.

---

## 9. Pre-Freeze Acceptance Checklist
Before any feature, subsystem, or specification is frozen into canonical v1.0 status, it MUST pass the Pre-Freeze Acceptance Checklist:
1. [x] **Architectural Completeness:** Conforms to ACR, AOC, and ARS boundaries.
2. [x] **State Determinism:** Passes zero-data-loss state restoration across restarts.
3. [x] **Recovery Validation:** Recovers gracefully under storage blockage or simulated failure.
4. [x] **Evidence Validation:** Every claim is backed by traceable event ledger entries.
5. [x] **Canonical Terminology:** Strictly uses approved ARG terminology (no legacy or arbitrary terms).
6. [x] **Product Boundary Verification:** Obeys the <5% UI exposure rule in Operator Mode.

---

## 10. Versioning & Transition Protocol
AOC v1.0 RC2 is the canonical candidate reference. Final promotion to Frozen v1.0 requires dual-expert consensus in the Decision Studio, certified by an immutable Ledger signature, and approved by the Operator.
