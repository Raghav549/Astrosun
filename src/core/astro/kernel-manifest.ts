/** Declarative manifest for externally installed DE/SPICE/CALCEPH kernels. */
export type KernelFormat = 'SPICE-BSP' | 'CALCEPH-DAT' | 'CALCEPH-TCHEB';
export type KernelFrame = 'ICRF' | 'BCRS' | 'GCRS' | 'BODY-FIXED';

export interface EphemerisKernelManifest {
  id: string;
  format: KernelFormat;
  version: string;
  fileName: string;
  sha256: string;
  startJd: number;
  endJd: number;
  timeScale: 'TDB' | 'TCB' | 'TT';
  nativeFrame: KernelFrame;
  source: string;
  license: string;
  notes: readonly string[];
}

/** Runtime contract: callers must provide the kernel bytes/path externally. */
export interface EphemerisKernelSource {
  manifest: EphemerisKernelManifest;
  uri: string;
}

export function assertKernelCoverage(kernel: EphemerisKernelManifest, epochJd: number): void {
  if (epochJd < kernel.startJd || epochJd > kernel.endJd) {
    throw new RangeError(`Ephemeris kernel ${kernel.id}@${kernel.version} does not cover JD ${epochJd}.`);
  }
}

export function assertKernelIntegrity(manifest: EphemerisKernelManifest, actualSha256: string): void {
  if (manifest.sha256.toLowerCase() !== actualSha256.toLowerCase()) {
    throw new Error(`Ephemeris kernel integrity mismatch for ${manifest.fileName}.`);
  }
}
