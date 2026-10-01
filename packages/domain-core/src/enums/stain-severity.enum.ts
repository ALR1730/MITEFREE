export enum StainSeverity {
  Light = 'LIGHT',
  Moderate = 'MODERATE',
  Critical = 'CRITICAL',
}

export const STAIN_SURCHARGES: Record<StainSeverity, number> = {
  [StainSeverity.Light]: 0.0,
  [StainSeverity.Moderate]: 15.0,
  [StainSeverity.Critical]: 35.0,
};
