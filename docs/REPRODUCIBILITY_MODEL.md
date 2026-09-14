# Astrosun Reproducibility Model

Astrosun separates **readiness** from **execution outcome**.

## Readiness

Readiness is what can be established statically from the repository:

- dependency and runtime declarations
- deterministic scientific invariants
- provenance/claim metadata
- documentation and examples
- CI configuration
- test presence
- explicit accuracy and limitation declarations

A high readiness score never implies that execution has succeeded.

## Outcome

Execution outcome requires real execution evidence, such as:

- dependency installation succeeds
- type/build checks succeed
- scientific smoke tests execute
- deterministic checks execute successfully
- full tests pass where available
- generated outputs are validated

The product must not collapse these into one opaque “reproducible” flag.

## Scientific claim policy

A scientific result is considered production-grade only when both its computational model and the applicable validation evidence are known. Approximate mathematical routines remain labelled approximate even when their surrounding software infrastructure is healthy.

## Research basis

This separation follows the readiness/outcome distinction described in ReproScore (arXiv:2605.13275), which explicitly separates static reproducibility readiness from execution-based reproducibility outcome and warns that repository completeness is not equivalent to execution success.
