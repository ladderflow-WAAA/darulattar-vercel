import React, { useRef, useState, useMemo, useEffect, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  OrbitControls,
  Text,
  useGLTF,
  useTexture,
  Sparkles,
} from '@react-three/drei';
import { easing } from 'maath';

export const SCENT_BLENDS = [
  {
    id: 'cambodian-oud',
    name: 'Cambodian Oud',
    liquidColor: '#c05210',
    attenuationColor: '#5c2000',
    label: 'CAMBODIAN OUD',
  },
  {
    id: 'royal-amber',
    name: 'Royal Ambergris',
    liquidColor: '#f2a713',
    attenuationColor: '#8a4800',
    label: 'ROYAL AMBERGRIS',
  },
  {
    id: 'taif-rose',
    name: 'Taif Rose Extrait',
    liquidColor: '#e0285a',
    attenuationColor: '#6e0720',
    label: 'TAIF ROSE EXTRAIT',
  },
  {
    id: 'white-musk',
    name: 'White Musk Tahara',
    liquidColor: '#b5d5ef',
    attenuationColor: '#4f7b9f',
    label: 'WHITE MUSK TAHARA',
  },
];

export function PhotorealisticBottle({ selectedBlend, isSpraying, triggerSpray }) {
  const capRef = useRef();
  const liquidRef = useRef();
  const liquidMatRef = useRef();
  const collarRef = useRef();
  const sparklesRef = useRef();

  // Fluid physics simulation state (spring-damper slosh & inertia)
  const lastCameraRotY = useRef(0);
  const sloshAngle = useRef({ x: 0, z: 0 });
  const sloshVel = useRef({ x: 0, z: 0 });

  // Load procedural Blender GLB model
  const { nodes } = useGLTF('/store_bottle.glb');

  // Load etched Darul Attar brand logo & bump textures (transparent alpha, white background removed)
  const logoTexture = useTexture('/darul_attar_logo.png');
  const logoBumpTexture = useTexture('/darul_attar_logo_bump.png');

  // Ensure smooth vertex normals on load for clean facet lighting
  useLayoutEffect(() => {
    if (nodes.Bottle_Glass?.geometry) {
      nodes.Bottle_Glass.geometry.computeVertexNormals();
    }
    if (nodes.Bottle_Cap?.geometry) {
      nodes.Bottle_Cap.geometry.computeVertexNormals();
    }
    if (nodes.Bottle_Liquid?.geometry) {
      nodes.Bottle_Liquid.geometry.computeVertexNormals();
    }
  }, [nodes]);

  // Ensure sRGB color space for photographic contrast
  useEffect(() => {
    if (logoTexture) {
      logoTexture.colorSpace = THREE.SRGBColorSpace;
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture]);

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

  useFrame((state, delta) => {
    // 1. Smooth collar click dip
    const collarDip = isSpraying ? -2.0 : 0.0;
    easing.damp(collarRef.current.position, 'y', collarDip, 0.1, delta);

    // 2. Real-time liquid color morphing
    if (liquidMatRef.current) {
      easing.dampC(liquidMatRef.current.color, targetLiquidColor, 0.35, delta);
      easing.dampC(liquidMatRef.current.emissive, targetAttenuationColor, 0.35, delta);
    }

    // 3. Atomizer mist burst
    if (sparklesRef.current) {
      const activeSpray = isSpraying ? 2.5 : 0.0;
      sparklesRef.current.scale.setScalar(activeSpray * 1.4);
    }

    // 4. Real-time Fluid Dynamics & Slosh Simulation
    const currentRotY = state.camera.rotation.y;
    const deltaY = currentRotY - lastCameraRotY.current;
    lastCameraRotY.current = currentRotY;

    // Physical inertia force proportional to rotation speed
    const clampedDeltaY = THREE.MathUtils.clamp(deltaY, -0.15, 0.15);
    const inertialForceZ = clampedDeltaY * 18.0;

    // Subtle idle convection fluid sway
    const time = state.clock.elapsedTime;
    const idleSwayZ = Math.sin(time * 2.2) * 0.015;
    const idleSwayX = Math.cos(time * 1.8) * 0.012;

    // Spray pulse disturbance impulse
    const sprayImpulse = isSpraying ? (Math.random() - 0.5) * 0.25 : 0.0;

    // Fluid spring-damper equations: viscous attar oil
    const springK = 35.0;
    const dampingC = 4.2;

    const accelZ = -springK * sloshAngle.current.z - dampingC * sloshVel.current.z + inertialForceZ + idleSwayZ + sprayImpulse;
    const accelX = -springK * sloshAngle.current.x - dampingC * sloshVel.current.x + idleSwayX;

    const safeDelta = Math.min(delta, 0.05);
    sloshVel.current.z += accelZ * safeDelta;
    sloshAngle.current.z += sloshVel.current.z * safeDelta;
    sloshAngle.current.z = THREE.MathUtils.clamp(sloshAngle.current.z, -0.16, 0.16);

    sloshVel.current.x += accelX * safeDelta;
    sloshAngle.current.x += sloshVel.current.x * safeDelta;
    sloshAngle.current.x = THREE.MathUtils.clamp(sloshAngle.current.x, -0.14, 0.14);

    // Apply fluid physics tilt to liquid volume around its center of mass
    if (liquidRef.current) {
      liquidRef.current.rotation.z = sloshAngle.current.z;
      liquidRef.current.rotation.x = sloshAngle.current.x;
      liquidRef.current.position.y = Math.sin(time * 3.5) * 0.25;
    }
  });

  return (
    <group>
      {/* Normalized scale and centered pivot */}
      <group scale={targetScale}>
        <group position={[0, centeringOffsetY, 0]}>

          {/* 1. OPTICAL SUBMERGED DIP TUBE (Refracts through liquid and outer glass) */}
          <mesh geometry={nodes.Bottle_Tube.geometry} renderOrder={0}>
            <meshPhysicalMaterial
              color="#ffffff"
              transparent
              opacity={0.45}
              roughness={0.1}
              metalness={0.2}
              envMapIntensity={2.5}
              depthWrite={false}
            />
          </mesh>

          {/* 2. INNER SEE-THROUGH PERFUME OIL (Beer-Lambert + Fresnel Edge Density) */}
          <group position={[0, 11.986, 0]} ref={liquidRef}>
            <mesh
              geometry={nodes.Bottle_Liquid.geometry}
              position={[0, -11.986, 0]}
              renderOrder={1}
            >
              <meshPhysicalMaterial
                ref={liquidMatRef}
                color={selectedBlend.liquidColor}
                emissive={selectedBlend.attenuationColor}
                emissiveIntensity={0.28}
                transparent={true}
                opacity={0.55}
                depthWrite={false}
                roughness={0.04}
                metalness={0.05}
                ior={1.47}
                reflectivity={0.95}
                clearcoat={1.0}
                clearcoatRoughness={0.02}
                envMapIntensity={3.0}
                side={THREE.DoubleSide}
                onBeforeCompile={(shader) => {
                  shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <output_fragment>',
                    `
                    // Beer-Lambert + Fresnel optical liquid edge density:
                    float viewDot = abs(dot(normalize(vNormal), normalize(vViewPosition)));
                    float fresnel = pow(1.0 - viewDot, 1.8);
                    diffuseColor.a = clamp(0.38 + fresnel * 0.52, 0.38, 0.90);
                    gl_FragColor = vec4(outgoingLight * (1.0 + fresnel * 0.45), diffuseColor.a);
                    `
                  );
                }}
              />
            </mesh>
          </group>

          {/* 3. OUTER CRYSTAL FLACON (High Optical Refraction, Distortion & Chromatic Aberration) */}
          <mesh
            geometry={nodes.Bottle_Glass.geometry}
            position={nodes.Bottle_Glass.position}
            rotation={nodes.Bottle_Glass.rotation}
            scale={nodes.Bottle_Glass.scale}
            renderOrder={3}
          >
            <MeshTransmissionMaterial
              backside={true}
              backsideResolution={512}
              backsideThickness={2.2}
              thickness={3.8}
              ior={1.55}
              distortion={0.35}
              distortionScale={0.4}
              temporalDistortion={0.0}
              chromaticAberration={0.08}
              anisotropy={0.3}
              roughness={0.02}
              clearcoat={1.0}
              clearcoatRoughness={0.02}
              attenuationColor="#f4f8ff"
              attenuationDistance={12.0}
              samples={6}
              resolution={1024}
              envMapIntensity={3.5}
              color="#ffffff"
            />
          </mesh>

          {/* 4. 24K JEWELRY-GRADE GOLD ATOMIZER NOZZLE & COLLAR */}
          <group ref={collarRef}>
            <mesh
              geometry={nodes.Bottle_Collar.geometry}
              castShadow
              renderOrder={4}
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
              <meshPhysicalMaterial
                color="#d4af37"
                metalness={1.0}
                roughness={0.12}
                clearcoat={0.4}
                clearcoatRoughness={0.08}
                envMapIntensity={2.5}
              />
            </mesh>
          </group>

          {/* 5. JEWEL-FACET CRYSTAL STOPPER CAP (Optical Distortion & Rainbow Prismatic Bevels) */}
          <group ref={capRef} position={[0, 83.81, 0]}>
            <mesh
              geometry={nodes.Bottle_Cap.geometry}
              castShadow
              receiveShadow
              renderOrder={3}
            >
              <MeshTransmissionMaterial
                backside={true}
                backsideResolution={256}
                backsideThickness={1.8}
                thickness={2.8}
                ior={1.55}
                distortion={0.25}
                distortionScale={0.3}
                temporalDistortion={0.0}
                chromaticAberration={0.08}
                anisotropy={0.2}
                roughness={0.02}
                clearcoat={1.0}
                clearcoatRoughness={0.02}
                attenuationColor="#f4f8ff"
                attenuationDistance={10.0}
                samples={6}
                resolution={512}
                envMapIntensity={3.0}
                color="#ffffff"
              />
            </mesh>
          </group>

          {/* 6. ETCHED DARUL ATTAR GOLD EMBLEM ON FRONT FACE (Un-mirrored, reads left-to-right) */}
          <mesh position={[0, 34.0, 14.36]} scale={[-1, 1, 1]} renderOrder={5}>
            <planeGeometry args={[26.0, 26.0]} />
            <meshStandardMaterial
              map={logoTexture}
              bumpMap={logoBumpTexture}
              bumpScale={0.08}
              transparent
              alphaTest={0.04}
              metalness={0.95}
              roughness={0.15}
              color="#dfb142"
              emissive="#8a6314"
              emissiveIntensity={0.30}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>

      {/* MIST PARTICLES (Emits from nozzle on collar click) */}
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
    <div style={{ width: '100vw', height: '100vh', background: '#050507', overflow: 'hidden', position: 'relative' }}>

      {/* 3D CANVAS: RETINA HARDWARE MSAA, HEAVY CRYSTAL REFRACTION & STUDIO LIGHTFORMERS */}
      <Canvas
        shadows
        camera={{ position: [0, 0.15, 6.2], fov: 30 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.20,
        }}
      >
        <color attach="background" args={['#050507']} />

        {/* 3D BACKGROUND TEXT (Visibly warped, magnified and bent by the glass and liquid) */}
        <group position={[0, 0.15, -2.5]}>
          <Text
            fontSize={1.35}
            color="#e5c888"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.18}
            fillOpacity={0.85}
          >
            {selectedBlend.label}
          </Text>
          {/* Subtle architectural caustic aura ring */}
          <mesh position={[0, 0, -0.1]}>
            <ringGeometry args={[1.9, 1.94, 64]} />
            <meshBasicMaterial color="#b38734" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* STUDIO ENVIRONMENT WITH BRIGHT LIGHTFORMERS (Creates razor-sharp white highlights on crystal bevels) */}
        <Environment resolution={512}>
          {/* Left Vertical Strip Softbox */}
          <Lightformer
            form="rect"
            intensity={5.0}
            position={[-4.5, 1.5, 3.0]}
            scale={[2.2, 12, 1]}
            target={[0, 0, 0]}
            color="#ffffff"
          />
          {/* Right Vertical Strip Softbox */}
          <Lightformer
            form="rect"
            intensity={4.2}
            position={[4.5, 1.0, 2.5]}
            scale={[1.8, 10, 1]}
            target={[0, 0, 0]}
            color="#fff2df"
          />
          {/* Overhead Circular Diffuser */}
          <Lightformer
            form="ring"
            intensity={3.5}
            position={[0, 6.5, 0]}
            scale={5.0}
            target={[0, 0, 0]}
            color="#ffffff"
          />
          {/* Base Rim Softbox */}
          <Lightformer
            form="rect"
            intensity={4.0}
            position={[0, -3.2, 2.0]}
            scale={[5.0, 2.5, 1]}
            target={[0, 0, 0]}
            color="#f5df9b"
          />
        </Environment>

        {/* DIRECT STUDIO ILLUMINATION */}
        {/* Key Front-Right Softbox */}
        <directionalLight
          position={[4.0, 5.0, 4.0]}
          intensity={3.0}
          color="#ffffff"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        {/* Fill Front-Left Softbox */}
        <directionalLight
          position={[-4.0, 3.0, 3.5]}
          intensity={2.0}
          color="#e6f0fa"
        />
        {/* Overhead Ceiling Softbox */}
        <directionalLight
          position={[0, 7.5, 1.0]}
          intensity={2.5}
          color="#fffaf0"
        />
        {/* Ambient Fill */}
        <ambientLight intensity={0.65} />

        {/* Base Punt Uplight */}
        <pointLight
          position={[0, -2.2, 0.6]}
          intensity={3.8}
          color="#fada8b"
          distance={5}
        />

        {/* BOTTLE AT ORIGIN */}
        <PhotorealisticBottle
          selectedBlend={selectedBlend}
          isSpraying={isSpraying}
          triggerSpray={triggerSpray}
        />

        {/* 360-DEGREE DAMPED ORBIT CONTROLS */}
        <OrbitControls
          enablePan={false}
          minDistance={3.6}
          maxDistance={8.0}
          minPolarAngle={Math.PI * 0.22}
          maxPolarAngle={Math.PI * 0.72}
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
          background: 'rgba(12,12,16,0.88)',
          padding: '6px 10px',
          borderRadius: '40px',
          border: '1px solid rgba(212,175,55,0.40)',
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
                background: isActive ? 'rgba(212,175,55,0.26)' : 'transparent',
                color: isActive ? '#f2d16d' : 'rgba(255,255,255,0.75)',
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
                  border: '1px solid rgba(255,255,255,0.5)',
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
