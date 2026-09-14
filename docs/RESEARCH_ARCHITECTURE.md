# Astrosun Research Architecture

## Scope

Astrosun is being built as a long-lived scientific software system, not as a collection of visual demonstrations. The architecture therefore treats reproducibility, explicit assumptions, validation, provenance and replaceable scientific providers as first-class interfaces.

## Evidence hierarchy

1. **Reference numerical ephemeris/data** — authoritative source explicitly named and versioned.
2. **Validated numerical implementation** — algorithm benchmarked against a named reference over a declared domain.
3. **Analytical approximation** — transparent equations with declared accuracy limits.
4. **Traditional/calendrical interpretation** — kept separate from observational/numerical claims.

These evidence classes must not be silently merged by the AI layer.

## Provider rule

Every replaceable scientific backend implements a stable interface and declares its accuracy class, version and reference frame/time-scale assumptions. Consumer modules request a minimum accuracy and fail rather than silently downgrade.

## Validation rule

A scientific claim such as an angular-error bound, timing accuracy or precision level may only be published after a reproducible benchmark has populated a validation record. Literature-reported performance belongs in research metadata until Astrosun reproduces the benchmark itself.

## Research inputs

Current literature informing the architecture includes validated lightweight Solar-System calculations, DE440-based lunar time ephemeris work, modern astrodynamics software, ephemeris sourcing/parsing, scientific-software sustainability, reproducibility of astronomy big-data systems, and AI-assisted scientific software engineering.

## Long-term modules

- time scales and reference systems
- planetary/lunar/solar ephemerides
- topocentric observation geometry
- Panchanga and sidereal calculations
- sunrise/sunset, moonrise/moonset and twilight
- conjunctions, oppositions and eclipse geometry
- celestial mechanics and N-body integration
- astrodynamics and spacecraft/ground-station geometry
- stellar, galactic, high-energy and relativistic astrophysics
- cosmology and gravitational-wave analysis
- astronomical data ingestion and analysis
- research-paper/evidence graph
- evidence-aware scientific AI
- educational and reproducible notebook/workflow surfaces

## Production definition of done

A module is not complete because a UI route exists. It is complete when its mathematical/physical model is identified, its inputs and units are explicit, its provenance is inspectable, its failure boundaries are deterministic, its tests cover important edge cases, and any claimed accuracy is reproducibly validated.
