/** Evidence graph primitives for traceable research reasoning. */
export type EvidenceNodeKind = 'claim' | 'paper' | 'dataset' | 'calculation' | 'tradition';
export type EvidenceRelation = 'supports' | 'contradicts' | 'derived-from' | 'references';

export interface EvidenceNode {
  id: string;
  kind: EvidenceNodeKind;
  title: string;
  source?: string;
  confidence: number;
}

export interface EvidenceEdge {
  from: string;
  to: string;
  relation: EvidenceRelation;
  rationale: string;
}

export interface EvidenceGraph {
  nodes: EvidenceNode[];
  edges: EvidenceEdge[];
}

export function addEvidenceNode(graph: EvidenceGraph, node: EvidenceNode): EvidenceGraph {
  if (graph.nodes.some((x) => x.id === node.id)) throw new Error(`Evidence node ${node.id} already exists.`);
  if (node.confidence < 0 || node.confidence > 1) throw new RangeError('confidence must be within [0,1].');
  return { nodes: [...graph.nodes, node], edges: [...graph.edges] };
}

export function addEvidenceEdge(graph: EvidenceGraph, edge: EvidenceEdge): EvidenceGraph {
  if (!graph.nodes.some((x) => x.id === edge.from) || !graph.nodes.some((x) => x.id === edge.to)) throw new Error('Evidence edge endpoints must exist.');
  return { nodes: [...graph.nodes], edges: [...graph.edges, edge] };
}

export function supportingEvidence(graph: EvidenceGraph, claimId: string): EvidenceNode[] {
  const ids = new Set(graph.edges.filter((e) => e.to === claimId && e.relation === 'supports').map((e) => e.from));
  return graph.nodes.filter((n) => ids.has(n.id));
}
