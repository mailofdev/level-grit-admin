import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';

/**
 * 3D Hero Scene with floating fitness elements
 */
const FitnessElement = ({ position, color, shape = 'box' }) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      {shape === 'box' ? (
        <mesh position={position}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
      ) : (
        <mesh position={position}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
      )}
    </Float>
  );
};

const Hero3DScene = () => {
  return (
    <div style={{ width: '100%', height: '400px', background: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />
          
          <FitnessElement position={[-1, 1, 0]} color="#4CAF50" shape="box" />
          <FitnessElement position={[1, -0.5, 0]} color="#FF6B6B" shape="sphere" />
          <FitnessElement position={[0, 1.5, -1]} color="#4ECDC4" shape="box" />
          <FitnessElement position={[-0.8, -1, 0.5]} color="#FFE66D" shape="sphere" />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3DScene;

