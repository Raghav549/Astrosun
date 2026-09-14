export const YOGA_NAMES = [
  'Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda',
  'Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyana','Parigha','Shiva',
  'Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti',
] as const;

export const KARANA_NAMES = [
  'Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti',
  'Shakuni','Chatushpada','Naga','Kimstughna',
] as const;

export type YogaName = typeof YOGA_NAMES[number];
export type KaranaName = typeof KARANA_NAMES[number];

/** Return the named yoga for a 0..360° Sun+Moon sum. */
export function yogaName(yogaDeg: number): YogaName {
  const index = Math.min(26, Math.floor((((yogaDeg % 360) + 360) % 360) / (360 / 27)));
  return YOGA_NAMES[index];
}

/**
 * Return the conventional repeating karana name from the half-tithi index.
 * This is a naming layer; regional calendar rules must still define day-boundary handling.
 */
export function karanaName(halfTithiIndex: number): KaranaName {
  const i = Math.max(1, Math.min(60, Math.floor(halfTithiIndex)));
  if (i === 1) return 'Kimstughna';
  if (i >= 58) return i === 58 ? 'Shakuni' : i === 59 ? 'Chatushpada' : 'Naga';
  return KARANA_NAMES[(i - 2) % 7];
}
