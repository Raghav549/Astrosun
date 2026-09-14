/** Explicit regional Panchanga policy catalogue. Rules are labels/policies, not hidden convention mixing. */
import type { PanchangaLocation } from './location';

export type MonthSystem = 'amanta' | 'purnimanta';
export type DayBoundary = 'sunrise' | 'midnight' | 'sunset';

export interface RegionalPanchangaPolicy {
  id: string;
  name: string;
  region: string;
  monthSystem: MonthSystem;
  dayBoundary: DayBoundary;
  festivalDayRule: 'civil-date' | 'sunrise-day';
  ayanamsa: 'Lahiri' | 'Raman' | 'Krishnamurti' | 'custom';
  notes: readonly string[];
}

export const REGIONAL_PANCHANGA_POLICIES: readonly RegionalPanchangaPolicy[] = [
  {
    id: 'north-indian-generic',
    name: 'North Indian Amanta/Purnimanta policy placeholder',
    region: 'North India',
    monthSystem: 'purnimanta',
    dayBoundary: 'sunrise',
    festivalDayRule: 'sunrise-day',
    ayanamsa: 'Lahiri',
    notes: ['Exact festival observance may still depend on local sampradaya and authority.'],
  },
  {
    id: 'maharashtra-generic',
    name: 'Maharashtra Amanta policy',
    region: 'Maharashtra',
    monthSystem: 'amanta',
    dayBoundary: 'sunrise',
    festivalDayRule: 'sunrise-day',
    ayanamsa: 'Lahiri',
    notes: ['Generic astronomical policy; regional vrata/festival exceptions require explicit rules.'],
  },
  {
    id: 'generic-amanta',
    name: 'Generic Amanta',
    region: 'India',
    monthSystem: 'amanta',
    dayBoundary: 'sunrise',
    festivalDayRule: 'sunrise-day',
    ayanamsa: 'Lahiri',
    notes: ['Use as a declared computational baseline only.'],
  },
];

export function getRegionalPolicy(id: string): RegionalPanchangaPolicy {
  const policy = REGIONAL_PANCHANGA_POLICIES.find((item) => item.id === id);
  if (!policy) throw new Error(`Unknown Panchanga policy: ${id}`);
  return policy;
}

export function validateRegionalContext(policy: RegionalPanchangaPolicy, location: PanchangaLocation): void {
  if (!location.timeZone) throw new Error('Regional Panchanga requires an IANA time zone.');
  if (policy.region === 'India' && (location.latitudeDeg < 6 || location.latitudeDeg > 38 || location.longitudeDeg < 68 || location.longitudeDeg > 98)) {
    throw new RangeError(`Location ${location.latitudeDeg},${location.longitudeDeg} is outside the declared India policy envelope.`);
  }
}
