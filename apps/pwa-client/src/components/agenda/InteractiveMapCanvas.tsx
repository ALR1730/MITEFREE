'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type MapTileLayer = 'google-roadmap' | 'google-satellite' | 'dark';

interface InteractiveMapCanvasProps {
  latitude: number;
  longitude: number;
  onChangeCoords: (lat: number, lng: number) => void;
  tileLayerType: MapTileLayer;
}

const TILE_URLS: Record<MapTileLayer, { url: string; attribution: string; subdomains?: string[] }> = {
  'google-roadmap': {
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  'google-satellite': {
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Satélite',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: ['a', 'b', 'c', 'd'],
  },
};

function createNeonPinIcon() {
  return L.divIcon({
    className: 'mitefree-map-pin',
    html: `
      <div style="position: relative; width: 36px; height: 36px; transform: translate(-50%, -100%);">
        <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(0, 196, 255, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 36px; height: 36px; background: linear-gradient(135deg, #00c4ff 0%, #0077d8 100%); border: 2.5px solid #ffffff; border-radius: 9999px 9999px 9999px 0; transform: rotate(-45deg); box-shadow: 0 4px 14px rgba(0, 196, 255, 0.6); display: flex; align-items: center; justify-content: center;">
          <div style="width: 12px; height: 12px; background: #ffffff; border-radius: 9999px; transform: rotate(45deg);"></div>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
}

export default function InteractiveMapCanvas({
  latitude,
  longitude,
  onChangeCoords,
  tileLayerType,
}: InteractiveMapCanvasProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false, // Prevenir scroll accidental en móvil
      });

      const config = TILE_URLS[tileLayerType];
      const tileLayer = L.tileLayer(config.url, {
        attribution: config.attribution,
        subdomains: config.subdomains || ['a', 'b', 'c'],
        maxZoom: 20,
      }).addTo(map);

      currentTileLayerRef.current = tileLayer;

      const marker = L.marker([latitude, longitude], {
        icon: createNeonPinIcon(),
        draggable: true,
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChangeCoords(pos.lat, pos.lng);
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        onChangeCoords(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Invalida tamaño para asegurar render correcto al montar
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        currentTileLayerRef.current = null;
      }
    };
  }, []);

  // Actualizar capa de tiles si cambia el tipo
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const config = TILE_URLS[tileLayerType];
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      subdomains: config.subdomains || ['a', 'b', 'c'],
      maxZoom: 20,
    }).addTo(map);

    currentTileLayerRef.current = newLayer;
  }, [tileLayerType]);

  // Actualizar posición del marcador y vista del mapa cuando cambien las coordenadas externamente
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    const currentPos = markerRef.current.getLatLng();
    const isDifferent =
      Math.abs(currentPos.lat - latitude) > 0.0001 ||
      Math.abs(currentPos.lng - longitude) > 0.0001;

    if (isDifferent) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.flyTo([latitude, longitude], 16, {
        duration: 1.2,
      });
    }
  }, [latitude, longitude]);

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden border border-cyan-500/30 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute bottom-2 left-2 z-[400] pointer-events-none">
        <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[10px] text-gray-300 border border-white/10 font-mono">
          📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </span>
      </div>
    </div>
  );
}
