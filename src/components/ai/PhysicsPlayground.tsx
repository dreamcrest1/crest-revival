import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import type { AiTool } from '@/hooks/useAiTools';
import { metaForTool } from '@/data/aiToolMeta';
import { slugifyAiTool } from '@/lib/aiToolSeo';

/* ─────────────────────────── Texture cache ─────────────────────────── */
/**
 * Procedurally render each chip face on a 2D canvas, then upload it once
 * as a Three texture. Much cheaper at runtime than HTML overlays.
 */
const textureCache = new Map<string, THREE.CanvasTexture>();

function loadImageSafe(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function buildChipTexture(t: AiTool): Promise<THREE.CanvasTexture> {
  const cached = textureCache.get(t.id);
  if (cached) return cached;

  const meta = metaForTool(t.name);
  const W = 512;
  const H = 288;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Brand background with subtle radial sheen
  const grad = ctx.createRadialGradient(W * 0.3, H * 0.25, 20, W * 0.5, H * 0.5, W * 0.8);
  grad.addColorStop(0, lighten(meta.color, 0.15));
  grad.addColorStop(1, darken(meta.color, 0.2));
  ctx.fillStyle = grad;
  roundRect(ctx, 0, 0, W, H, 36);
  ctx.fill();

  // Pill border
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  roundRect(ctx, 2, 2, W - 4, H - 4, 34);
  ctx.stroke();

  const onDark = luma(meta.color) < 0.55;
  const fg = onDark ? '#ffffff' : '#111111';

  // Try to load a logo — fall back to symbol if none load
  const sources: string[] = [];
  if (meta.logo) sources.push(meta.logo);
  if (meta.domain) {
    sources.push(`https://logo.clearbit.com/${meta.domain}?size=256`);
    sources.push(`https://www.google.com/s2/favicons?domain=${meta.domain}&sz=256`);
  }

  let img: HTMLImageElement | null = null;
  for (const src of sources) {
    img = await loadImageSafe(src);
    if (img) break;
  }

  // Left circular logo plate
  const plateR = H * 0.32;
  const plateX = H * 0.5;
  const plateY = H * 0.5;
  ctx.save();
  ctx.beginPath();
  ctx.arc(plateX, plateY, plateR, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.clip();
  if (img) {
    const pad = plateR * 0.32;
    const size = (plateR - pad) * 2;
    ctx.drawImage(img, plateX - size / 2, plateY - size / 2, size, size);
  } else {
    ctx.fillStyle = meta.color;
    ctx.font = 'bold 64px system-ui, -apple-system, Segoe UI, Roboto';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.symbol || t.name[0] || '?', plateX, plateY);
  }
  ctx.restore();

  // Tool name
  ctx.fillStyle = fg;
  ctx.font = 'bold 40px system-ui, -apple-system, Segoe UI, Roboto';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const textX = plateX + plateR + 28;
  const maxTextW = W - textX - 28;
  drawClippedText(ctx, t.name, textX, plateY - 14, maxTextW);

  // Validity pill below name
  ctx.font = '600 22px system-ui, -apple-system, Segoe UI, Roboto';
  ctx.fillStyle = onDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.7)';
  ctx.fillText(t.validity, textX, plateY + 26);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  textureCache.set(t.id, tex);
  return tex;
}

/* ─────────────────────────── Helpers ─────────────────────────── */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function drawClippedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number) {
  let t = text;
  while (ctx.measureText(t + '…').width > maxW && t.length > 1) t = t.slice(0, -1);
  ctx.fillText(t.length < text.length ? t + '…' : t, x, y);
}
function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function luma(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function lighten(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) => Math.min(255, Math.round(c + (255 - c) * amt));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function darken(hex: string, amt: number) {
  const { r, g, b } = hexToRgb(hex);
  const f = (c: number) => Math.max(0, Math.round(c * (1 - amt)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}

/* ─────────────────────────── Chip body ─────────────────────────── */
const CHIP_W = 2.6;
const CHIP_H = 1.45;
const CHIP_D = 0.35;

function Chip({
  tool,
  index,
  onPick,
  registerBody,
}: {
  tool: AiTool;
  index: number;
  onPick: (id: string, tool: AiTool) => void;
  registerBody: (id: string, api: any, mesh: THREE.Object3D) => void;
}) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  useEffect(() => {
    let live = true;
    buildChipTexture(tool).then((tex) => {
      if (live) setTexture(tex);
    });
    return () => {
      live = false;
    };
  }, [tool]);

  // Stagger initial drop positions so they fall in waves, not on top of each other.
  const initial = useMemo(() => {
    const cols = 6;
    const col = index % cols;
    const row = Math.floor(index / cols);
    return [
      (col - cols / 2) * (CHIP_W * 0.9) + (Math.random() - 0.5) * 0.6,
      8 + row * 1.6 + Math.random() * 2,
      (Math.random() - 0.5) * 0.4,
    ] as [number, number, number];
  }, [index]);

  const initialRot = useMemo(
    () =>
      [
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
      ] as [number, number, number],
    [],
  );

  const [ref, api] = useBox<THREE.Mesh>(() => ({
    mass: 1,
    position: initial,
    rotation: initialRot,
    args: [CHIP_W, CHIP_H, CHIP_D],
    linearDamping: 0.35,
    angularDamping: 0.45,
    material: { friction: 0.4, restitution: 0.25 },
  }));

  useEffect(() => {
    if (ref.current) registerBody(tool.id, api, ref.current);
  }, [api, ref, registerBody, tool.id]);

  // Mouse-down records a starting point so a tiny drag still registers as click.
  const downPos = useRef<{ x: number; y: number; t: number } | null>(null);

  return (
    <mesh
      ref={ref}
      castShadow
      receiveShadow
      onPointerDown={(e) => {
        e.stopPropagation();
        downPos.current = { x: e.clientX, y: e.clientY, t: performance.now() };
        onPick(tool.id, tool);
      }}
      onPointerUp={(e) => {
        const d = downPos.current;
        downPos.current = null;
        if (!d) return;
        const dist = Math.hypot(e.clientX - d.x, e.clientY - d.y);
        const elapsed = performance.now() - d.t;
        if (dist < 6 && elapsed < 350) {
          // Treat as a click — handled by parent via custom event so we can use navigate hook there.
          window.dispatchEvent(new CustomEvent('chip-click', { detail: { tool } }));
        }
      }}
    >
      <boxGeometry args={[CHIP_W, CHIP_H, CHIP_D]} />
      {/* 6 face materials — only front/back show the texture, sides match brand color */}
      {Array.from({ length: 6 }).map((_, i) =>
        i === 4 || i === 5 ? (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            map={texture ?? undefined}
            color={texture ? '#ffffff' : metaForTool(tool.name).color}
            roughness={0.55}
            metalness={0.05}
          />
        ) : (
          <meshStandardMaterial
            key={i}
            attach={`material-${i}`}
            color={darken(metaForTool(tool.name).color, 0.35)}
            roughness={0.7}
            metalness={0.1}
          />
        ),
      )}
    </mesh>
  );
}

/* ─────────────────────────── Walls ─────────────────────────── */
function Walls({ bounds }: { bounds: { w: number; h: number; d: number } }) {
  return (
    <>
      <FloorPlane y={-bounds.h / 2} />
      <SidePlane position={[0, bounds.h / 2, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <SidePlane position={[-bounds.w / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <SidePlane position={[bounds.w / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <SidePlane position={[0, 0, -bounds.d / 2]} rotation={[0, 0, 0]} />
      <SidePlane position={[0, 0, bounds.d / 2]} rotation={[0, Math.PI, 0]} />
    </>
  );
}
function FloorPlane({ y }: { y: number }) {
  const [ref] = usePlane<THREE.Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, y, 0],
    material: { friction: 0.4, restitution: 0.15 },
  }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[200, 200]} />
      <shadowMaterial opacity={0.25} />
    </mesh>
  );
}
function SidePlane({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const [ref] = usePlane<THREE.Mesh>(() => ({ position, rotation }));
  return <mesh ref={ref} visible={false} />;
}

/* ─────────────────────────── Mouse picker ───────────────────────────
 * Cannon-es kinematic body anchored to the cursor's intersection with a
 * world-aligned plane. While a chip is picked, we point-to-point
 * constrain its body to the cursor body so it follows naturally and
 * keeps physics correct against the other chips. */
function CursorAnchor({
  picked,
  onClear,
  bodies,
}: {
  picked: { id: string } | null;
  onClear: () => void;
  bodies: Map<string, { api: any; mesh: THREE.Object3D }>;
}) {
  const { camera, gl, size } = useThree();
  const [anchorRef, anchorApi] = useSphere<THREE.Mesh>(() => ({
    type: 'Kinematic',
    args: [0.15],
    position: [0, 0, 10],
    collisionResponse: false,
  }));

  const pointer = useRef(new THREE.Vector2());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onUp = () => onClear();
    el.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [gl, onClear, size]);

  // Lock the drag plane to the picked chip's current Z so dragging feels 1:1.
  useEffect(() => {
    if (!picked) return;
    const body = bodies.get(picked.id);
    if (!body) return;
    const z = body.mesh.position.z;
    dragPlane.constant = -z;
  }, [picked, bodies, dragPlane]);

  useFrame(() => {
    raycaster.setFromCamera(pointer.current, camera);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(dragPlane, target);
    if (target) anchorApi.position.set(target.x, target.y, target.z);

    if (picked) {
      const body = bodies.get(picked.id);
      if (body) {
        // Apply velocity toward cursor — simpler & more stable than runtime constraints
        const p = body.mesh.position;
        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const dz = target.z - p.z;
        body.api.velocity.set(dx * 18, dy * 18, dz * 18);
        body.api.angularDamping.set(0.95);
      }
    }
  });

  return (
    <mesh ref={anchorRef} visible={false}>
      <sphereGeometry args={[0.15, 8, 8]} />
    </mesh>
  );
}

/* ─────────────────────────── Scene root ─────────────────────────── */
function Scene({ tools }: { tools: AiTool[] }) {
  const { viewport } = useThree();
  const bodies = useRef<Map<string, { api: any; mesh: THREE.Object3D }>>(new Map());
  const [picked, setPicked] = useState<{ id: string } | null>(null);

  const registerBody = useCallback((id: string, api: any, mesh: THREE.Object3D) => {
    bodies.current.set(id, { api, mesh });
  }, []);

  const bounds = useMemo(
    () => ({ w: Math.max(viewport.width, 16), h: Math.max(viewport.height, 10), d: 4 }),
    [viewport.width, viewport.height],
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[6, 10, 8]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-8, 4, -4]} intensity={0.3} color="#ffb070" />

      <Physics
        gravity={[0, -14, 0]}
        defaultContactMaterial={{ friction: 0.4, restitution: 0.2 }}
        iterations={12}
      >
        <Walls bounds={bounds} />
        {tools.map((t, i) => (
          <Chip
            key={t.id}
            tool={t}
            index={i}
            registerBody={registerBody}
            onPick={(id) => setPicked({ id })}
          />
        ))}
        <CursorAnchor picked={picked} onClear={() => setPicked(null)} bodies={bodies.current} />
      </Physics>
    </>
  );
}

/* ─────────────────────────── Public component ─────────────────────────── */
interface PlaygroundProps {
  tools: AiTool[];
  /** Cap on simulated chips for perf — keep under ~40 on mid-range laptops. */
  maxChips?: number;
}

export default function PhysicsPlayground({ tools, maxChips = 32 }: PlaygroundProps) {
  const navigate = useNavigate();
  const slice = useMemo(() => tools.slice(0, maxChips), [tools, maxChips]);

  useEffect(() => {
    const onClick = (e: Event) => {
      const tool = (e as CustomEvent<{ tool: AiTool }>).detail.tool;
      navigate(`/ai-tool/${slugifyAiTool(tool.name)}`);
    };
    window.addEventListener('chip-click', onClick as EventListener);
    return () => window.removeEventListener('chip-click', onClick as EventListener);
  }, [navigate]);

  return (
    <div className="relative w-full h-[60vh] min-h-[420px] rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-b from-background/40 via-background/20 to-primary/5 backdrop-blur shadow-2xl">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 14], fov: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene tools={slice} />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute top-3 left-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/70">
        Arsenal Playground
      </div>
      <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-medium text-muted-foreground bg-card/60 backdrop-blur border border-border/60 rounded-full px-3 py-1">
        Drag • Throw • Click to open
      </div>
    </div>
  );
}
