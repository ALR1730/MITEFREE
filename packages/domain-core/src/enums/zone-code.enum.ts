export enum ZoneCode {
  DistritoNacional = 'ZONE-DN',
  SantoDomingoEste = 'ZONE-SDE',
  SantoDomingoOeste = 'ZONE-SDO',
  SantoDomingoNorte = 'ZONE-SDN',
  Central = 'ZONE-C',
}

export const ZONE_NAMES: Record<ZoneCode, string> = {
  [ZoneCode.DistritoNacional]: 'Distrito Nacional (Piantini, Naco, Bella Vista, Gazcue)',
  [ZoneCode.SantoDomingoEste]: 'Santo Domingo Este (Alma Rosa, Ozama, San Isidro)',
  [ZoneCode.SantoDomingoOeste]: 'Santo Domingo Oeste (Herrera, Alameda, Los Ríos)',
  [ZoneCode.SantoDomingoNorte]: 'Santo Domingo Norte (Villa Mella, Mirador Norte)',
  [ZoneCode.Central]: 'Cuadrante Central Metropolitano',
};
