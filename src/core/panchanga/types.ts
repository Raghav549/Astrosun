export type TithiNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;
export type Paksha = 'Shukla' | 'Krishna';
export interface Tithi { number: TithiNumber; paksha: Paksha; phaseAngleDeg: number; }
export interface Nakshatra { number: number; name: string; longitudeStartDeg: number; longitudeEndDeg: number; pada: number; }
export interface PanchangaSnapshot { jd: number; tithi: Tithi; nakshatra: Nakshatra; yogaDeg: number; karanaIndex: number; sunLongitudeDeg: number; moonLongitudeDeg: number; accuracy: 'approximate'; }
