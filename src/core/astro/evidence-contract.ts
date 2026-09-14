import type { AccuracyClass, EvidenceTier, Provenance } from './quality';

export interface EvidenceReference {
  id: string;
  title: string;
  sourceUrl?: string;
  publisher?: string;
  publishedAt?: string;
  retrievedAt: string;
  evidenceTier: EvidenceTier;
}

export interface ScientificClaim {
  id: string;
  statement: string;
  evidence: readonly EvidenceReference[];
  confidence: 'high' | 'medium' | 'low' | 'unresolved';
  accuracy: AccuracyClass;
  provenance?: Provenance;
}

/** Require evidence before a claim can be treated as supported by the engine. */
export function assertClaimEvidence(claim: ScientificClaim): void {
  if (!claim.statement.trim()) throw new Error(`Scientific claim ${claim.id} has no statement.`);
  if (!claim.evidence.length) throw new Error(`Scientific claim ${claim.id} has no evidence references.`);
  if (claim.confidence === 'high' && claim.evidence.some((item) => !item.id || !item.title)) {
    throw new Error(`High-confidence claim ${claim.id} contains incomplete evidence metadata.`);
  }
}
