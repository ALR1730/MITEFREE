/**
 * Helper canónico para mapear IDs de técnicos a cuadrillas operativas — ALR COMPANY
 */
export function resolveTechnicianName(technicianId?: string | null): string | null {
  if (!technicianId) return null;

  const id = technicianId.toLowerCase();

  if (id.includes('11111111')) {
    return 'Ing. Kelvin Rosario (Cuadrilla #01 - San Pedro)';
  }
  if (id.includes('44444444')) {
    return 'Marcos Santana (Cuadrilla #02 - Santo Domingo Este)';
  }
  if (id.includes('33333333')) {
    return 'Darío Tavárez (Cuadrilla #03 - La Romana)';
  }
  if (id.includes('22222222')) {
    return 'Junior Polanco (Cuadrilla #04 - SPM / Consuelo)';
  }

  return 'Cuadrilla Especializada MITEFREE';
}
