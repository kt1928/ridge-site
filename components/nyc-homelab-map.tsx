'use client';

import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Device } from '@/types/device';
import { DevicePopup } from './device-popup';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icon with Nord color
const createCustomIcon = (status: string) => {
  const color = status === 'online' ? '#A3BE8C' : status === 'offline' ? '#BF616A' : '#EBCB8B';

  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 3px solid #2E3440;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [25, 25],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

interface NYCHomelabMapProps {
  devices: Device[];
}

// Component to handle map keyboard navigation
function MapKeyboardHandler() {
  const map = useMap();

  useEffect(() => {
    // Enable keyboard navigation
    map.keyboard.enable();

    return () => {
      map.keyboard.disable();
    };
  }, [map]);

  return null;
}

export function NYCHomelabMap({ devices }: NYCHomelabMapProps) {
  const [mounted, setMounted] = useState(false);

  // Only render on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const center = useMemo<[number, number]>(() => [40.7128, -74.0060], []); // NYC center
  const zoom = 11;

  if (!mounted) {
    return (
      <div className="map-container flex items-center justify-center">
        <div className="text-nord-6">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <MapKeyboardHandler />

        {/* Dark tile layer that matches Nord theme */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />

        {/* Marker clustering */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {devices.map((device) => (
            <Marker
              key={device.id}
              position={[device.lat, device.lng]}
              icon={createCustomIcon(device.status)}
              keyboard={true}
              title={device.name}
            >
              <Popup
                minWidth={220}
                maxWidth={300}
                className="nord-themed-popup"
              >
                <DevicePopup device={device} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
