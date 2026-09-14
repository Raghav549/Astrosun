export type EvidenceTier = 'observational' | 'numerical' | 'analytical' | 'traditional';
export type AccuracyClass = 'high-precision' | 'standard' | 'approximate' | 'interpretive';

export interface Provenance {
  engine: string;
  version: string;
  generatedAt: string;
  input: Record<string, unknown>;
  evidenceTier: EvidenceTier;
  accuracy: AccuracyClass;
  limitations: string[];
  reproducible: boolean;
}

export interface ScientificResult<T> {
  value: T;
  units?: string;
  provenance: Provenance;
}

export function provenance(engine: string, version: string, input: Record<string, unknown>, evidenceTier: EvidenceTier, accuracy: AccuracyClass, limitations: string[] = []): Provenance {
  return { engine, version, generatedAt: new Date().toISOString(), input, evidenceTier, accuracy, limitations, reproducible: true };
}
