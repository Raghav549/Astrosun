/** Local kernel-backed runtime boundary for DE/SPICE/CALCEPH integrations. */
import type { CoordinateFrame, ProviderState, SolarSystemStateProvider, TimeScale } from './provider-contracts';
import { assertFiniteState, assertProviderAccuracy } from './provider-contracts';
import { assertKernelCoverage, type EphemerisKernelManifest } from './kernel-manifest';

export interface KernelQuery {
  body: string;
  epochJd: number;
  scale: TimeScale;
  frame: CoordinateFrame;
}

export interface KernelEngine {
  readonly format: 'SPICE-BSP' | 'CALCEPH-DAT' | 'CALCEPH-TCHEB';
  state(query: KernelQuery, manifest: EphemerisKernelManifest): ProviderState;
}

export class KernelBackedStateProvider implements SolarSystemStateProvider {
  readonly accuracy = 'high-precision' as const;

  constructor(
    public readonly id: string,
    public readonly version: string,
    private readonly manifest: EphemerisKernelManifest,
    private readonly engine: KernelEngine,
  ) {}

  state(body: string, jd: number, scale: TimeScale, frame: CoordinateFrame): ProviderState {
    assertKernelCoverage(this.manifest, jd);
    const result = this.engine.state({ body, epochJd: jd, scale, frame }, this.manifest);
    assertFiniteState(result);
    assertProviderAccuracy(result.accuracy, 'high-precision');
    if (result.epochJd !== jd) throw new Error(`Kernel provider returned epoch ${result.epochJd}; requested ${jd}.`);
    return result;
  }
}
