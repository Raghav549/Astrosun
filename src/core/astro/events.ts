import { angularDistance, normalizeDegrees } from './angles';
import { julianDate, moonEclipticPosition, sunEclipticLongitude } from './ephemeris';

export interface AngularEvent {
  type: 'conjunction' | 'opposition';
  date: Date;
  separationDeg: number;
  method: 'coarse-bracket-refined';
  iterations: number;
}

function phaseDifference(date: Date): number {
  const jd = julianDate(date);
  return normalizeDegrees(moonEclipticPosition(jd).longitudeDeg - sunEclipticLongitude(jd));
}

function signedTargetError(date: Date, target: 0 | 180): number {
  const phase = phaseDifference(date);
  let error = phase - target;
  while (error <= -180) error += 360;
  while (error > 180) error -= 360;
  return error;
}

export function nearestSolarLunarEvent(start: Date, end: Date, target: 0 | 180): AngularEvent {
  if (start >= end) throw new Error('start must be earlier than end');
  const stepMs = 6 * 3600 * 1000;
  let left = start.getTime();
  let leftError = signedTargetError(new Date(left), target);
  let bestTime = left;
  let bestAbs = Math.abs(leftError);
  let iterations = 0;

  for (let t = left + stepMs; t <= end.getTime(); t += stepMs) {
    const rightError = signedTargetError(new Date(t), target);
    if (Math.abs(rightError) < bestAbs) {
      bestAbs = Math.abs(rightError);
      bestTime = t;
    }
    if ((leftError <= 0 && rightError >= 0) || (leftError >= 0 && rightError <= 0)) {
      let a = left;
      let b = t;
      let fa = leftError;
      for (let i = 0; i < 40; i += 1) {
        const mid = Math.floor((a + b) / 2);
        const fm = signedTargetError(new Date(mid), target);
        iterations += 1;
        if (Math.abs(fm) < 1e-6) {
          a = b = mid;
          break;
        }
        if ((fa <= 0 && fm >= 0) || (fa >= 0 && fm <= 0)) b = mid;
        else { a = mid; fa = fm; }
      }
      bestTime = Math.floor((a + b) / 2);
      break;
    }
    left = t;
    leftError = rightError;
  }

  const date = new Date(bestTime);
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
