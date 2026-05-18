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

type TexState = { tex: THREE.Texture | null; failed: boolean };

function useSafeTexture(url: string): TexState {
  const [state, setState] = useState<TexState>({ tex: null, failed: false });
  useEffect(() => {
    let cancelled = false;
    if (!url) {
      setState({ tex: null, failed: true });
      return;
    }
    setState({ tex: null, failed: false });
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      url,
      (t) => {
        if (cancelled) { t.dispose(); return; }
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.generateMipmaps = true;
        setState({ tex: t, failed: false });
      },
      undefined,
      () => {
        if (cancelled) return;
        setState({ tex: null, failed: true });
      },
    );
    return () => { cancelled = true; };
  }, [url]);
  return state;
}

function LogoTile({
  position,
  startPosition,
  formStart,
  formDuration,
  item,
  size,
  onSelect,
}: {
  position: THREE.Vector3;
  startPosition: THREE.Vector3;
  formStart: number;
  formDuration: number;
  item: GlobeItem;
  size: number;
  onSelect: (href: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const activeImage = item.images[Math.min(sourceIndex, item.images.length - 1)] ?? '';
  const { tex: texture, failed } = useSafeTexture(activeImage);
  const billboardRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const discMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const logoMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const currentPos = useMemo(() => startPosition.clone(), [startPosition]);
  const appearStartRef = useRef<number | null>(null);
  const APPEAR_DURATION = 0.7;

  // easeOutCubic
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();

    // Formation animation (globe-wide): position + base scale ease
    const formP = THREE.MathUtils.clamp((now - formStart) / formDuration, 0, 1);
    const formEased = ease(formP);

    // Per-tile reveal: only starts when its texture has loaded
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
      billboardRef.current.position.copy(currentPos);
    }

    if (!groupRef.current) return;
    // Scale combines formation + a gentle pop-in once texture arrives
    const reveal = appearEased;
    const baseScale = (hovered ? size * 1.2 : size) * formEased * (0.7 + 0.3 * reveal);
    groupRef.current.scale.setScalar(baseScale);

    // Depth-based fade combined with per-tile reveal opacity
    groupRef.current.getWorldPosition(worldPos);
    const t = THREE.MathUtils.clamp((worldPos.z + 3.5) / 7, 0, 1);
    const depthOpacity = 0.45 + t * 0.55;
    const opacity = depthOpacity * formEased * reveal;
    if (discMatRef.current) discMatRef.current.opacity = opacity * 0.92;
    if (logoMatRef.current) logoMatRef.current.opacity = opacity;
    if (ringMatRef.current) ringMatRef.current.opacity = opacity * 0.6;
  });

  useEffect(() => {
    setSourceIndex(0);
    appearStartRef.current = null;
  }, [item.name, item.images]);

  useEffect(() => {
    if (failed && sourceIndex < item.images.length - 1) setSourceIndex((i) => i + 1);
  }, [failed, sourceIndex, item.images.length]);

  if (failed) return null;

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
        {/* Clean white circular icon plate */}
        <mesh>
          <circleGeometry args={[0.52, 48]} />
          <meshBasicMaterial
            ref={discMatRef}
            color="#ffffff"
            transparent
            opacity={0.96}
            depthWrite={false}
          />
        </mesh>
        {/* Logo image, contained inside the disc, masked to a circle */}
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[0.72, 0.72]} />
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
  const startPositions = useMemo(
    () =>
      positions.map((p) => {
        // Scatter tiles randomly within a much larger sphere; biased outward
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
  const radius = isMobile ? 2.4 : 3.0;
  const tileSize = isMobile ? 0.6 : 0.68;
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
