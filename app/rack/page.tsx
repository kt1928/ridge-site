'use client';

import dynamic from 'next/dynamic';

// Dynamically import the rack scene with no SSR (Three.js doesn't work with SSR)
const RackScene = dynamic(
  () => import('@/components/rack-scene'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-nord-0 text-nord-6">
        <div className="text-center">
          <div className="text-2xl mb-2">Loading 3D Rack...</div>
          <div className="text-sm text-nord-4">Initializing Three.js</div>
        </div>
      </div>
    )
  }
);

export default function RackPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-nord-0">
      <RackScene />
    </main>
  );
}
