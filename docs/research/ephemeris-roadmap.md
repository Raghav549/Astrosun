# Astrosun Ephemeris Research Roadmap

## Research basis

Astrosun should maintain a layered astronomy computation stack rather than treating one lightweight algorithm as ground truth.

A 2026 study of the `solarsystem` package reports a lightweight analytical implementation validated against JPL DE440, with roughly sub-arcminute mean planetary angular differences over its tested intervals, while also documenting that it is not a replacement for professional high-precision numerical ephemerides. Astrosun therefore treats such analytical methods as a fallback/educational provider, not as the authoritative provider.

Relevant research targets include:

- JPL Development Ephemerides / DE-family reference solutions for planetary and lunar validation.
- IAU/IERS time-scale and reference-frame standards.
- High-precision cislunar timing and relativistic transformations.
- LTE440 research for lunar coordinate time where cislunar applications need it.
- Brahe-style modular astrodynamics architecture for time systems, frames, force models, propagation, and reproducibility.
- Validated analytical solar/lunar calculations for lightweight offline operation.

## Provider hierarchy

1. **High-precision numerical ephemeris provider**
   - Reference-quality results.
   - Explicit ephemeris version and frame/time-scale metadata.
   - Regression tests against pinned reference cases.

2. **Standard analytical provider**
   - Fast and deployable without large ephemeris datasets.
   - Useful for interactive computation and graceful degradation.

3. **Educational approximate provider**
   - Deterministic and dependency-light.
   - Never presented as high-precision truth.

## Required metadata on scientific output

Every astronomical result should be able to carry:

- provider name/version
- ephemeris/reference source
- time scale (UTC/TAI/TT/TDB/etc.)
- coordinate/reference frame
- epoch
- accuracy class
- validation status
- computation timestamp where relevant

## Validation policy

Do not claim arcsecond/minute accuracy from a formula alone. Numerical accuracy claims must come from a reproducible benchmark with a named reference solution and defined test epochs.

## Panchanga/Jyotisha boundary

Panchanga calculations must consume explicit celestial longitudes and explicitly state whether the calculation uses tropical or sidereal coordinates. Ayanamsa is a first-class transformation, not an implicit constant buried in calendar logic.

## Next implementation layers

- high-precision provider interface and adapter
- UTC/TAI/TT/TDB conversion boundary
- nutation/precession/reference-frame services
- full solar/lunar longitude event solver
- topocentric Sun/Moon coordinates
- sunrise/sunset/moonrise/moonset solver
- production Panchanga event engine
- sidereal graha layer
- Lagna/bhava computation
- reproducible historical/calendar validation suite
