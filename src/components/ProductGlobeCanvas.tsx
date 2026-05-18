import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, OrbitControls, Trail } from '@react-three/drei';
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

type OrbitParams = {
  u: THREE.Vector3;
  v: THREE.Vector3;
  radius: number;
  phase: number;
  speed: number;
};

function LogoTile({
  orbit,
  startPosition,
  formStart,
  formDuration,
  item,
  size,
  onSelect,
  paused,
}: {
  orbit: OrbitParams;
  startPosition: THREE.Vector3;
  formStart: number;
  formDuration: number;
  item: GlobeItem;
  size: number;
  onSelect: (href: string) => void;
  paused: boolean;
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
  const orbitPos = useMemo(() => new THREE.Vector3(), []);
  const currentPos = useMemo(() => startPosition.clone(), [startPosition]);
  const appearStartRef = useRef<number | null>(null);
  const pausedAngleRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const APPEAR_DURATION = 0.7;

  // easeOutCubic
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();

    // Formation animation
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

    // Advance orbit angle (pauses on interaction)
    const dt = Math.min(0.05, now - lastTimeRef.current || 0);
    lastTimeRef.current = now;
    if (!paused) pausedAngleRef.current += dt * orbit.speed;
    const theta = orbit.phase + pausedAngleRef.current;

    // Position on orbit circle
    const c = Math.cos(theta) * orbit.radius;
    const s = Math.sin(theta) * orbit.radius;
    orbitPos.set(
      orbit.u.x * c + orbit.v.x * s,
      orbit.u.y * c + orbit.v.y * s,
      orbit.u.z * c + orbit.v.z * s,
    );

    if (billboardRef.current) {
      currentPos.lerpVectors(startPosition, orbitPos, formEased);
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
      <Trail
        width={0.35}
        length={4}
        color={'#f97316'}
        attenuation={(t) => t * t}
        decay={1.2}
      >
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
          {/* Logo image — only mounted once texture has loaded */}
          {texture && (
            <mesh>
              <planeGeometry args={[0.9, 0.9]} />
              <meshBasicMaterial
                ref={logoMatRef}
                map={texture}
                transparent
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      </Trail>
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

  // Generate per-tile orbit params: random axis, radius slightly outside the globe,
  // varied phase and speed (some clockwise, some counter-clockwise).
  const orbits = useMemo<OrbitParams[]>(() => {
    return items.map(() => {
      const axis = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ).normalize();
      // Build an orthonormal basis (u, v) perpendicular to axis
      const helper =
        Math.abs(axis.y) < 0.95
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(1, 0, 0);
      const u = new THREE.Vector3().crossVectors(axis, helper).normalize();
      const v = new THREE.Vector3().crossVectors(axis, u).normalize();
      const r = radius * (1.15 + Math.random() * 0.45);
      const phase = Math.random() * Math.PI * 2;
      const dir = Math.random() < 0.5 ? -1 : 1;
      const speed = dir * (0.18 + Math.random() * 0.32);
      return { u, v, radius: r, phase, speed };
    });
  }, [items, radius]);

  const startPositions = useMemo(
    () =>
      orbits.map(() => {
        const dir = new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
        ).normalize();
        const dist = radius * (3 + Math.random() * 2);
        return dir.multiplyScalar(dist);
      }),
    [orbits, radius],
  );
  const formStartRef = useRef<number | null>(null);
  const [formStart, setFormStart] = useState(0);
  useFrame(({ clock }) => {
    if (formStartRef.current === null) {
      formStartRef.current = clock.getElapsedTime();
      setFormStart(formStartRef.current);
    }
  });

  return (
    <group ref={group} rotation={[0.35, 0, 0]}>
      <WireSphere radius={radius} />
      {items.map((it, i) => (
        <LogoTile
          key={it.name + i}
          orbit={orbits[i]}
          startPosition={startPositions[i]}
          formStart={formStart}
          formDuration={1.8}
          item={it}
          size={tileSize}
          onSelect={onSelect}
          paused={paused}
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
  const tileSize = isMobile ? 0.48 : 0.544;
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
      onCreated={({ gl }) => {
        // preventDefault lets the browser fire 'webglcontextrestored'
        // so r3f can rebuild after GPU pressure or tab switches.
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
