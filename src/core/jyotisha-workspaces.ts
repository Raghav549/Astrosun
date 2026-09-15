export interface JyotishaWorkspace {
  id: string;
  title: string;
  description: string;
  inputs: readonly string[];
  outputs: readonly string[];
  status: 'implemented' | 'research-boundary' | 'planned';
}

export const JYOTISHA_WORKSPACES: readonly JyotishaWorkspace[] = [
  { id: 'kundli', title: 'Kundli / Natal Chart', description: 'Birth date, time, place, sidereal chart and provenance.', inputs: ['birth date', 'birth time', 'birth location'], outputs: ['rashi chart', 'graha positions', 'lagna', 'nakshatra'], status: 'implemented' },
  { id: 'graha', title: 'Graha Explorer', description: 'Selectable celestial bodies with longitude, sign and motion metadata.', inputs: ['date/time', 'ephemeris provider'], outputs: ['longitude', 'sign', 'motion'], status: 'implemented' },
  { id: 'bhava', title: 'Bhava / House Workspace', description: 'House-system comparison with explicit astronomical assumptions.', inputs: ['chart', 'house system'], outputs: ['house cusps', 'occupancy'], status: 'research-boundary' },
  { id: 'nakshatra', title: 'Nakshatra & Pada', description: 'Sidereal lunar mansion and pada calculation from Moon longitude.', inputs: ['date/time', 'ayanamsa'], outputs: ['nakshatra', 'pada', 'longitude'], status: 'implemented' },
  { id: 'dasha', title: 'Dasha Timeline', description: 'Configurable traditional dasha framework with rule provenance.', inputs: ['birth chart', 'dasha system'], outputs: ['period timeline'], status: 'research-boundary' },
  { id: 'transits', title: 'Gochar / Transits', description: 'Current or historical planetary transit overlay against a natal chart.', inputs: ['natal chart', 'target date'], outputs: ['transit positions', 'angular relationships'], status: 'research-boundary' },
  { id: 'muhurta', title: 'Muhurta Lab', description: 'Event timing candidates with declared Panchanga and regional rules.', inputs: ['event type', 'location', 'date window'], outputs: ['candidate windows', 'rule explanations'], status: 'research-boundary' },
  { id: 'vivah', title: 'Vivah Matching', description: 'Traditional compatibility calculations separated from empirical relationship claims.', inputs: ['two birth charts', 'matching system'], outputs: ['traditional score', 'component breakdown'], status: 'research-boundary' },
  { id: 'rituals', title: 'Sanskara Planner', description: 'Naming, mundan, upanayana and griha-pravesh event-planning surface.', inputs: ['event', 'region', 'date window'], outputs: ['muhurta candidates', 'rule provenance'], status: 'research-boundary' },
  { id: 'gemstones', title: 'Gem / Stone Traditions', description: 'Transparent cultural recommendation surface without unsupported health or fate guarantees.', inputs: ['traditional rule set', 'chart'], outputs: ['traditional associations', 'reasoning'], status: 'research-boundary' },
  { id: 'palm', title: 'Palm Analysis Lab', description: 'Image-based measurable palm-feature extraction, separated from traditional interpretation.', inputs: ['palm photo'], outputs: ['line geometry', 'segmentation overlays', 'traditional interpretation'], status: 'research-boundary' },
  { id: 'evidence', title: 'Evidence & Provenance', description: 'Source-aware claim cards linking calculations, papers and declared limitations.', inputs: ['claim', 'calculation', 'source'], outputs: ['provenance chain', 'confidence boundary'], status: 'implemented' },
];

export function getJyotishaWorkspace(id: string): JyotishaWorkspace | undefined {
  return JYOTISHA_WORKSPACES.find((workspace) => workspace.id === id);
}
