export interface AstroSunUserProfile {
  id: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  unitSystem: 'metric' | 'imperial';
  location: { name: string; latitudeDeg: number; longitudeDeg: number; timeZone: string };
  updatedAt: string;
}

const PROFILE_KEY = 'astrosun-profile-v1';

const DEFAULT_PROFILE: AstroSunUserProfile = {
  id: 'local-user',
  language: 'en',
  theme: 'system',
  unitSystem: 'metric',
  location: { name: 'Patna', latitudeDeg: 25.5941, longitudeDeg: 85.1376, timeZone: 'Asia/Kolkata' },
  updatedAt: new Date().toISOString(),
};

export function loadProfile(): AstroSunUserProfile {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PROFILE_KEY) : null;
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<AstroSunUserProfile>;
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      location: { ...DEFAULT_PROFILE.location, ...(parsed.location ?? {}) },
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: AstroSunUserProfile): AstroSunUserProfile {
  const next = { ...profile, updatedAt: new Date().toISOString() };
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(PROFILE_KEY, JSON.stringify(next)); } catch { /* persistence is best-effort */ }
  return next;
}

export function clearProfile(): void {
  try { if (typeof localStorage !== 'undefined') localStorage.removeItem(PROFILE_KEY); } catch { /* noop */ }
}
