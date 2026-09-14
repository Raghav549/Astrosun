# Astrosun Research Reproducibility Contract

Astrosun treats scientific software as a research artifact, not only as application code.

## Every scientific result must identify

- input epoch and time scale
- coordinate/reference frame
- computational model/provider and version
- accuracy class and known limitations
- provenance and reproducibility information
- validation reference and metric when a quantitative accuracy claim is made

## Precision policy

Approximate analytical routines may be used for exploration, education, visualization, and baseline testing. They must not be presented as high-precision astrometry, navigation, or authoritative calendar output.

High-precision claims require a registered provider and a reproducible comparison against an authoritative reference ephemeris or standard.

## Calendar policy

Panchanga outputs are separated into astronomical geometric ingredients and calendar-rule interpretation. A regional calendar result must identify the rule set, day-boundary/sunrise policy, location, ayanamsa system, and ephemeris/provider.

## Software quality policy

Scientific modules should have deterministic tests for mathematical invariants, documented examples, and reproducible benchmark inputs. A passing TypeScript build alone is not sufficient evidence of scientific correctness.

## Research evidence policy

Literature-derived implementation decisions should retain a paper identifier or other stable scholarly reference. Research claims should distinguish peer-reviewed/reference-standard evidence from exploratory or interpretive material.

## Current implementation boundary

The repository currently contains explicitly labelled approximate astronomical primitives and provider contracts. Precision layers are designed to be replaceable rather than silently upgraded by changing labels.
