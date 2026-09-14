const PROVIDERS = [
  {
    name: 'NVIDIA NIM',
    base: process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1',
    key: process.env.NVIDIA_NIM_API_KEY,
    priority: 1,
  },
  {
    name: 'AIHubMix',
    base: process.env.AIHUBMIX_BASE_URL || 'https://aihubmix.com/v1',
    key: process.env.AIHUBMIX_API_KEY,
    priority: 2,
  },
];

const health = new Map();

export function availableProviders() {
  return PROVIDERS.map(({ name, key, priority }) => ({
    name,
    priority,
    configured: Boolean(key),
    consecutiveFailures: health.get(name)?.failures || 0,
    cooldownUntil: health.get(name)?.cooldownUntil || 0,
  }));
}

function markSuccess(name) {
  health.set(name, { failures: 0, cooldownUntil: 0 });
}

function markFailure(name) {
  const current = health.get(name) || { failures: 0, cooldownUntil: 0 };
  const failures = current.failures + 1;
  const cooldownMs = Math.min(60000, 1000 * 2 ** Math.min(failures - 1, 6));
  health.set(name, { failures, cooldownUntil: Date.now() + cooldownMs });
}

async function request(provider, body, signal) {
  if (!provider.key) throw new Error(`${provider.name} is not configured`);
  const response = await fetch(`${provider.base}/chat/completions`, {
    method: 'POST',
    signal,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${provider.key}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`${provider.name} HTTP ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

export async function chat(body, { timeoutMs = 45000 } = {}) {
  const ordered = [...PROVIDERS]
    .filter((p) => p.key)
    .sort((a, b) => a.priority - b.priority);

  let lastError = new Error('No AI provider is configured');
  for (const provider of ordered) {
    const state = health.get(provider.name);
    if (state?.cooldownUntil && state.cooldownUntil > Date.now()) continue;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const result = await request(provider, body, controller.signal);
      markSuccess(provider.name);
      return { ok: true, provider: provider.name, result };
    } catch (error) {
      markFailure(provider.name);
      lastError = error;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}
