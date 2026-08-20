import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Stage, OrbitControls, useGLTF } from '@react-three/drei';
import { X, RotateCcw, Box } from 'lucide-react';
import type { Pokemon } from '../../types/pokemon';
import { capitalize } from '../../utils/formatters';

interface ModelProps {
  name: string;
  onError: () => void;
}

// GLTF model loader component
const PokemonGLTFModel: React.FC<ModelProps> = ({ name, onError }) => {
  const modelPath = `/models/${name.toLowerCase()}.glb`;
  try {
    const { scene } = useGLTF(modelPath);
    return <primitive object={scene.clone()} scale={1.5} />;
  } catch (e) {
    onError();
    return null;
  }
};

// Fallback 3D Pokéball Mesh representation when GLTF model file is unavailable
const Fallback3DPokeball: React.FC = () => {
  return (
    <group scale={1.3}>
      {/* Top Red Hemisphere */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Bottom White Hemisphere */}
      <mesh position={[0, -0.1, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Center Black Belt Ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.22, 1.22, 0.2, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>

      {/* Center Button Outer Ring */}
      <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>

      {/* Center Button Inner Glowing Light */}
      <mesh position={[0, 0, 1.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.08, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1} />
      </mesh>
    </group>
  );
};

interface Pokemon3DViewerProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
}

export const Pokemon3DViewer: React.FC<Pokemon3DViewerProps> = ({ pokemon, isOpen, onClose }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [pokemon]);

  if (!isOpen || !pokemon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* 3D Viewer Modal Box */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                3D Pokémon View: {capitalize(pokemon.name)}
              </h3>
              <p className="text-xs text-slate-400">
                Click & drag to rotate • Scroll to zoom
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close 3D Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas Area */}
        <div className="relative flex-1 w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <Canvas
            shadows
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />

            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6} adjustCamera={false}>
                <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
                  {!hasError ? (
                    <PokemonGLTFModel name={pokemon.name} onError={() => setHasError(true)} />
                  ) : (
                    <Fallback3DPokeball />
                  )}
                </Float>
              </Stage>
            </Suspense>

            <OrbitControls enableZoom autoRotate autoRotateSpeed={2.5} />
          </Canvas>

          {/* Controls Footer Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-400 bg-slate-900/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-800 pointer-events-none z-10">
            <span className="flex items-center gap-2 font-medium text-cyan-300">
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              OrbitControls Active
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {pokemon.name.toUpperCase()} (3D MESH)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
