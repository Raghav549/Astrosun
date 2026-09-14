import type { ProviderAccuracy, SolarSystemStateProvider } from './provider-contracts';
import { assertProviderAccuracy } from './provider-contracts';

export interface ProviderSelection {
  provider: SolarSystemStateProvider;
  requestedAccuracy: ProviderAccuracy;
}

/** Runtime registry that makes provider choice explicit and deterministic. */
export class ProviderRegistry {
  private readonly providers = new Map<string, SolarSystemStateProvider>();

  register(provider: SolarSystemStateProvider): void {
    if (this.providers.has(provider.id)) throw new Error(`Provider ${provider.id} is already registered.`);
    this.providers.set(provider.id, provider);
  }

  get(id: string, requestedAccuracy: ProviderAccuracy = 'approximate'): SolarSystemStateProvider {
    const provider = this.providers.get(id);
    if (!provider) throw new Error(`Unknown scientific provider: ${id}`);
    assertProviderAccuracy(provider.accuracy, requestedAccuracy);
    return provider;
  }

  list(): readonly string[] {
    return [...this.providers.keys()].sort();
  }
}
