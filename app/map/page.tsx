'use client';

import dynamic from 'next/dynamic';

// Dynamically import the map component with no SSR
const MapClient = dynamic(
  () => import('@/components/map-client').then(mod => ({ default: mod.MapClient })),
  { ssr: false, loading: () => <div className="w-full h-screen flex items-center justify-center bg-nord-0 text-nord-6">Loading map...</div> }
);

export default function MapPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-nord-0">
      <MapClient />
    </main>
  );
}
