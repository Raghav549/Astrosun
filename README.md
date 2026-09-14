# Astrosun

Astrosun is a research-oriented astronomy, astrophysics, celestial-mechanics, astrodynamics and Indian calendrical computation platform.

## Scientific contract

Astrosun separates **approximate analytical models** from **validated/high-precision providers**. Every scientific result should expose its coordinate/frame assumptions, time scale, model/provider, version and declared accuracy. The software must never manufacture precision that the underlying model does not support.

## Core layers

- Replaceable Solar/lunar and Solar-System ephemeris providers, including an external DE/SPICE/CALCEPH kernel boundary.
- Provider-grade Cartesian state contracts with explicit frame/time-scale/accuracy metadata and kernel coverage/integrity checks.
- Explicit astronomical time-scale boundaries: UTC, TAI, TT, TDB, TCB and TCL, with Earth-orientation and relativistic body-time research boundaries.
- Coordinate/frame transforms, observer geometry, sidereal time, atmospheric refraction and apparent-disk policy.
- Sunrise, sunset, moonrise and moonset provider contracts with bracketed event solvers.
- Eclipse phase candidates plus apparent solar disk/contact geometry; global path calculation remains provider/data dependent.
- Panchanga primitives: Tithi, Nakshatra/Pada, Yoga and Karana, plus location/time-zone/day-boundary and declared regional policy contracts.
- Tropical/sidereal boundary with a replaceable ayanamsa provider.
- Reproducible validation, uncertainty/covariance primitives and benchmark acceptance gates against named reference ephemerides.
- Newtonian N-body, RK4 and velocity-Verlet propagation substrates plus a unified state-propagation contract.
- Astrophysics formula primitives, relativistic compact-object relations and numerical flat-LambdaCDM age/lookback calculations.
- Provenance/evidence metadata, evidence graph and research-to-architecture literature map.

## Research direction

The target architecture is intentionally broader than a calendar application: observational astronomy, celestial mechanics, astrodynamics, Solar-System dynamics, eclipses and sky events, stellar/galactic/relativistic astrophysics, cosmology, scientific data analysis, research-paper retrieval, evidence-aware AI reasoning, and educational workflows.

Current architecture work is informed by jorbit's JPL-DE/Chebyshev/high-precision approach, Brahe's explicit time/reference-frame and propagation design, validated lightweight DE440 comparisons, and TEMPUS's ephemeris-consistent body-centered time-scale architecture. These papers inform interfaces and validation priorities; they are not treated as runtime authority.

## Production rules

1. No mock scientific outputs in production paths.
2. Approximate results must be labelled approximate.
3. Unsupported time-scale conversions must fail explicitly until an authoritative provider/table is installed.
4. High-precision claims require a reproducible benchmark against a named reference.
5. Scientific calculations remain deterministic for the same declared inputs, provider and version.
6. A candidate eclipse is not a confirmed eclipse until limb/shadow geometry and observer visibility are solved with adequate ephemeris and Earth-orientation data.
7. Regional Panchanga conventions must be explicitly versioned; the engine must not silently mix month, sunrise and festival rules.
8. External DE/SPICE/CALCEPH kernels are data dependencies, not invented source code; kernel identity, checksum and coverage must be declared.
9. Render/deployment configuration is not part of the scientific source of truth; the GitHub repository is the source of truth for the computational core.
