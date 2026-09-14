# Astrosun — Definition of Done

Astrosun is considered production-ready only when each scientific output is reproducible, versioned, testable and explicit about its reference system and uncertainty.

## Scientific core
- Every ephemeris result declares provider, version, time scale, reference frame and accuracy class.
- Approximate models never masquerade as high-precision models.
- High-precision results require a registered provider and reproducible comparison against an authoritative reference.
- Event times use bracketed/root-refined solving rather than coarse sampling alone.
- Observer-dependent results require explicit latitude, longitude, elevation and timezone policy.

## Panchanga / lunisolar calendar
- Tithi, Nakshatra, Yoga and Karana calculations use one explicit convention per run.
- Tropical and sidereal coordinates cannot be silently mixed.
- Ayanamsa system is explicit and versioned.
- Calendar rule set, lunar-month convention, intercalation policy and day-boundary rules are explicit.
- Regional calendar outputs are never labelled authoritative until validated against the selected rule authority/reference dataset.

## Software quality
- TypeScript typecheck passes.
- Scientific smoke tests pass deterministically.
- Boundary-condition tests cover angle wraparound, Julian-date conversion and event bracketing.
- CI runs on pushes and pull requests.
- Scientific claims in documentation link to reproducible calculations or literature references.

## Research / AI layer
- Retrieved literature is stored as evidence with paper identifier, version and source URL.
- AI-generated scientific answers distinguish retrieved evidence, calculation, inference and interpretation.
- No unsupported numerical claim is surfaced as measured fact.
- Every model/provider can be replaced behind explicit interfaces.

## Completion standard
The project is not considered complete because the UI looks finished. It is complete when the scientific pipeline from input → reference system → computation → validation → provenance → user-visible result is executable end-to-end for every advertised feature.
