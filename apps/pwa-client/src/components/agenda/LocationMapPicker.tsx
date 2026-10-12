'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  Edit3,
} from 'lucide-react';
import type { MapTileLayer } from './InteractiveMapCanvas';

// Carga dinámica de Leaflet para garantizar compatibilidad total con SSR en Next.js
const InteractiveMapCanvas = dynamic(
  () => import('./InteractiveMapCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[280px] sm:h-[320px] rounded-xl bg-dark-surface/60 border border-dark-border flex flex-col items-center justify-center gap-3 animate-pulse">
        <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
        <span className="text-xs text-gray-400">Cargando mapa interactivo...</span>
      </div>
    ),
  }
);

interface LocationMapPickerProps {
  currentAddress: string;
  selectedZoneCode?: string;
  onChangeAddress: (fullAddress: string) => void;
}

// Coordenadas base por zona de cobertura en República Dominicana
const ZONE_DEFAULT_COORDS: Record<string, { lat: number; lng: number; name: string }> = {
  'ZONE-DN': { lat: 18.4724, lng: -69.9366, name: 'Distrito Nacional' },
  'ZONE-SDE': { lat: 18.4884, lng: -69.8571, name: 'Santo Domingo Este' },
  'ZONE-SPM': { lat: 18.4539, lng: -69.3086, name: 'San Pedro de Macorís' },
  'ZONE-LR': { lat: 18.4273, lng: -68.9728, name: 'La Romana' },
};

// Accesos directos a sectores populares
const POPULAR_SECTORS = [
  { name: 'Piantini', lat: 18.4724, lng: -69.9366 },
  { name: 'Naco', lat: 18.4777, lng: -69.9275 },
  { name: 'Bella Vista', lat: 18.4542, lng: -69.9482 },
  { name: 'Alma Rosa', lat: 18.4884, lng: -69.8571 },
  { name: 'San Pedro Centro', lat: 18.4539, lng: -69.3086 },
  { name: 'La Romana Centro', lat: 18.4273, lng: -68.9728 },
];

export function LocationMapPicker({
  currentAddress,
  selectedZoneCode = 'ZONE-DN',
  onChangeAddress,
}: LocationMapPickerProps) {
  const initialZone = ZONE_DEFAULT_COORDS[selectedZoneCode] || ZONE_DEFAULT_COORDS['ZONE-DN']!;

  const apartmentInputRef = useRef<HTMLInputElement>(null);

  const [latitude, setLatitude] = useState<number>(initialZone.lat);
  const [longitude, setLongitude] = useState<number>(initialZone.lng);
  const [streetAddress, setStreetAddress] = useState<string>(currentAddress || '');
  const [apartmentDetails, setApartmentDetails] = useState<string>('');
  const [tileLayerType, setTileLayerType] = useState<MapTileLayer>('google-roadmap');
  const [isGeolocating, setIsGeolocating] = useState<boolean>(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState<boolean>(false);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [hasDetectedGps, setHasDetectedGps] = useState<boolean>(false);
  const [isEditingStreet, setIsEditingStreet] = useState<boolean>(false);

  // Transición suave y enfoque guiado hacia el campo de Apartamento/Residencia
  const guideToApartmentInput = useCallback(() => {
    setTimeout(() => {
      if (apartmentInputRef.current) {
        apartmentInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        apartmentInputRef.current.focus();
      }
    }, 350);
  }, []);

  // Actualizar coordenadas si cambia la zona en el paso previo (solo si el usuario no ha detectado GPS)
  useEffect(() => {
    if (!hasDetectedGps && ZONE_DEFAULT_COORDS[selectedZoneCode]) {
      const zoneCoords = ZONE_DEFAULT_COORDS[selectedZoneCode]!;
      setLatitude(zoneCoords.lat);
      setLongitude(zoneCoords.lng);
    }
  }, [selectedZoneCode, hasDetectedGps]);

  // Actualizar dirección consolidada al padre
  const syncAddressToParent = useCallback(
    (street: string, details: string, lat: number, lng: number) => {
      const parts: string[] = [];
      if (street.trim()) parts.push(street.trim());
      if (details.trim()) parts.push(`(${details.trim()})`);
      parts.push(`[GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}]`);
      onChangeAddress(parts.join(' '));
    },
    [onChangeAddress]
  );

  // Geocodificación inversa (convierte lat, lng en nombre de calle y sector)
  const fetchReverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setIsReverseGeocoding(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'es',
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.address) {
            const a = data.address;
            const road = a.road || a.pedestrian || a.suburb || a.hamlet || '';
            const neighbourhood = a.neighbourhood || a.suburb || a.city_district || '';
            const city = a.city || a.town || a.county || '';

            const components = [road, neighbourhood, city].filter(Boolean);
            const resolvedAddress =
              components.length > 0
                ? components.join(', ')
                : (data.display_name as string).split(',').slice(0, 3).join(', ');

            setStreetAddress(resolvedAddress);
            syncAddressToParent(resolvedAddress, apartmentDetails, lat, lng);
            setGeoStatus(`Ubicación identificada: ${resolvedAddress}`);
            return;
          }
        }
      } catch {
        // Fallback silencioso ante falla de red
      } finally {
        setIsReverseGeocoding(false);
      }

      // Si falla Nominatim, se guarda la coordenada legible
      const fallback = `Ubicación marcada (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      setStreetAddress((prev) => (prev ? prev : fallback));
      syncAddressToParent(streetAddress || fallback, apartmentDetails, lat, lng);
    },
    [apartmentDetails, streetAddress, syncAddressToParent]
  );

  // Manejar cambio de pin desde el mapa interactivo
  const handleCoordsChange = (newLat: number, newLng: number) => {
    setLatitude(newLat);
    setLongitude(newLng);
    setGeoStatus(`Pin ajustado en: ${newLat.toFixed(5)}, ${newLng.toFixed(5)}`);
    fetchReverseGeocode(newLat, newLng);
    guideToApartmentInput();
  };

  // Detección de ubicación GPS en 1 toque
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización GPS.');
      return;
    }

    setIsGeolocating(true);
    setGeoStatus('Conectando con señal GPS...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        setLatitude(lat);
        setLongitude(lng);
        setHasDetectedGps(true);
        setIsGeolocating(false);
        setGeoStatus(`GPS detectado con precisión de ±${accuracy}m`);

        fetchReverseGeocode(lat, lng);
        guideToApartmentInput();
      },
      (error) => {
        setIsGeolocating(false);
        let errorMsg = 'No pudimos acceder a tu ubicación GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Permiso GPS denegado. Puedes tocar en el mapa para marcar tu casa.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Señal GPS no disponible en este momento.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Tiempo de espera de GPS agotado.';
        }
        setGeoStatus(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  // Actualizar campo de calle manual
  const handleStreetChange = (val: string) => {
    setStreetAddress(val);
    syncAddressToParent(val, apartmentDetails, latitude, longitude);
  };

  // Actualizar campo de apartamento/referencia
  const handleApartmentChange = (val: string) => {
    setApartmentDetails(val);
    syncAddressToParent(streetAddress, val, latitude, longitude);
  };

  // Salto rápido a un sector
  const handleJumpToSector = (sector: (typeof POPULAR_SECTORS)[0]) => {
    setLatitude(sector.lat);
    setLongitude(sector.lng);
    handleCoordsChange(sector.lat, sector.lng);
    guideToApartmentInput();
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div className="space-y-4">
      {/* Barra de acción principal: GPS y enlaces */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isGeolocating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isGeolocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span>{isGeolocating ? 'Obteniendo GPS...' : '📍 Usar Mi Ubicación Actual'}</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark-surface/80 hover:bg-dark-surface text-gray-300 hover:text-white border border-dark-border text-xs transition-colors"
          >
            <span>Ver en Google Maps</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>
        </div>

        {/* Selector de capa de mapa */}
        <div className="inline-flex items-center gap-1 bg-dark-surface/80 p-1 rounded-lg border border-dark-border text-[11px]">
          <Layers className="w-3 h-3 text-gray-400 ml-1.5" />
          <button
            type="button"
            onClick={() => setTileLayerType('google-roadmap')}
            className={`px-2 py-0.5 rounded transition-colors ${
              tileLayerType === 'google-roadmap'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Google Calles
          </button>
          <button
            type="button"
            onClick={() => setTileLayerType('google-satellite')}
            className={`px-2 py-0.5 rounded transition-colors ${
              tileLayerType === 'google-satellite'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Satélite
          </button>
          <button
            type="button"
            onClick={() => setTileLayerType('dark')}
            className={`px-2 py-0.5 rounded transition-colors ${
              tileLayerType === 'dark'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Oscuro
          </button>
        </div>
      </div>

      {/* Estado informativo de geolocalización */}
      {geoStatus && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-surface/70 border border-dark-border text-[11px] text-gray-300 animate-fadeIn">
          {geoStatus.includes('denegado') || geoStatus.includes('No') ? (
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <span className="truncate">{geoStatus}</span>
        </div>
      )}

      {/* Mapa interactivo con pin arrastrable y click */}
      <div>
        <div className="flex items-center justify-between mb-1.5 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>Toca en el mapa o arrastra el pin para fijar tu edificio o residencia:</span>
          </span>
          {isReverseGeocoding && (
            <span className="flex items-center gap-1 text-cyan-400 font-semibold animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Resolviendo dirección...</span>
            </span>
          )}
        </div>

        <InteractiveMapCanvas
          latitude={latitude}
          longitude={longitude}
          onChangeCoords={handleCoordsChange}
          tileLayerType={tileLayerType}
        />
      </div>

      {/* Accesos rápidos a sectores */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] uppercase font-bold text-gray-500">Saltar a:</span>
        {POPULAR_SECTORS.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() => handleJumpToSector(s)}
            className="px-2 py-0.5 rounded-md bg-dark-surface hover:bg-cyan-500/10 border border-dark-border text-[11px] text-gray-400 hover:text-cyan-300 transition-colors"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Flujo Guiado: Confirmación de Punto y Especificación de Residencia */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-dark-surface/95 to-cyan-950/20 border border-emerald-500/40 space-y-3.5 shadow-xl transition-all">
        {/* Cabecera del paso guiado */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-dark-border/60">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/40">
              ✓
            </span>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
              Punto Seleccionado en el Mapa
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
            📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </span>
        </div>

        {/* Calle/Sector detectado con opción de edición */}
        <div className="bg-dark-surface/90 p-3 rounded-xl border border-dark-border flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Calle y Sector:
            </span>
            {!isEditingStreet ? (
              <p className="text-xs font-medium text-white truncate mt-0.5">
                {streetAddress || 'Ubicación seleccionada en el mapa'}
              </p>
            ) : (
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => handleStreetChange(e.target.value)}
                placeholder="ej: Calle Andrés Julio Aybar #42, Piantini"
                className="w-full mt-1 px-3 py-1.5 rounded-lg glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsEditingStreet(!isEditingStreet)}
            className="shrink-0 p-1.5 rounded-lg bg-dark-border/40 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-300 text-xs transition-colors cursor-pointer"
            title="Editar nombre de calle"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Siguiente paso guiado: Campo de Apartamento / Torre / Referencia con Auto-focus */}
        <div className="pt-1 space-y-1.5">
          <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>👉 Siguiente paso: Especifica tu Torre, Edificio, Apto o Referencia:</span>
          </label>
          <input
            ref={apartmentInputRef}
            type="text"
            placeholder="ej: Torre Bella Vista Center, Piso 5, Apto 5B"
            value={apartmentDetails}
            onChange={(e) => handleApartmentChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50 shadow-inner"
          />
          <p className="text-[11px] text-gray-400">
            Esta información detallada la recibe el equipo técnico para llegar directo a tu puerta.
          </p>
        </div>
      </div>
    </div>
  );
}
