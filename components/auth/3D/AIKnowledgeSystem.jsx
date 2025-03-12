// components/AIKnowledgeSystem.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const AICorePolyhedron = ({ position = [0, 0, 0], size = 1 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.007;
      meshRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[size, 2]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#003a5c"
          metalness={0.9}
          roughness={0.2}
          wireframe={true}
        />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[size * 0.8, 1]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[size * 1.2, 32, 32]} />
        <meshStandardMaterial
          color="#80f0ff"
          transparent={true}
          opacity={0.1}
          emissive="#00ffff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

const DataNode = ({
  startPosition,
  endPosition,
  color = "#ff3080",
  size = 0.15,
  speed = 0.01,
}) => {
  const meshRef = useRef();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(true);

  useFrame(() => {
    if (active && meshRef.current) {
      setProgress((prev) => {
        if (prev >= 1) {
          setTimeout(() => {
            setProgress(0);
          }, Math.random() * 2000);
          return 1;
        }
        return prev + speed;
      });

      // Interpolate position
      meshRef.current.position.x = THREE.MathUtils.lerp(
        startPosition[0],
        endPosition[0],
        progress
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        startPosition[1],
        endPosition[1],
        progress
      );
      meshRef.current.position.z = THREE.MathUtils.lerp(
        startPosition[2],
        endPosition[2],
        progress
      );

      const scale = 1 + 0.2 * Math.sin(progress * Math.PI * 2);
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={startPosition}
      onClick={() => setActive(!active)}
    >
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <AICorePolyhedron position={[0, 0, 0]} size={1.5} />

      {Array.from({ length: 15 }).map((_, i) => {
        const angle = (i / 15) * Math.PI * 2;
        const radius = 10 + Math.random() * 5;
        const height = (Math.random() - 0.5) * 10;
        const startPos = [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius,
        ];

        return (
          <DataNode
            key={i}
            startPosition={startPos}
            endPosition={[0, 0, 0]}
            color="#00f0ff"
            speed={0.005 + Math.random() * 0.005}
            size={0.1 + Math.random() * 0.1}
          />
        );
      })}

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          intensity={0.7}
        />
      </EffectComposer>

      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.6}
        rotateSpeed={0.5}
        minDistance={3}
        maxDistance={20}
      />

      <ambientLight intensity={0.2} />

      <pointLight
        position={[0, 0, 0]}
        intensity={1}
        color="#00ffff"
        distance={10}
      />
      <pointLight
        position={[10, 5, 5]}
        intensity={0.8}
        color="#ff80c0"
        distance={20}
      />
      <pointLight
        position={[-10, -5, -5]}
        intensity={0.8}
        color="#80c0ff"
        distance={20}
      />
    </>
  );
};

const AIKnowledgeSystem = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      style={{ width: "100%", height: "100%", background: "#000000" }}
      className="relative h-full w-full"
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
        }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default AIKnowledgeSystem;
