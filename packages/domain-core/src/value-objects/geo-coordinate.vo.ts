import { Result, ok, fail } from '../common/result.js';

export class GeoCoordinate {
  private readonly _lat: number;
  private readonly _lng: number;
  private readonly _zoneCode: string;

  private constructor(lat: number, lng: number, zoneCode: string) {
    this._lat = lat;
    this._lng = lng;
    this._zoneCode = zoneCode.toUpperCase();
    Object.freeze(this);
  }

  get latitude(): number {
    return this._lat;
  }

  get longitude(): number {
    return this._lng;
  }

  get zoneCode(): string {
    return this._zoneCode;
  }

  static create(lat: number, lng: number, zoneCode: string): Result<GeoCoordinate, string> {
    if (isNaN(lat) || lat < -90 || lat > 90) {
      return fail('Latitude must be between -90 and 90 degrees');
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return fail('Longitude must be between -180 and 180 degrees');
    }
    if (!zoneCode || zoneCode.trim().length === 0) {
      return fail('Zone code cannot be empty');
    }
    return ok(new GeoCoordinate(lat, lng, zoneCode));
  }

  /**
   * Distancia Haversine en kilómetros entre dos coordenadas
   */
  distanceToInKm(other: GeoCoordinate): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(other.latitude - this._lat);
    const dLng = this.deg2rad(other.longitude - this._lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(this._lat)) *
        Math.cos(this.deg2rad(other.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
