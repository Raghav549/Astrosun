export type EvidenceSourceKind = 'paper' | 'standard' | 'dataset' | 'software' | 'observation';

export interface EvidenceSource {
  id: string;
  kind: EvidenceSourceKind;
  title: string;
  locator: string;
  version?: string;
  publishedAt?: string;
}

export interface EvidenceLink {
  claimId: string;
  sources: EvidenceSource[];
  notes?: string[];
}

/** Lightweight evidence graph contract for scientific answers and UI citations. */
export function evidenceLink(
  claimId: string,
  sources: EvidenceSource[],
  notes: string[] = [],
): EvidenceLink {
  if (!claimId.trim()) throw new Error('claimId is required');
  if (!sources.length) throw new Error('at least one evidence source is required');
  return { claimId, sources, notes };
}
