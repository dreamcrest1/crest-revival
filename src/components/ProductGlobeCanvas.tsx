import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
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

function useSafeTexture(url: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      url || PLACEHOLDER,
      (t) => {
        if (cancelled) { t.dispose(); return; }
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        setTex(t);
      },
      undefined,
      () => {
        loader.load(PLACEHOLDER, (t) => {
          if (cancelled) { t.dispose(); return; }
          t.colorSpace = THREE.SRGBColorSpace;
          setTex(t);
        });
      },
    );
    return () => { cancelled = true; };
  }, [url]);
  return tex;
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
  const texture = useSafeTexture(item.image);
  const groupRef = useRef<THREE.Group>(null);
  const discMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const logoMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const worldPos = useMemo(() => new THREE.Vector3(), []);

  // Depth-based fade: back of sphere fades, front stays sharp
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.getWorldPosition(worldPos);
    // worldPos.z roughly in [-radius, +radius]; map to opacity
    const t = THREE.MathUtils.clamp((worldPos.z + 3.5) / 7, 0, 1);
    const opacity = 0.15 + t * 0.85;
    if (discMatRef.current) discMatRef.current.opacity = opacity * 0.92;
    if (logoMatRef.current) logoMatRef.current.opacity = opacity;
    if (ringMatRef.current) ringMatRef.current.opacity = opacity * 0.6;
  });

  if (!texture) return null;
  const scale = hovered ? size * 1.2 : size;

  return (
    <Billboard position={position}>
      <group
        ref={groupRef}
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
        {/* Outer glow ring on hover */}
        {hovered && (
          <mesh position={[0, 0, -0.02]}>
            <ringGeometry args={[0.56, 0.72, 48]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.55} depthWrite={false} />
          </mesh>
        )}
        {/* Subtle border ring always visible */}
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[0.52, 0.56, 48]} />
          <meshBasicMaterial
            ref={ringMatRef}
            color={hovered ? '#f97316' : '#ffffff'}
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </mesh>
        {/* Dark glassy disc background */}
        <mesh>
          <circleGeometry args={[0.52, 48]} />
          <meshBasicMaterial
            ref={discMatRef}
            color="#0a0e1a"
            transparent
            opacity={0.92}
            depthWrite={false}
          />
        </mesh>
        {/* Logo image, contained inside the disc */}
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[0.78, 0.78]} />
          <meshBasicMaterial
            ref={logoMatRef}
            map={texture}
            transparent
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Billboard>
  );
}

function WireSphere({ radius }: { radius: number }) {
  return (
    <>
      <mesh>
        <sphereGeometry args={[radius * 0.98, 48, 32]} />
        <meshBasicMaterial
          color="#f97316"
          wireframe
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.6, 32, 24]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.04}
          depthWrite={false}
        />
      </mesh>
    </>
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
    group.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0]}>
      <WireSphere radius={radius} />
      {items.map((it, i) => (
        <LogoTile
          key={it.name + i}
          position={positions[i]}
          item={it}
          size={tileSize}
          onSelect={onSelect}
        />
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
  const tileSize = isMobile ? 0.85 : 1.0;
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
      camera={{ position: [0, 0, isMobile ? 8 : 9], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
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
