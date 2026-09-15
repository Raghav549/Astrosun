import { ASTROSUN_FEATURES, type AstroSunFeatureStatus } from './feature-catalog';

export interface FeatureHealth { status: AstroSunFeatureStatus; title: string; route: string; group: string }
export interface FeatureCatalogHealth { total: number; implemented: number; ready: number; providerRequired: number; completionPercent: number }

export function getFeatureCatalogHealth(): FeatureCatalogHealth {
  const total = ASTROSUN_FEATURES.length;
  const implemented = ASTROSUN_FEATURES.filter((x) => x.status === 'implemented').length;
  const ready = ASTROSUN_FEATURES.filter((x) => x.status === 'ready').length;
  const providerRequired = ASTROSUN_FEATURES.filter((x) => x.status === 'provider-required').length;
  return { total, implemented, ready, providerRequired, completionPercent: total ? Number(((implemented / total) * 100).toFixed(1)) : 0 };
}
