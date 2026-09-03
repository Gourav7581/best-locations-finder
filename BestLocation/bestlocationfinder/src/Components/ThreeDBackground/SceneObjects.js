import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const pastel = {
  violet: "#a9a8f5",
  blue: "#9ddcf4",
  coral: "#f4b3a9",
  white: "#ffffff",
};

function GentleFloat({ children, position, speed = 1, intensity = 0.18 }) {
  const group = useRef();
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.y = baseY + Math.sin(clock.elapsedTime * 0.55 * speed + position[0]) * intensity;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.22 * speed) * 0.025;
  });
  return <group ref={group} position={position}>{children}</group>;
}

export const FloatingPin = memo(function FloatingPin({ position, scale = 1, color = pastel.violet, speed = 1 }) {
  const group = useRef();
  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12 * speed;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.45 * speed) * 0.08;
  });

  return (
    <GentleFloat position={position} speed={speed} intensity={0.16}>
      <group ref={group} scale={scale}>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.32, 18, 14]} />
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.12} roughness={0.2} metalness={0.06} transparent opacity={0.9} clearcoat={0.9} />
        </mesh>
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.22, 0.55, 18]} />
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.1} roughness={0.24} transparent opacity={0.86} clearcoat={0.7} />
        </mesh>
        <mesh position={[0, 0.2, 0.29]}>
          <torusGeometry args={[0.095, 0.035, 10, 22]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.88} />
        </mesh>
      </group>
    </GentleFloat>
  );
});

export const CompassRing = memo(function CompassRing({ position, scale = 1, color = pastel.blue, speed = 1 }) {
  const ring = useRef();
  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.055 * speed;
  });
  return (
    <GentleFloat position={position} speed={speed} intensity={0.12}>
      <group ref={ring} rotation={[0.55, 0.15, 0]} scale={scale}>
        <mesh><torusGeometry args={[0.52, 0.032, 10, 48]} /><meshBasicMaterial color={color} transparent opacity={0.76} /></mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[0.025, 1.28, 0.02]} /><meshBasicMaterial color={color} transparent opacity={0.5} /></mesh>
        <mesh><boxGeometry args={[0.025, 1.28, 0.02]} /><meshBasicMaterial color={color} transparent opacity={0.5} /></mesh>
        <mesh rotation={[0, 0, -0.25]}><coneGeometry args={[0.1, 0.52, 3]} /><meshBasicMaterial color={color} transparent opacity={0.5} /></mesh>
      </group>
    </GentleFloat>
  );
});

export const GlassSphere = memo(function GlassSphere({ position, scale = 1, color = pastel.white, speed = 1 }) {
  return (
    <GentleFloat position={position} speed={speed} intensity={0.2}>
      <mesh scale={scale}>
        <icosahedronGeometry args={[0.48, 2]} />
        <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.08} transparent opacity={0.4} roughness={0.08} metalness={0} clearcoat={1} transmission={0.2} thickness={0.3} depthWrite={false} />
      </mesh>
    </GentleFloat>
  );
});

export const MapTile = memo(function MapTile({ position, rotation = [0, 0, 0], scale = 1, color = pastel.coral }) {
  return (
    <GentleFloat position={position} speed={0.8} intensity={0.13}>
      <group rotation={rotation} scale={scale}>
        <mesh>
          <boxGeometry args={[0.85, 0.62, 0.08]} />
          <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.08} transparent opacity={0.54} roughness={0.3} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0, 0.06]} rotation={[0, 0, 0.28]}>
          <torusGeometry args={[0.2, 0.018, 8, 26, Math.PI * 1.45]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
        </mesh>
      </group>
    </GentleFloat>
  );
});

export const RouteCurve = memo(function RouteCurve({ position = [0, 0, 0], color = pastel.violet }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.1, -0.2, 0),
      new THREE.Vector3(-0.45, 0.3, 0.15),
      new THREE.Vector3(0.25, -0.15, 0),
      new THREE.Vector3(1.05, 0.24, -0.1),
    ]);
    return new THREE.TubeGeometry(curve, 36, 0.012, 6, false);
  }, []);
  return <mesh position={position} geometry={geometry}><meshBasicMaterial color={color} transparent opacity={0.28} /></mesh>;
});

export const BackgroundParticles = memo(function BackgroundParticles({ count = 42 }) {
  const points = useRef();
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 12;
      values[index * 3 + 1] = (Math.random() - 0.5) * 8;
      values[index * 3 + 2] = -1 - Math.random() * 3;
    }
    return values;
  }, [count]);
  useFrame((_, delta) => { if (points.current) points.current.rotation.z += delta * 0.008; });
  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#7775e6" size={0.052} transparent opacity={0.62} sizeAttenuation depthWrite={false} />
    </points>
  );
});

export const TravelGlobe = memo(function TravelGlobe({ position, scale = 1 }) {
  const globe = useRef();
  const plane = useRef();
  useFrame(({ clock }, delta) => {
    if (globe.current) globe.current.rotation.y += delta * 0.09;
    if (plane.current) {
      const angle = clock.elapsedTime * 0.22;
      plane.current.position.set(Math.cos(angle) * 1.05, Math.sin(angle) * 0.34, Math.sin(angle) * 0.45);
      plane.current.rotation.z = angle + Math.PI / 2;
    }
  });
  return (
    <GentleFloat position={position} speed={0.7} intensity={0.12}>
      <group scale={scale}>
        <group ref={globe}>
          <mesh><icosahedronGeometry args={[0.72, 2]} /><meshPhysicalMaterial color="#a8dff1" emissive="#72c8e8" emissiveIntensity={0.09} transparent opacity={0.34} roughness={0.15} clearcoat={1} depthWrite={false} /></mesh>
          <mesh><icosahedronGeometry args={[0.735, 2]} /><meshBasicMaterial color="#6e70d9" wireframe transparent opacity={0.58} /></mesh>
          <mesh rotation={[Math.PI / 2.7, 0, 0.25]}><torusGeometry args={[0.92, 0.018, 8, 64]} /><meshBasicMaterial color="#f0a79d" transparent opacity={0.8} /></mesh>
        </group>
        <group ref={plane}>
          <mesh rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.08, 0.34, 3]} /><meshBasicMaterial color="#5b5bd6" /></mesh>
          <mesh><boxGeometry args={[0.28, 0.035, 0.1]} /><meshBasicMaterial color="#7777e8" /></mesh>
        </group>
      </group>
    </GentleFloat>
  );
});
