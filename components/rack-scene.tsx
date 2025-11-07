'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { RackFrame } from './rack-frame';
import { RackEquipment } from './rack-equipment';
import { RackDevicePanel } from './rack-device-panel';
import useSWR from 'swr';
import type { Device } from '@/types/device';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Nord color palette for reference
const NORD_COLORS = {
  polarNight: {
    nord0: "#2E3440",
    nord1: "#3B4252",
    nord2: "#434C5E",
    nord3: "#4C566A",
  },
  snowStorm: {
    nord4: "#D8DEE9",
    nord5: "#E5E9F0",
    nord6: "#ECEFF4",
  },
  frost: {
    nord7: "#8FBCBB",
    nord8: "#88C0D0",
    nord9: "#81A1C1",
    nord10: "#5E81AC",
  },
  aurora: {
    nord11: "#BF616A",
    nord12: "#D08770",
    nord13: "#EBCB8B",
    nord14: "#A3BE8C",
    nord15: "#B48EAD",
  },
};

export default function RackScene() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const { data: devices } = useSWR<Device[]>('/api/devices', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="relative w-full h-full">
      {/* Top navigation bar */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-6"
        style={{
          background: `linear-gradient(to bottom, ${NORD_COLORS.polarNight.nord1}CC, ${NORD_COLORS.polarNight.nord0}00)`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div>
          <h1 className="text-3xl font-bold" style={{ color: NORD_COLORS.snowStorm.nord6 }}>
            Homelab Rack
          </h1>
          <p className="text-sm mt-1" style={{ color: NORD_COLORS.snowStorm.nord4 }}>
            3D visualization of physical infrastructure
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="/map"
            className="px-4 py-2 rounded-md transition-all duration-300 hover:scale-105"
            style={{
              background: NORD_COLORS.polarNight.nord2,
              color: NORD_COLORS.snowStorm.nord6,
              border: `1px solid ${NORD_COLORS.polarNight.nord3}`,
            }}
          >
            View Map
          </a>
          <a
            href="/project1"
            className="px-4 py-2 rounded-md transition-all duration-300 hover:scale-105"
            style={{
              background: NORD_COLORS.frost.nord8,
              color: NORD_COLORS.polarNight.nord0,
              boxShadow: `0 4px 20px ${NORD_COLORS.frost.nord8}66`,
            }}
          >
            Back to Portfolio
          </a>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-8 left-8 z-10">
        <div className="p-4 rounded-lg" style={{ background: NORD_COLORS.polarNight.nord1 + 'DD' }}>
          <div className="text-sm mb-2 font-semibold" style={{ color: NORD_COLORS.snowStorm.nord6 }}>
            Controls:
          </div>
          <div className="text-xs space-y-1" style={{ color: NORD_COLORS.snowStorm.nord4 }}>
            <div>🖱️ Left Click + Drag: Rotate</div>
            <div>🖱️ Right Click + Drag: Pan</div>
            <div>🖱️ Scroll: Zoom</div>
            <div>🖱️ Click Device: View Details</div>
          </div>
        </div>
      </div>

      {/* Device info panel */}
      {selectedDevice && (
        <RackDevicePanel
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      {/* 3D Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={50} />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
            maxPolarAngle={Math.PI / 1.5}
          />

          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-3, 3, -3]} intensity={0.4} color={NORD_COLORS.frost.nord8} />

          {/* Environment for reflections */}
          <Environment preset="city" />

          {/* Ground plane */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color={NORD_COLORS.polarNight.nord0} roughness={0.8} />
          </mesh>

          {/* Rack Frame - Parametric, configurable */}
          <RackFrame
            rackUnits={42}
            width={19}
            depth={30}
          />

          {/* Equipment - Will be populated from your data */}
          <RackEquipment
            devices={devices || []}
            onDeviceClick={setSelectedDevice}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
