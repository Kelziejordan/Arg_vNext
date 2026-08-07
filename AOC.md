# ARG Operational Constitution (AOC)
**Version:** v1.0 RC2  
**Status:** Constitutional Review Candidate (RC2)  
**Scope:** ARG behavior, workflow, and operational states across all implementations. Not yet FROZEN — pending final constitutional review after incorporating architectural decisions made subsequent to RC1.

---

## Official Product Vision & Tagline
> *"Describe what you want to build. We'll organize the details, secure the architecture, and ensure your progress is never lost."*

---

## 0. Document Stack (Context)
This document is one layer in a multi-document constitutional stack. Each document has a single responsibility:
* **ACR v1.0** — Immutable architectural law.
* **AOC v1.0 (this document)** — Immutable operational law.
* **ARS v1.0** — Runtime implementation specification.
* **Deliberation Environment Specification v1.0** — Deliberation engine implementation (reference: Decision Studio).
* **Workspace Specification v1.0** — Operator and Builder experience implementation.
* **Knowledge Vault Specification v1.0** — Persistence, continuity, and retrieval implementation.
* **Acceptance Standard v1.0** — Freeze criteria for any subsystem or specification.

The AOC defines behavior. It does not define storage formats, indexing schemes, deliberation UI, or persistence mechanics — those belong to the specifications above.

---

## 1. Purpose
The ARG Operational Constitution (AOC) defines how ARG behaves in practice: how user objectives become governed workflows, how decisions are made and escalated, how artifacts are produced and preserved, and how continuity is maintained across sessions, projects, and implementations.

It is binding on every implementation of ARG, regardless of UI, runtime, AI provider, or surrounding platform. Where the ACR defines immutable architectural principles, the AOC defines immutable operational behavior.

---

## 2. Precedence and Scope
* The ACR defines ARG's immutable principles.
* The AOC (this document) defines ARG's immutable operational behavior and workflow.
* The ARS, Deliberation Environment Specification, Workspace Specification, Knowledge Vault Specification, and Acceptance Standard define implementation details that MUST conform to the ACR and AOC.

### Precedence Rules:
1. If the AOC appears to conflict with the ACR, the ACR prevails.
2. Implementations MAY add features, constraints, or UI layers, but MUST NOT violate or silently bypass any obligation in this document.
3. Operational behavior defined here is binding across all UIs, providers, and runtimes.

### Ownership Boundaries:
* The AOC defines that knowledge shall never be destroyed.
* The Knowledge Vault Specification defines how knowledge is stored, indexed, archived, versioned, searched, and recovered.
* The AOC defines that deliberation exists as a distinct behavioral mode; the Deliberation Environment Specification defines how that mode is implemented.

---

## 3. Product Philosophy & UI Exposure Rule
ARG is not a chat interface, an AI assistant, or a set of prompts. ARG is an operational system for turning user objectives into governed, traceable execution.

ARG's value is measured by whether users reliably achieve their objectives with confidence, traceability, and recoverability — not by the novelty of its responses or capabilities.

### Interface Principle:
The interface expresses operational states. The interface does not define operational states.

### The <5% UI Exposure Rule:
The user interface SHALL intentionally expose less than 5% of the system's internal machinery. The interface is a controlled window into a governed system, not a mirror of its internals. Exposing more than the minimum necessary for user comprehension and control increases surface area for drift, confusion, and misuse.

---

## 3.1 Operational Principles
ARG's behavior is guided by the following principles:
* **Outcome-centric:** Every workflow is anchored to a user objective, not to features or tools.
* **Governed by confidence:** Escalation and deliberation are driven by confidence thresholds, not convenience or time.
* **Traceable by default:** Every significant decision and transformation produces an artifact with provenance.
* **Continuity over sessions:** ARG treats sessions as windows onto a persistent continuity of projects and knowledge.
* **Reversible when possible:** Where practical, ARG prefers actions that can be understood, audited, and rolled back.
* **Technology-agnostic:** Behavior is invariant across AI providers, models, and UI containers.
* **Minimal exposure:** Only the machinery a user needs to understand and control their outcome is surfaced.

---

## 3.5 Operational Invariants
The following conditions shall remain true throughout every execution regardless of implementation, user interface, AI provider, or runtime:
* **Invariant 1:** Every request produces state.
* **Invariant 2:** Every state is recoverable.
* **Invariant 3:** Every escalation increases confidence.
* **Invariant 4:** Every decision produces traceable artifacts.
* **Invariant 5:** Every artifact maintains provenance.
* **Invariant 6:** Every completed workflow updates continuity.
* **Invariant 7:** Every workflow may resume after interruption.
* **Invariant 8:** Every project remains AI-independent.
* **Invariant 9:** No knowledge is silently destroyed.
* **Invariant 10:** No operational state bypasses governance.
* **Invariant 11:** Every user objective is evaluated before completion.
* **Invariant 12:** No implementation may redefine Canonical Operational States.
* **Invariant 13:** Every execution cycle ends with an explicit outcome check.
* **Invariant 14 (Core Philosophy):** Execution SHALL remain subordinate to understanding. ARG shall not optimize for speed at the expense of correctly understanding the user's objective.

---

## 4. Operational Separation (Layer Recognition)
ARG operates across four distinct operational layers. The AOC does not define how these layers are implemented, but it recognizes their separation because it directly affects workflow, escalation, and governance:
1. **User Layer** — Originates objectives, approves outcomes, operates the Workspace.
2. **Deliberation Environment** — The constitutional deliberation environment (Reference implementation: Decision Studio).
3. **ARG Runtime** — Executes governed workflows across Canonical Operational States.
4. **Intelligence Network** — The pool of AI providers/models invoked by the Runtime.

### Obligations:
* Ordinary execution occurs in the ARG Runtime; it MUST NOT silently escalate into deliberation without a defined trigger.
* Deliberation occurs in the Deliberation Environment; it MUST NOT be treated as ordinary execution once triggered.
* The Intelligence Network is interchangeable behind this boundary; no single provider is architecturally privileged.
* The User layer only ever interacts with outcomes, approvals, and controlled state — never directly with Runtime or Intelligence Network internals.

---

## 5. Canonical Operational States
ARG's behavior is defined in terms of six Canonical Operational States. Implementations MAY present these states through any UI or interaction pattern, but MUST NOT alter their meaning, obligations, or transitions.
* **State 0 — Intake & Orientation:** Understand initial intent, context, and constraints.
* **State 1 — Clarification & Scoping:** Transform initial objective into a bounded, testable scope with success criteria.
* **State 2 — Planning & Design:** Produce explicit execution plan connecting objective to executable steps.
* **State 3 — Execution & Production:** Carry out approved plan producing intermediate artifacts under governance.
* **State 4 — Verification & Review:** Assess whether produced result meets success criteria and perform outcome check.
* **State 5 — Operational Workspace:** Support ongoing user-controlled operation, maintenance, and project evolution.

Deliberation is not a Canonical Operational State. It is a cross-cutting mode that may be invoked from any state when confidence falls below threshold, and always returns control to the triggering state.

---

## 6. Deliberation Environment & Constitutional Deliberation
Ordinary execution and structured deliberation are distinct behavioral modes and MUST NOT be conflated.
* **Ordinary execution** is the default mode within any Canonical Operational State.
* **Deliberation** is a distinct mode entered only when confidence falls below threshold.

### Obligations:
* Deliberation MUST be entered through an explicit, recorded trigger — never implicitly.
* Deliberation MUST produce an artifact capturing the reason for entry, alternatives considered, and resolution.
* Deliberation MUST exit either back to the triggering state with increased confidence, or into an explicit escalation to the user.
* Deliberation is never a permanent state; it is always transitional.

---

## 7. Confidence as the Primary Routing Mechanism
Confidence is the sole legitimate signal that routes execution between ordinary execution and deliberation.

### Escalation Triggers:
* Confidence below threshold for correctness or safety.
* Conflicting objectives or constraints unresolved at current level.
* Scope ambiguity threatening outcome quality or safety.
* Potential ACR/AOC rule violations.

### Escalation Ladder:
1. **Dampen Vectors:** Throttle execution speed and reduce aggression.
2. **Simulation Rollback:** Revert state in-memory to last known compliant checkpoint.
3. **Reflex Reconstruction:** Re-initialize runtime context from frozen seed baseline using `safeStorage`.
4. **Operator Alert:** Present clear, plain-language recovery options to the operator.

---

## 8. Operator Mode and Builder Mode
ARG recognizes two distinct modes of user interaction with the Operational Workspace (State 5):
* **Operator Mode:** The user interacts with the project as a running system — monitoring, approving, and directing outcomes without engaging implementation detail.
* **Builder Mode:** The user interacts with the project as an evolving system — modifying plans, artifacts, and structure directly.

### Obligations:
* Both modes remain subject to governance, artifact production, and confidence-based escalation rules.
* Switching modes MUST NOT bypass any Operational Invariants.
* The <5% UI exposure rule applies independently within each mode.

---

## 9. Governance and Independence
ARG is designed to remain independent of any single AI provider or implementation stack.
* Every project remains AI-independent: artifacts, states, and continuity MUST be preserved in provider-agnostic forms.
* No operational state may bypass governance; all significant actions are subject to constitutional constraints.
* The Intelligence Network is explicitly interchangeable; no provider dependency may be assumed at the constitutional level.

---

## 10. Acceptance Criteria and Outcome Verification
A workflow is not defined by how many steps it ran but by what it achieved and how safely.

### 10.1 Explicit Outcome Check
Every operational cycle SHALL end with an explicit, recorded answer to the question:
> *"Did we actually achieve the user's intended outcome?"*

This check is a formal operational obligation. A workflow MUST NOT be marked complete until this check has been performed and its answer recorded as an artifact.

---

## 11. Artifact Contract
Every decision, plan, execution step, verification, or deliberation event produces at least one artifact.

### Required Fields:
* **Identifier** — Unique, stable identifier.
* **Type** — Kind of artifact (e.g. Plan, Decision, DeliberationRecord, VerificationReport, StateTransition).
* **Source State** — Canonical Operational State or Deliberation mode in which created.
* **Trigger** — Event or condition causing creation.
* **Timestamp** — Date and time of creation.
* **Confidence** — Representation of confidence in correctness/adequacy.
* **Provenance Chain** — References to prior informing artifacts.
* **Persistence Reference** — Pointer resolvable by Knowledge Vault Specification.
* **Audit Reference** — Pointer resolvable by ARS or ledger mechanism.

---

## 12. Continuity, Recovery, and Knowledge
ARG treats knowledge and state as durable, governed assets:
* No knowledge is silently destroyed. Deletion, redaction, or archival MUST be governed and traceable.
* Every state is recoverable using resilient in-memory fallbacks (`safeStorage`) across session restarts.
* Every completed workflow updates continuity.

---

## 13. Explicit Exclusions
To prevent future re-litigation of settled decisions, the AOC explicitly records what has been deliberately excluded:
* **Sovereign Intent Engine:** Explicitly excluded from core architecture. No implementation may reintroduce an autonomous, unbounded intent-setting component without a full constitutional amendment to the ACR and AOC.

---

## 14. Pre-Freeze Acceptance Checklist
Before any specification in the document stack may be declared canonical/FROZEN, it must satisfy the freeze criteria:
1. Does not conflict with the ACR or AOC.
2. Defines behavior/obligations testable against Operational Invariants (Section 3.5).
3. Has no unresolved architectural dependencies outstanding.
4. Has been reviewed against the Explicit Exclusions list.
5. All product names mapped to corresponding abstract concepts.
6. Every execution cycle ends with explicit outcome check.

---

## 15. Versioning and Change Control
This document is **AOC v1.0 RC2** and is NOT yet Canonical FROZEN.

Upon final constitutional review incorporating all outstanding architectural decisions, it MAY be promoted to AOC v1.0 (Canonical) and marked FROZEN. Once FROZEN, changes MUST be classified as Clarification, Correction, or Extension.
