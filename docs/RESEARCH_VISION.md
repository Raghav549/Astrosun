# AstroSun Research Vision

AstroSun is designed as a scientific astronomy/astrophysics platform with a separate traditional Jyotisha interpretation layer. The scientific layer must never present astrological correlations as established physical causation.

## Scientific foundation

The engine is intended to combine:

- high-precision astronomical time and reference-frame handling;
- planetary/lunar/solar ephemerides and coordinate transforms;
- orbital mechanics and perturbation models;
- event detection (conjunctions, oppositions, eclipses, rises/sets, transits and visibility windows);
- Earth-based observer geometry and local-sky calculations;
- uncertainty/provenance tracking for every result;
- research-paper retrieval and evidence-grounded AI explanations;
- reproducible calculations with versioned inputs and algorithms;
- optional computational-astrophysics modules for N-body, gravitational and observational analysis.

Recent research informing the architecture includes modern astrodynamics tooling such as Brahe, which covers IAU/IERS time/reference conventions, force models, coordinate transforms, orbit propagation and visibility calculations, and Indian astronomy guidance on HPC, data science and AI/ML infrastructure.

## AI architecture

The production model gateway is provider-neutral:

1. NVIDIA NIM is the primary configured provider.
2. AIHubMix is the secondary provider.
3. Requests are routed through a common interface.
4. Provider/model health, timeout, quota and error signals determine failover.
5. The user-facing API must remain stable when a provider or model is unavailable.
6. No API key is shipped to the browser/client; all secrets remain server-side.

The gateway must support model capability tags rather than hard-coded model names, so models can be added/removed without rewriting application features.

## Research evidence architecture

Every research-grounded answer should retain:

- paper identifier/title;
- publication/version date;
- source URL;
- relevant passage or structured evidence;
- calculation inputs;
- algorithm/version;
- confidence/uncertainty information;
- distinction between measured/calculated facts, model-dependent inference and traditional interpretation.

## Scientific domains planned

### Solar-system astronomy
Planet positions, Moon phases, eclipses, conjunctions, opposition, retrograde apparent motion, heliocentric/geocentric/topocentric coordinates, rise/set/transit times, angular separation, illumination and visibility.

### Orbital mechanics
Keplerian elements, Cartesian state vectors, propagation, perturbations, event detection, observer visibility, satellite/orbit analysis and long-term secular behaviour where computationally justified.

### Solar and space weather
Solar activity concepts, heliospheric geometry, solar-wind context and space-weather educational/analysis modules, with live mission datasets added through explicit data adapters.

### Astrophysics
Stellar structure concepts, compact objects, black holes, neutron stars, gravitational waves, accretion and jets, galaxies, cosmology, gravitational lensing, observational statistics and computational methods.

### AI/ML for astronomy
Paper-grounded assistants, classification/explanation tools, anomaly-detection workflows, spectral/light-curve/image analysis adapters, reproducibility metadata and model cards.

### Education
School-to-research learning paths, equation explainers, interactive calculators, experiment notebooks, data provenance and paper reading tools.

### Jyotisha layer
Traditional Panchanga, Rashi, Nakshatra, Tithi, Yoga, Karana, Lagna, Dasha and related systems may be implemented as a historical/traditional computational system. The UI must label this layer clearly and avoid implying that planetary positions have experimentally established causal effects on personality, health, wealth or life events.

## Stone/material recommendations

A recommendation engine may exist, but every recommendation must expose its basis. Possible categories:

- mineralogical/physical properties;
- cultural or traditional association;
- provenance/quality information;
- safety/handling notes;
- user preference.

The system must not invent a scientifically established therapeutic effect when none exists.

## 100+ page product map

The application architecture should be organized into scalable feature domains rather than one giant page component. Major domains include:

1. Home / Observatory
2. Birth data / Natal workspace
3. Panchanga
4. Jyotisha calculations
5. Planetary ephemeris
6. Sky and visibility
7. Solar system explorer
8. Orbit lab
9. Eclipse/transit lab
10. Time and calendar lab
11. Space weather
12. Astrophysics explorer
13. Compact objects
14. Gravitational waves
15. Cosmology
16. Gravitational lensing
17. Stellar science
18. Galaxy science
19. Exoplanets
20. Research library
21. Paper reader
22. Evidence cards
23. AI research assistant
24. Calculation notebooks
25. Data explorer
26. Learning/school mode
27. Glossary/reference
28. About/methodology

Each domain can expand into multiple routes, producing the 100+ page target without duplicating core logic.

## Engineering standards

- Type-safe shared domain models.
- Unit-aware numerical values.
- UTC/internal canonical time with explicit local-time presentation.
- Deterministic calculation functions where possible.
- Runtime validation at API boundaries.
- Test vectors for astronomy calculations.
- Error budgets and provenance metadata.
- Graceful AI-provider failover.
- No mock success responses in production paths.
- No fake real-time data.
- Clear feature flags for integrations that require external credentials.
- Accessible, responsive and mobile-first UI.

## Product principle

AstroSun should answer two different questions without confusing them:

**What is physically/astronomically happening?** — calculated from astronomical models/data.

**How do traditional Jyotisha systems interpret that sky configuration?** — calculated from the selected traditional ruleset and presented as cultural/traditional interpretation.

The app can make both layers deep, useful and beautiful without collapsing them into one unsupported scientific claim.
