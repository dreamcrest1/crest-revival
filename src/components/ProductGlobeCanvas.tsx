import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Billboard, OrbitControls } from '@react-three/drei';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { GlobeItem } from './ProductGlobe';

const PLACEHOLDER = '/placeholder.svg';

/** Even sphere distribution via Fibonacci lattice. */
function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    out.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius,
      ),
    );
  }
  return out;
}

function LogoTile({
  position,
  item,
  size,
  onSelect,
}: {
  position: THREE.Vector3;
  item: GlobeItem;
  size: number;
  onSelect: (href: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(
    THREE.TextureLoader,
    item.image || PLACEHOLDER,
    undefined,
    (err) => {
      // swallow — fall back below
      console.warn('logo load fail', item.name, err);
    },
  );
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 2;
  }

  const scale = hovered ? size * 1.18 : size;

  return (
    <Billboard position={position}>
      {/* Hover glow ring */}
      {hovered && (
        <mesh>
          <circleGeometry args={[size * 0.62, 32]} />
          <meshBasicMaterial
            color="#f97316"
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      )}
      <mesh
        scale={[scale, scale, scale]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.href);
        }}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Billboard>
  );
}

function RotatingGroup({
  items,
  radius,
  tileSize,
  onSelect,
  paused,
}: {
  items: GlobeItem[];
  radius: number;
  tileSize: number;
  onSelect: (href: string) => void;
  paused: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => fibonacciSphere(items.length, radius), [items.length, radius]);

  useFrame((_, delta) => {
    if (!group.current || paused) return;
    group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Suspense key={it.name + i} fallback={null}>
          <LogoTile
            position={positions[i]}
            item={it}
            size={tileSize}
            onSelect={onSelect}
          />
        </Suspense>
      ))}
    </group>
  );
}

type Props = {
  items: GlobeItem[];
  isMobile: boolean;
  onSelect: (href: string) => void;
};

const ProductGlobeCanvas = ({ items, isMobile, onSelect }: Props) => {
  const radius = isMobile ? 2.6 : 3.2;
  const tileSize = isMobile ? 0.7 : 0.8;
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<number | null>(null);

  const handleStart = () => {
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  };
  const handleEnd = () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), 1500);
  };

  return (
    <Canvas
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      camera={{ position: [0, 0, isMobile ? 7 : 8], fov: 45 }}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
    >
      <ambientLight intensity={1} />
      <RotatingGroup
        items={items}
        radius={radius}
        tileSize={tileSize}
        onSelect={onSelect}
        paused={paused}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
      />
    </Canvas>
  );
};

export default ProductGlobeCanvas;
