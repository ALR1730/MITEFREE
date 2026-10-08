export enum ZoneCode {
  SantoDomingoEste = 'ZONE-SDE',
  SanPedroDeMacoris = 'ZONE-SPM',
  LaRomana = 'ZONE-LR',
  DistritoNacional = 'ZONE-DN',
  Central = 'ZONE-C',
}

export const ZONE_NAMES: Record<ZoneCode, string> = {
  [ZoneCode.SantoDomingoEste]:
    'Santo Domingo Este (Alma Rosa, Ozama, San Isidro, Los Frailes, Las Américas)',
  [ZoneCode.SanPedroDeMacoris]:
    'San Pedro de Macorís y todos sus municipios (Consuelo, Quisqueya, Guayacanes, Ramón Santana)',
  [ZoneCode.LaRomana]:
    'La Romana y todos sus municipios (Villa Hermosa, Guaymate, Cumayasa, Caleta)',
  [ZoneCode.DistritoNacional]: 'Distrito Nacional (Zona Metropolitana Extendida)',
  [ZoneCode.Central]: 'Región Este / Metropolitano',
};
