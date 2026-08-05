# ARG Architectural Constitution (ACR)
**Version:** v1.0 Candidate  
**Status:** FROZEN LAW  
**Scope:** Structural invariants, safety laws, and architectural boundaries for ARG.

---

## 1. Immutable System Laws
1. **Mandate Governance:** All code generation, state mutation, and cognitive execution must strictly adhere to the 9 Core Engineering Mandates (M1–M9).
2. **Four-Layer Isolation:** The system must maintain strict boundary separation between Layer 1 (Operator), Layer 2 (Decision Studio), Layer 3 (ARG Runtime), and Layer 4 (Intelligence Network).
3. **Zero Data Loss:** All state transitions must be backed by the immutable Event Ledger. Transient failures must fall back to safe memory buffers (`safeStorage`).
4. **Sovereign Policy Check:** No cognitive model or LLM prompt can override or subvert the independent Policy Engine and Mandate Linter.

---

## 2. Structural Principles
* **Modular Code Splitting:** Components must be kept small and modular to eliminate token-limit truncation risks.
* **Deterministic Rebuilds:** Given the same Event Ledger sequence, the runtime must reproduce the exact operational state.
* **Non-Destructive Operations:** Data deletions or destructive state rewrites are strictly forbidden without explicit dual authorization.
