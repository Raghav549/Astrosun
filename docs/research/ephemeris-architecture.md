# Astrosun Ephemeris Architecture

## Status
Research-backed architecture. Current browser-safe baseline uses an explicitly approximate analytical Sun/Moon model. It is not presented as a DE440/SPICE replacement.

## Provider boundary
All future ephemeris implementations must satisfy `src/core/astro/provider.ts`.

The application must not hard-code assumptions about a single ephemeris source. Providers declare:
- id and version
- accuracy class
- per-body position capability
- batch position capability

Consumers can request a minimum accuracy and must fail closed when the registered provider is weaker than requested.

## Reference direction
Research reviewed through alphaXiv includes:
- solarsystem (2026): validated analytical planetary/solar-lunar calculations against JPL DE440, with explicit quantitative validation and a lightweight architecture.
- Brahe (2026): research/engineering astrodynamics architecture with explicit time systems and reference frames, force models, and reproducible scientific software practices.
- LTE440 (2025): numerical lunar time ephemeris built from DE440 with explicit relativistic time-scale transformations and versioned numerical products.

These references inform architecture; their reported accuracies are not inherited by Astrosun unless the corresponding algorithm/data source is actually implemented and independently validated.

## Validation contract
A production provider should ship reproducible validation data and tests comparing calculated positions/events against an identified reference ephemeris. Accuracy claims must include epoch range, coordinate frame, reference source, metric, and known limitations.

## Panchanga boundary
Panchanga/Jyotisha calculations must explicitly declare their coordinate convention. The present code routes baseline Panchanga longitude through a labelled Lahiri-style approximate ayanamsa. High-precision ayanamsa and calendar-rule providers remain a separate implementation target.

## Time-scale boundary
UTC, TAI, TT, TDB, TCB and TCL are separate types. UTC↔TAI requires a versioned leap-second provider. TDB/TCB/TCL transformations must not be fabricated from fixed constants when an authoritative provider is required.
