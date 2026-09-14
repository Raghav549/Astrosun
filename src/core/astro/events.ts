import { angularDistance } from './angles';
import { julianDate, moonEclipticPosition, sunEclipticLongitude } from './ephemeris';
import { angularRoot, bracketFirstRoot, solveBracketedRoot } from './event-bracketing';

export interface AngularEvent {
  type: 'conjunction' | 'opposition';
  date: Date;
  separationDeg: number;
  method: 'coarse-bracket-refined';
  iterations: number;
}

function phaseDifference(date: Date): number {
  const jd = julianDate(date);
  return angularRoot(moonEclipticPosition(jd).longitudeDeg - sunEclipticLongitude(jd), 0);
}

export function nearestSolarLunarEvent(start: Date, end: Date, target: 0 | 180): AngularEvent {
  if (start >= end) throw new Error('start must be earlier than end');
  const startJd = julianDate(start);
  const endJd = julianDate(end);
  const fn = (jd: number) => angularRoot(moonEclipticPosition(jd).longitudeDeg - sunEclipticLongitude(jd), target);
  const bracket = bracketFirstRoot(fn, startJd, endJd, 0.25);

  let rootJd = startJd;
  let iterations = 0;
  if (bracket) {
    const solved = solveBracketedRoot(fn, bracket, 1e-9, 80);
    rootJd = solved.jd;
    iterations = solved.iterations;
  } else {
    let bestJd = startJd;
    let bestResidual = Math.abs(fn(startJd));
    for (let jd = startJd + 0.25; jd <= endJd; jd += 0.25) {
      const residual = Math.abs(fn(jd));
      if (residual < bestResidual) {
        bestResidual = residual;
        bestJd = jd;
      }
    }
    rootJd = bestJd;
  }

  const date = new Date((rootJd - 2440587.5) * 86400000);
  const jd = julianDate(date);
  return {
    type: target === 0 ? 'conjunction' : 'opposition',
    date,
    separationDeg: angularDistance(moonEclipticPosition(jd).longitudeDeg, sunEclipticLongitude(jd)),
    method: 'coarse-bracket-refined',
    iterations,
  };
}

export function lunarPhaseAngle(date: Date): number {
  return phaseDifference(date);
}
