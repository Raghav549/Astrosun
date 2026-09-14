# Astrosun

Astrosun is a research-oriented astronomy, astrophysics and Indian calendrical computation platform.

## Scientific contract

Astrosun separates **approximate analytical models** from **validated/high-precision providers**. Every scientific result should expose its coordinate/frame assumptions, time scale, model/provider, version and declared accuracy. The software must never manufacture precision that the underlying model does not support.

## Core layers

- Solar/lunar and Solar-System ephemerides through a provider interface.
- Explicit astronomical time-scale boundaries: UTC, TAI, TT, TDB, TCB and TCL.
- Coordinate/frame transforms and angular primitives.
- Event solving with coarse bracketing plus numerical refinement.
- Panchanga primitives: Tithi, Nakshatra/Pada, Yoga and Karana.
- Tropical/sidereal boundary with a replaceable ayanamsa provider.
- Reproducible validation records against named reference ephemerides.
- Provenance/evidence metadata for computational and traditional outputs.

## Research direction

The target architecture is intentionally broader than a calendar application: observational astronomy, celestial mechanics, astrodynamics, Solar-System dynamics, eclipses and sky events, stellar/galactic/relativistic astrophysics, cosmology, scientific data analysis, research-paper retrieval, evidence-aware AI reasoning, and educational workflows.

Research discovery is informed by current literature, including work on validated lightweight Solar-System calculations, high-precision lunar time ephemerides, modern astrodynamics libraries, ephemeris sourcing, and long-lived scientific software.

## Production rules

1. No mock scientific outputs in production paths.
2. Approximate results must be labelled approximate.
3. Unsupported time-scale conversions must fail explicitly until an authoritative provider/table is installed.
4. High-precision claims require a reproducible benchmark against a named reference.
5. Scientific calculations remain deterministic for the same declared inputs, provider and version.
6. Render/deployment configuration is not part of the scientific source of truth; the GitHub repository is the source of truth for the computational core.

## Development sequence

1. Provider-grade ephemerides and authoritative reference data.
2. Full Panchanga rule engine with location/time-zone/day-boundary handling.
3. Planetary positions, topocentric observers, rise/set and eclipse solvers.
4. Celestial mechanics and astrodynamics simulation primitives.
5. Astrophysics modules and research datasets.
6. Evidence graph, paper retrieval and scientific AI reasoning.
7. End-to-end validation, tests, reproducibility artifacts and production UI integration.
