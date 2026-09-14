const UA = 'AstroSun/1.0 research-client';

export async function searchArxiv(query, { maxResults = 10 } = {}) {
  const url = new URL('https://export.arxiv.org/api/query');
  url.searchParams.set('search_query', `all:${query}`);
  url.searchParams.set('start', '0');
  url.searchParams.set('max_results', String(maxResults));
  const response = await fetch(url, { headers: { 'user-agent': UA } });
  if (!response.ok) throw new Error(`arXiv HTTP ${response.status}`);
  const xml = await response.text();
  return parseEntries(xml);
}

function parseEntries(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => {
    const body = match[1];
    const pick = (tag) => body.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1]?.trim() ?? '';
    const id = pick('id');
    return {
      id,
      title: pick('title').replace(/\s+/g, ' '),
      summary: pick('summary').replace(/\s+/g, ' '),
      published: pick('published'),
      updated: pick('updated'),
      authors: [...body.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g)].map((m) => m[1].trim()),
      source: 'arXiv',
      evidenceKind: 'literature'
    };
  });
}

export function evidenceEnvelope({ claim, source, confidence = 'unrated', calculation = null }) {
  return {
    claim,
    source,
    confidence,
    calculation,
    labels: {
      measured: false,
      calculated: Boolean(calculation),
      inferred: false,
      traditional: false
    }
  };
}
