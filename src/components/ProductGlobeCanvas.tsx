import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { GlobeItem } from './ProductGlobe';
import type { GlobeLogo } from '@/data/globeLogos';

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

function useTexture(url: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(url, (t) => {
      if (cancelled) { t.dispose(); return; }
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 16;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true;
      setTex(t);
    });
    return () => { cancelled = true; };
  }, [url]);
  return tex;
}

function LogoTile({
  position,
  startPosition,
  formStart,
  formDuration,
  item,
  size,
  onSelect,
  index,
}: {
  position: THREE.Vector3;
  startPosition: THREE.Vector3;
  formStart: number;
  formDuration: number;
  item: GlobeItem;
  size: number;
  onSelect: (logo: GlobeLogo) => void;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(item.image);
  const billboardRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const logoMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const currentPos = useMemo(() => startPosition.clone(), [startPosition]);
  const appearStartRef = useRef<number | null>(null);
  const APPEAR_DURATION = 0.6;

  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    const formP = THREE.MathUtils.clamp((now - formStart) / formDuration, 0, 1);
    const formEased = ease(formP);

    if (texture && appearStartRef.current === null) {
      appearStartRef.current = now;
    }
    const appearP =
      appearStartRef.current === null
        ? 0
        : THREE.MathUtils.clamp((now - appearStartRef.current) / APPEAR_DURATION, 0, 1);
    const appearEased = ease(appearP);

    if (billboardRef.current) {
      currentPos.lerpVectors(startPosition, position, formEased);
      // gentle floating bob per logo, offset by index for organic feel
      const bob = Math.sin(now * 1.2 + index * 0.9) * 0.04;
      currentPos.y += bob * formEased;
      billboardRef.current.position.copy(currentPos);
    }

    if (!groupRef.current) return;
    const baseScale = (hovered ? size * 1.2 : size) * formEased * (0.7 + 0.3 * appearEased);
    groupRef.current.scale.setScalar(baseScale);

    groupRef.current.getWorldPosition(worldPos);
    const depthT = THREE.MathUtils.clamp((worldPos.z + 3.5) / 7, 0, 1);
    const depthOpacity = 0.55 + depthT * 0.45;
    const opacity = depthOpacity * formEased * appearEased;
    if (logoMatRef.current) logoMatRef.current.opacity = opacity;
  });

  useEffect(() => {
    appearStartRef.current = null;
  }, [item.name, item.image]);

  if (!texture) return null;

  return (
    <Billboard ref={billboardRef} position={startPosition}>
      <group
        ref={groupRef}
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
          onSelect(item.meta);
        }}
      >
        {/* Logo image only — no disc, no border ring */}
        <mesh>
          <planeGeometry args={[1.05, 1.05]} />
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
  onSelect: (logo: GlobeLogo) => void;
  paused: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => fibonacciSphere(items.length, radius), [items.length, radius]);
  const startPositions = useMemo(
    () =>
      positions.map(() => {
        const dir = new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
        ).normalize();
        const dist = radius * (3 + Math.random() * 2);
        return dir.multiplyScalar(dist);
      }),
    [positions, radius],
  );
  const formStartRef = useRef<number | null>(null);
  const [formStart, setFormStart] = useState(0);
  useFrame(({ clock }, delta) => {
    if (formStartRef.current === null) {
      formStartRef.current = clock.getElapsedTime();
      setFormStart(formStartRef.current);
    }
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
          startPosition={startPositions[i]}
          formStart={formStart}
          formDuration={1.8}
          item={it}
          size={tileSize}
          onSelect={onSelect}
          index={i}
        />
      ))}
    </group>
  );
}

type Props = {
  items: GlobeItem[];
  isMobile: boolean;
  onSelect: (logo: GlobeLogo) => void;
};

const ProductGlobeCanvas = ({ items, isMobile, onSelect }: Props) => {
  // Slightly smaller sphere with the camera pulled back so all logos sit
  // comfortably inside the frame (no edge clipping on desktop).
  const radius = isMobile ? 2.3 : 2.9;
  const tileSize = isMobile ? 1.34 : 1.41;
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
      dpr={isMobile ? [1.5, 2.5] : [1, 1.5]}
      camera={{ position: [0, 0, isMobile ? 8.5 : 9.5], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          'webglcontextlost',
          (e) => e.preventDefault(),
          false,
        );
      }}
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
