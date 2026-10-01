export enum FabricType {
  Synthetic = 'SYNTHETIC',
  Microfiber = 'MICROFIBER',
  Linen = 'LINEN',
  Velvet = 'VELVET',
  Leather = 'LEATHER',
  Silk = 'SILK',
}

export const FABRIC_MULTIPLIERS: Record<FabricType, number> = {
  [FabricType.Synthetic]: 1.0,
  [FabricType.Microfiber]: 1.1,
  [FabricType.Linen]: 1.25,
  [FabricType.Velvet]: 1.4,
  [FabricType.Leather]: 1.5,
  [FabricType.Silk]: 1.8,
};
