import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  ContactShadows,
  OrbitControls,
  useGLTF,
  useTexture,
  Sparkles,
} from '@react-three/drei';
import { easing } from 'maath';

export const SCENT_BLENDS = [
  {
    id: 'cambodian-oud',
    name: 'Cambodian Oud',
    liquidColor: '#8a4816',
    attenuationColor: '#3a1802',
  },
  {
    id: 'royal-amber',
    name: 'Royal Ambergris',
    liquidColor: '#dca832',
    attenuationColor: '#6c4300',
  },
  {
    id: 'taif-rose',
    name: 'Taif Rose Extrait',
    liquidColor: '#d65274',
    attenuationColor: '#5a0a1f',
  },
  {
    id: 'white-musk',
    name: 'White Musk Tahara',
    liquidColor: '#f0f4f8',
    attenuationColor: '#cbd6df',
  },
];

export function PhotorealisticBottle({ selectedBlend, isSpraying, triggerSpray }) {
  const capRef = useRef();
  const liquidRef = useRef();
  const liquidMatRef = useRef();
  const collarRef = useRef();
  const sparklesRef = useRef();

  // Load reverse-engineered Blender GLB model
  const { nodes } = useGLTF('/store_bottle.glb');

  // Load etched Darul Attar brand logo & bump textures (transparent alpha, white background removed)
  const logoTexture = useTexture('/darul_attar_logo.png');
  const logoBumpTexture = useTexture('/darul_attar_logo_bump.png');

  // Exact native dimensions: height = 100mm -> targetScale = 3.2 / 100.0 = 0.032
  const targetScale = 0.032;
  const centeringOffsetY = -50.0;

  // Memoized target colors for smooth dampC transitions
  const targetLiquidColor = useMemo(
    () => new THREE.Color(selectedBlend.liquidColor),
    [selectedBlend.liquidColor]
  );
  const targetAttenuationColor = useMemo(
    () => new THREE.Color(selectedBlend.attenuationColor),
    [selectedBlend.attenuationColor]
  );

  useFrame((_, delta) => {
    // 1. Smooth collar click dip
    const collarDip = isSpraying ? -2.0 : 0.0;
    easing.damp(collarRef.current.position, 'y', collarDip, 0.1, delta);

    // 2. Real-time liquid color morphing
    if (liquidMatRef.current) {
      easing.dampC(liquidMatRef.current.color, targetLiquidColor, 0.35, delta);
      easing.dampC(liquidMatRef.current.attenuationColor, targetAttenuationColor, 0.35, delta);
    }

    // 3. Atomizer mist burst
    if (sparklesRef.current) {
      const activeSpray = isSpraying ? 2.5 : 0.0;
      sparklesRef.current.scale.setScalar(activeSpray * 1.4);
    }
  });

  return (
    <group>
      {/* Normalized scale (3.2 units height) and centered pivot */}
      <group scale={targetScale}>
        <group position={[0, centeringOffsetY, 0]}>
          
          {/* 1. CRYSTAL FLACON (High clarity soda-lime optical glass) */}
          <mesh geometry={nodes.Bottle_Glass.geometry} castShadow receiveShadow>
            <meshPhysicalMaterial
              transmission={0.95}
              roughness={0.03}
              metalness={0.0}
              ior={1.52}
              thickness={2.5}
              specularIntensity={1.0}
              specularColor="#ffffff"
              attenuationColor="#e8f4fc"
              attenuationDistance={3.0}
              clearcoat={1.0}
              clearcoatRoughness={0.02}
              envMapIntensity={2.5}
              transparent
            />
          </mesh>

          {/* 2. INNER PERFUME OIL (Deep refractive liquid with internal luminous glow) */}
          <group position={[0, 11.89, 0]}>
            <group ref={liquidRef}>
              <mesh geometry={nodes.Bottle_Liquid.geometry} position={[0, -11.89, 0]}>
                <meshPhysicalMaterial
                  ref={liquidMatRef}
                  color={selectedBlend.liquidColor}
                  transmission={0.75}
                  roughness={0.05}
                  metalness={0.05}
                  ior={1.48}
                  thickness={2.0}
                  attenuationColor={selectedBlend.attenuationColor}
                  attenuationDistance={1.0}
                  emissive={selectedBlend.liquidColor}
                  emissiveIntensity={0.3}
                  clearcoat={1.0}
                  clearcoatRoughness={0.02}
                  envMapIntensity={2.2}
                  transparent
                />
              </mesh>
            </group>
          </group>

          {/* 3. OPTICAL FLUOROPOLYMER DIP TUBE */}
          <mesh geometry={nodes.Bottle_Tube.geometry}>
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.96}
              roughness={0.06}
              ior={1.34}
              thickness={0.15}
              transparent
            />
          </mesh>

          {/* 4. 24K POLISHED CHAMPAGNE GOLD ATOMIZER COLLAR */}
          <group ref={collarRef}>
            <mesh
              geometry={nodes.Bottle_Collar.geometry}
              castShadow
              onClick={(e) => {
                e.stopPropagation();
                triggerSpray();
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <meshStandardMaterial
                color="#ebd382"
                metalness={1.0}
                roughness={0.12}
                envMapIntensity={3.2}
              />
            </mesh>
          </group>

          {/* 5. JEWEL-FACET CRYSTAL STOPPER CAP */}
          <group ref={capRef} position={[0, 83.81, 0]}>
            <mesh geometry={nodes.Bottle_Cap.geometry} castShadow receiveShadow>
              <meshPhysicalMaterial
                transmission={0.95}
                roughness={0.02}
                metalness={0.0}
                ior={1.54}
                thickness={2.2}
                specularIntensity={1.0}
                specularColor="#ffffff"
                clearcoat={1.0}
                clearcoatRoughness={0.01}
                envMapIntensity={2.8}
                transparent
              />
            </mesh>
          </group>

          {/* 6. ETCHED DARUL ATTAR BRAND EMBLEM ON CRYSTAL GLASS */}
          <mesh position={[0, 36.0, 14.36]}>
            <planeGeometry args={[26.0, 26.0]} />
            <meshStandardMaterial
              map={logoTexture}
              bumpMap={logoBumpTexture}
              bumpScale={0.08}
              transparent
              metalness={0.95}
              roughness={0.15}
              envMapIntensity={3.2}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </mesh>
        </group>
      </group>

      {/* LUXURY DISPLAY PEDESTAL */}
      <mesh position={[0, -1.64, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.3, 0.08, 64]} />
        <meshStandardMaterial
          color="#131318"
          roughness={0.3}
          metalness={0.6}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* MIST PARTICLES (Emits from nozzle on click) */}
      <Sparkles
        ref={sparklesRef}
        position={[0, 1.28, 0]}
        count={isSpraying ? 80 : 0}
        scale={isSpraying ? [2.5, 3.5, 2.5] : [0, 0, 0]}
        size={3.5}
        speed={3.2}
        color={selectedBlend.liquidColor}
        frustumCulled={false}
      />
    </group>
  );
}

useGLTF.preload('/store_bottle.glb');
useTexture.preload('/darul_attar_logo.png');
useTexture.preload('/darul_attar_logo_bump.png');

export default function BottleExperience() {
  const [selectedBlend, setSelectedBlend] = useState(SCENT_BLENDS[1]); // Royal Amber default
  const [isSpraying, setIsSpraying] = useState(false);
  const sprayTimer = useRef(null);

  const triggerSpray = () => {
    setIsSpraying(true);
    if (sprayTimer.current) clearTimeout(sprayTimer.current);
    sprayTimer.current = setTimeout(() => {
      setIsSpraying(false);
    }, 1200);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#101015', overflow: 'hidden', position: 'relative' }}>
      
      {/* SOFT STUDIO VIGNETTE */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.80) 100%)',
          zIndex: 2,
        }}
      />

      {/* 3D CANVAS: FULL RETINA HARDWARE MSAA & PROFESSIONAL STUDIO LIGHTING */}
      <Canvas
        shadows
        camera={{ position: [0, 0.2, 5.2], fov: 38 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <color attach="background" args={['#101015']} />

        {/* 360-DEGREE STUDIO ENVIRONMENT MAP FOR CRISP GLASS REFLECTIONS */}
        <Environment preset="studio" environmentIntensity={1.8} />

        {/* DIRECT STUDIO ILLUMINATION */}
        {/* Key Front-Right Light */}
        <directionalLight
          position={[4, 6, 5]}
          intensity={3.0}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        {/* Soft Front-Left Fill Light */}
        <directionalLight
          position={[-4, 3, 4]}
          intensity={2.2}
          color="#e8f0fe"
        />
        {/* Overhead Ceiling Softbox Light */}
        <directionalLight
          position={[0, 8, 1]}
          intensity={2.5}
          color="#fff8ee"
        />
        {/* Ambient Fill */}
        <ambientLight intensity={0.65} />

        {/* Uplight through Thick Crystal Punt Floor */}
        <pointLight
          position={[0, -2.2, 0.4]}
          intensity={4.5}
          color="#f7dc8a"
          distance={5}
        />

        {/* Studio Halo Backlight behind Bottle */}
        <pointLight
          position={[0, 0.5, -2.8]}
          intensity={4.0}
          color="#c4a568"
          distance={7}
        />
        <mesh position={[0, 0, -3.8]}>
          <planeGeometry args={[22, 16]} />
          <meshStandardMaterial
            color="#14141a"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* BOTTLE AT ORIGIN */}
        <PhotorealisticBottle
          selectedBlend={selectedBlend}
          isSpraying={isSpraying}
          triggerSpray={triggerSpray}
        />

        {/* CONTACT OCCLUSION SHADOW */}
        <ContactShadows
          position={[0, -1.60, 0]}
          opacity={0.65}
          scale={6.5}
          blur={1.8}
          frames={1}
        />

        {/* 360-DEGREE DAMPED ORBIT CONTROLS */}
        <OrbitControls
          enablePan={false}
          minDistance={3.2}
          maxDistance={7.5}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.75}
          autoRotate={true}
          autoRotateSpeed={0.8}
          dampingFactor={0.05}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* MINIMAL LUXURY SCENT SWITCHER AT BOTTOM */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(15,15,20,0.85)',
          padding: '6px 10px',
          borderRadius: '40px',
          border: '1px solid rgba(212,175,55,0.35)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          gap: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        }}
      >
        {SCENT_BLENDS.map((blend) => {
          const isActive = blend.id === selectedBlend.id;
          return (
            <button
              key={blend.id}
              onClick={() => setSelectedBlend(blend)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '30px',
                border: 'none',
                background: isActive ? 'rgba(212,175,55,0.24)' : 'transparent',
                color: isActive ? '#d4af37' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: blend.liquidColor,
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: isActive ? `0 0 10px ${blend.liquidColor}` : 'none',
                }}
              />
              <span>{blend.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
