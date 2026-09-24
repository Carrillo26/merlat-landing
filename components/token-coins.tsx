"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  CanvasTexture,
  CircleGeometry,
  Color,
  EquirectangularReflectionMapping,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  NoColorSpace,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  type Texture,
  type WebGLRenderTarget,
} from "three";

/** Evenly spaced subset so phones draw six coins instead of ten. */
const MOBILE_SLOTS = new Set([0, 2, 4, 5, 7, 9]);
const MOBILE_QUERY = "(max-width: 799px)";
const MARK_SRC = "/merlat-mark.png";

/** SVG monogram from archive/github-pages/assets/logo.svg — fallback if the PNG mark fails. */
const MARK_PATH =
  "M7 30V10h4.4l3.8 10.4L19 10h4.4v20h-3.6V16.6L16.4 30h-3.2L9.8 16.6V30H7z";

const PALETTE = [
  "#ff8fb6",
  "#cbb6ff",
  "#7fd4ff",
  "#4d90ff",
  "#ffc2a8",
  "#f0ce8c",
  "#ff9cc8",
  "#b7a4ff",
  "#8ad8ff",
  "#ffd0b4",
];

type CoinSpec = {
  phase: number;
  orbit: number;
  spinX: number;
  spinY: number;
  spinZ: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  rx: number;
  ry: number;
  depth: number;
  size: number;
  color: string;
  rough: number;
  thickness: [number, number];
};

type Coin = CoinSpec & {
  group: Group;
  materials: MeshPhysicalMaterial[];
  tumble: boolean;
};

/** These three pass through edge-on; the rest stay readable and spin in-plane. */
const TUMBLE_SLOTS = new Set([2, 5, 8]);

const SPECS: CoinSpec[] = [
  { phase: 0.15, orbit: 0.11, spinX: 0.05, spinY: 0.42, spinZ: 0.08, tiltX: 0.18, tiltY: 0.25, tiltZ: 0.12, rx: 1.02, ry: 1.12, depth: 0.55, size: 0.3, color: PALETTE[0], rough: 0.06, thickness: [140, 420] },
  { phase: 0.72, orbit: 0.1, spinX: -0.04, spinY: 0.55, spinZ: -0.12, tiltX: 0.42, tiltY: 1.05, tiltZ: -0.2, rx: 1.08, ry: 1.06, depth: -0.7, size: 0.24, color: PALETTE[1], rough: 0.09, thickness: [180, 520] },
  { phase: 1.35, orbit: -0.09, spinX: 0.08, spinY: 0.33, spinZ: 0.18, tiltX: 0.12, tiltY: 1.48, tiltZ: 0.35, rx: 0.98, ry: 1.16, depth: 1.05, size: 0.2, color: PALETTE[2], rough: 0.07, thickness: [100, 340] },
  { phase: 1.95, orbit: 0.12, spinX: -0.06, spinY: -0.48, spinZ: 0.1, tiltX: -0.32, tiltY: 0.55, tiltZ: 0.48, rx: 1.12, ry: 1.04, depth: -0.25, size: 0.28, color: PALETTE[3], rough: 0.05, thickness: [220, 560] },
  { phase: 2.55, orbit: 0.095, spinX: 0.1, spinY: 0.38, spinZ: -0.2, tiltX: 0.5, tiltY: 0.18, tiltZ: -0.42, rx: 1.0, ry: 1.18, depth: 0.85, size: 0.22, color: PALETTE[4], rough: 0.1, thickness: [120, 400] },
  { phase: 3.2, orbit: -0.105, spinX: -0.05, spinY: 0.62, spinZ: 0.14, tiltX: -0.22, tiltY: 1.32, tiltZ: 0.7, rx: 1.1, ry: 1.08, depth: -1.15, size: 0.32, color: PALETTE[5], rough: 0.08, thickness: [160, 480] },
  { phase: 3.85, orbit: 0.115, spinX: 0.07, spinY: 0.28, spinZ: -0.16, tiltX: 0.28, tiltY: 0.72, tiltZ: -0.18, rx: 0.96, ry: 1.14, depth: 0.2, size: 0.21, color: PALETTE[6], rough: 0.06, thickness: [200, 500] },
  { phase: 4.45, orbit: 0.088, spinX: -0.09, spinY: 0.5, spinZ: 0.22, tiltX: 0.08, tiltY: 0.08, tiltZ: 0.85, rx: 1.14, ry: 1.02, depth: 1.35, size: 0.17, color: PALETTE[7], rough: 0.12, thickness: [90, 300] },
  { phase: 5.05, orbit: -0.098, spinX: 0.06, spinY: -0.4, spinZ: -0.1, tiltX: 0.62, tiltY: 1.15, tiltZ: 0.22, rx: 1.04, ry: 1.1, depth: -0.45, size: 0.26, color: PALETTE[8], rough: 0.07, thickness: [150, 460] },
  { phase: 5.7, orbit: 0.108, spinX: -0.03, spinY: 0.36, spinZ: 0.15, tiltX: -0.16, tiltY: 0.4, tiltZ: -0.55, rx: 1.06, ry: 1.15, depth: 0.4, size: 0.23, color: PALETTE[9], rough: 0.09, thickness: [240, 580] },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load ${src}`));
    image.src = src;
  });
}

function paintFallbackMark(ctx: CanvasRenderingContext2D, size: number) {
  ctx.save();
  const scale = (size * 0.62) / 40;
  ctx.translate(size * 0.19, size * 0.2);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#fff";
  ctx.fill(new Path2D(MARK_PATH));
  ctx.fillRect(28, 10, 5, 5);
  ctx.restore();
}

/** Build a small albedo + bump pair. Grooves are the real Merlat M, plus a mint ring. */
function buildFaceMaps(mark: HTMLImageElement | null, renderer: WebGLRenderer): {
  albedo: CanvasTexture;
  bump: CanvasTexture;
  rough: CanvasTexture;
} {
  const size = 512;
  const albedoCanvas = document.createElement("canvas");
  const bumpCanvas = document.createElement("canvas");
  const roughCanvas = document.createElement("canvas");
  albedoCanvas.width = bumpCanvas.width = roughCanvas.width = size;
  albedoCanvas.height = bumpCanvas.height = roughCanvas.height = size;
  const albedoCtx = albedoCanvas.getContext("2d");
  const bumpCtx = bumpCanvas.getContext("2d");
  const roughCtx = roughCanvas.getContext("2d");
  if (!albedoCtx || !bumpCtx || !roughCtx) {
    throw new Error("2D canvas unavailable");
  }

  const mask = document.createElement("canvas");
  mask.width = size;
  mask.height = size;
  const maskCtx = mask.getContext("2d", { willReadFrequently: true });
  if (!maskCtx) throw new Error("2D canvas unavailable");
  maskCtx.clearRect(0, 0, size, size);
  maskCtx.fillStyle = "#fff";
  if (mark) {
    maskCtx.drawImage(mark, 0, 0, size, size);
  } else {
    paintFallbackMark(maskCtx, size);
  }

  const src = maskCtx.getImageData(0, 0, size, size);
  const groove = new Float32Array(size * size);
  for (let i = 0; i < size * size; i++) {
    const r = src.data[i * 4];
    const g = src.data[i * 4 + 1];
    const b = src.data[i * 4 + 2];
    const alpha = src.data[i * 4 + 3] / 255;
    const whiteness = Math.min(1, Math.max(0, (g - 70) / 150));
    const ink = r < 70 && g < 70 && b < 70 ? alpha : 0;
    groove[i] = Math.max(whiteness, ink);
  }

  // Soften the stamp edge so the relief reads as a bevel, not a pixel cliff.
  const blurred = new Float32Array(size * size);
  const radius = 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = 0;
      let count = 0;
      for (let ky = -radius; ky <= radius; ky++) {
        const yy = y + ky;
        if (yy < 0 || yy >= size) continue;
        for (let kx = -radius; kx <= radius; kx++) {
          const xx = x + kx;
          if (xx < 0 || xx >= size) continue;
          sum += groove[yy * size + xx];
          count++;
        }
      }
      blurred[y * size + x] = sum / count;
    }
  }

  albedoCtx.fillStyle = "#ffffff";
  albedoCtx.fillRect(0, 0, size, size);
  const albedoData = albedoCtx.getImageData(0, 0, size, size);
  const bumpData = bumpCtx.createImageData(size, size);
  const roughData = roughCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = (x + 0.5) / size - 0.5;
      const cy = (y + 0.5) / size - 0.5;
      const dist = Math.hypot(cx, cy);
      const ringA = Math.exp(-((dist - 0.4) ** 2) / (2 * 0.007 ** 2));
      const ringB = Math.exp(-((dist - 0.455) ** 2) / (2 * 0.005 ** 2));
      const stamp = blurred[y * size + x];
      const depth = Math.min(1, stamp * 0.92 + ringA * 0.55 + ringB * 0.4);
      const i = (y * size + x) * 4;
      const shade = Math.round(255 * (1 - depth * 0.94));
      albedoData.data[i] = shade;
      albedoData.data[i + 1] = shade;
      albedoData.data[i + 2] = shade;
      albedoData.data[i + 3] = 255;
      const height = Math.round(210 - depth * 175);
      bumpData.data[i] = height;
      bumpData.data[i + 1] = height;
      bumpData.data[i + 2] = height;
      bumpData.data[i + 3] = 255;
      const rough = Math.round(255 * (0.1 + depth * 0.9));
      roughData.data[i] = rough;
      roughData.data[i + 1] = rough;
      roughData.data[i + 2] = rough;
      roughData.data[i + 3] = 255;
    }
  }

  albedoCtx.putImageData(albedoData, 0, 0);
  bumpCtx.putImageData(bumpData, 0, 0);
  roughCtx.putImageData(roughData, 0, 0);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const albedo = new CanvasTexture(albedoCanvas);
  albedo.colorSpace = SRGBColorSpace;
  albedo.anisotropy = Math.min(8, maxAniso);
  albedo.needsUpdate = true;

  const bump = new CanvasTexture(bumpCanvas);
  bump.colorSpace = NoColorSpace;
  bump.anisotropy = Math.min(8, maxAniso);
  bump.needsUpdate = true;

  const rough = new CanvasTexture(roughCanvas);
  rough.colorSpace = NoColorSpace;
  rough.anisotropy = Math.min(8, maxAniso);
  rough.needsUpdate = true;

  return { albedo, bump, rough };
}

function paintEnvironment(): HTMLCanvasElement {
  const width = 512;
  const height = 256;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.fillStyle = "#07060a";
  ctx.fillRect(0, 0, width, height);

  const blobs: { x: number; y: number; r: number; color: string }[] = [
    { x: 0.12, y: 0.32, r: 0.34, color: "rgba(255, 92, 168, 0.95)" },
    { x: 0.7, y: 0.22, r: 0.3, color: "rgba(90, 206, 255, 0.92)" },
    { x: 0.46, y: 0.78, r: 0.36, color: "rgba(255, 176, 112, 0.9)" },
    { x: 0.86, y: 0.58, r: 0.26, color: "rgba(64, 112, 255, 0.9)" },
    { x: 0.3, y: 0.58, r: 0.24, color: "rgba(188, 146, 255, 0.8)" },
    { x: 0.55, y: 0.16, r: 0.14, color: "rgba(255, 228, 196, 0.85)" },
    { x: 0.08, y: 0.82, r: 0.2, color: "rgba(255, 140, 188, 0.75)" },
    { x: 0.94, y: 0.18, r: 0.16, color: "rgba(255, 214, 140, 0.7)" },
  ];

  for (const blob of blobs) {
    const x = blob.x * width;
    const y = blob.y * height;
    const radius = blob.r * width;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, blob.color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  for (const [x, y, radius] of [
    [0.18, 0.3, 7],
    [0.68, 0.2, 5],
    [0.48, 0.72, 4],
    [0.84, 0.5, 3],
  ] as const) {
    ctx.beginPath();
    ctx.arc(x * width, y * height, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

function createEnvironment(renderer: WebGLRenderer): { target: WebGLRenderTarget; source: Texture } {
  const canvas = paintEnvironment();
  const source = new CanvasTexture(canvas);
  source.mapping = EquirectangularReflectionMapping;
  source.colorSpace = SRGBColorSpace;
  source.needsUpdate = true;
  const pmrem = new PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const target = pmrem.fromEquirectangular(source);
  pmrem.dispose();
  return { target, source };
}

function createCoinGeometry(): { body: LatheGeometry; face: CircleGeometry; half: number } {
  const half = 0.105;
  const lip = 0.028;
  // Rim only — the engraved faces are separate discs, so the mark cannot be buried.
  const points = [
    new Vector2(0.74, half),
    new Vector2(0.82, half + lip),
    new Vector2(0.9, half * 0.42),
    new Vector2(0.965, half * 0.12),
    new Vector2(1, 0),
    new Vector2(0.965, -half * 0.12),
    new Vector2(0.9, -half * 0.42),
    new Vector2(0.82, -(half + lip)),
    new Vector2(0.74, -half),
  ];
  const body = new LatheGeometry(points, 72);
  body.computeVertexNormals();
  const face = new CircleGeometry(0.78, 56);
  return { body, face, half };
}

function superellipse(theta: number, rx: number, ry: number, n = 3.2) {
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const p = 2 / n;
  return {
    x: Math.sign(c) * rx * Math.abs(c) ** p,
    y: Math.sign(s) * ry * Math.abs(s) ** p,
  };
}

function mountCoins(host: HTMLElement, mark: HTMLImageElement | null): () => void {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
    });
  } catch {
    return () => {};
  }

  renderer.setClearColor(0x000000, 1);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  scene.background = new Color(0x000000);
  scene.environmentIntensity = 1.25;

  const camera = new PerspectiveCamera(34, 1, 0.1, 40);
  camera.position.set(0, 0, 8.5);

  let env: { target: WebGLRenderTarget; source: Texture } | null = null;
  let maps: { albedo: CanvasTexture; bump: CanvasTexture; rough: CanvasTexture } | null = null;
  try {
    env = createEnvironment(renderer);
    scene.environment = env.target.texture;
    maps = buildFaceMaps(mark, renderer);
  } catch {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    return () => {};
  }

  const { body, face, half } = createCoinGeometry();
  const coins: Coin[] = SPECS.map((spec, index) => {
    const tumble = TUMBLE_SLOTS.has(index);
    const group = new Group();
    const bodyMat = new MeshPhysicalMaterial({
      color: spec.color,
      metalness: 1,
      roughness: spec.rough,
      iridescence: 1,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: spec.thickness,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.45,
    });
    const faceMat = new MeshPhysicalMaterial({
      color: spec.color,
      map: maps.albedo,
      bumpMap: maps.bump,
      bumpScale: 0.35,
      roughnessMap: maps.rough,
      metalness: 1,
      roughness: 0.62,
      iridescence: 0.65,
      iridescenceIOR: 1.28,
      iridescenceThicknessRange: spec.thickness,
      clearcoat: 0.12,
      clearcoatRoughness: 0.35,
      envMapIntensity: 1.05,
    });

    const shell = new Mesh(body, bodyMat);
    shell.rotation.x = Math.PI / 2;
    const front = new Mesh(face, faceMat);
    front.position.z = half + 0.004;
    const back = new Mesh(face, faceMat);
    back.position.z = -(half + 0.004);
    back.rotation.y = Math.PI;
    back.scale.x = -1;
    group.add(shell, front, back);
    scene.add(group);
    return { ...spec, tumble, group, materials: [bodyMat, faceMat] };
  });

  const rig = new Group();
  const lights: { color: number; position: [number, number, number]; intensity: number }[] = [
    { color: 0xff5fa8, position: [5.2, 2.4, 6], intensity: 110 },
    { color: 0x6ecbff, position: [-5.4, 1.6, 5.2], intensity: 100 },
    { color: 0xffc49a, position: [1.8, -3.6, 4.4], intensity: 80 },
    { color: 0xc2a6ff, position: [-2.2, 4.2, 3.2], intensity: 70 },
    { color: 0xffe2b0, position: [0.4, -0.6, 7.2], intensity: 46 },
    { color: 0x3d78ff, position: [5.5, -2.4, -2.5], intensity: 54 },
  ];
  for (const light of lights) {
    const point = new PointLight(light.color, light.intensity, 0, 2);
    point.position.set(...light.position);
    rig.add(point);
  }
  scene.add(rig);
  scene.add(new AmbientLight(0x140c18, 0.35));

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  let reduced = motionQuery.matches;
  let visible = false;
  let running = false;
  let raf = 0;
  let elapsed = 0;
  let last = performance.now();

  const halfExtents = (depth: number) => {
    const distance = Math.max(2.8, camera.position.z - depth);
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * distance;
    return { halfH, halfW: halfH * camera.aspect };
  };

  const place = (time: number) => {
    const narrow = mobileQuery.matches || camera.aspect < 0.92;
    const { halfH } = halfExtents(0);
    const unit = halfH * (narrow ? 0.82 : 1);
    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i];
      const show = narrow ? MOBILE_SLOTS.has(i) : true;
      coin.group.visible = show;
      if (!show) continue;
      const motion = reduced ? 0 : time;
      const angle = coin.phase + motion * coin.orbit * 1.45;
      const ext = halfExtents(coin.depth);
      const point = superellipse(angle, ext.halfW * coin.rx, ext.halfH * coin.ry);
      coin.group.position.set(point.x, point.y, coin.depth);
      coin.group.scale.setScalar(unit * coin.size);
      const yaw = coin.tumble
        ? coin.tiltY + motion * coin.spinY
        : Math.min(coin.tiltY, 0.5) + Math.sin(motion * 0.45 + coin.phase) * 0.3;
      const pitch = coin.tumble
        ? coin.tiltX + motion * coin.spinX
        : coin.tiltX * 0.35 + Math.sin(motion * 0.28 + coin.phase) * 0.1;
      const roll = coin.tiltZ + motion * (coin.tumble ? coin.spinZ : 0.62 * (coin.spinZ < 0 ? -1 : 1));
      coin.group.rotation.set(pitch, yaw, roll);
    }
    if (!reduced) rig.rotation.y = time * 0.18;
  };

  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width < 2 || height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, width < 800 ? 1.25 : 1.6);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    place(elapsed);
    renderer.render(scene, camera);
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    elapsed += dt;
    place(elapsed);
    renderer.render(scene, camera);
  };

  const stopLoop = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const startLoop = () => {
    if (running || reduced || !visible) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const onMotion = () => {
    reduced = motionQuery.matches;
    if (reduced) {
      stopLoop();
      place(elapsed);
      renderer.render(scene, camera);
    } else {
      startLoop();
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) startLoop();
      else stopLoop();
    },
    { threshold: 0.02 },
  );
  observer.observe(host);

  const onViewport = () => {
    place(elapsed);
    renderer.render(scene, camera);
  };

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(host);
  motionQuery.addEventListener("change", onMotion);
  mobileQuery.addEventListener("change", onViewport);

  resize();
  if (!reduced && visible) startLoop();

  return () => {
    stopLoop();
    observer.disconnect();
    resizeObserver.disconnect();
    motionQuery.removeEventListener("change", onMotion);
    mobileQuery.removeEventListener("change", onViewport);
    for (const coin of coins) {
      coin.group.removeFromParent();
      for (const material of coin.materials) material.dispose();
    }
    body.dispose();
    face.dispose();
    maps.albedo.dispose();
    maps.bump.dispose();
    maps.rough.dispose();
    env.source.dispose();
    env.target.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}

function startTokenCoins(host: HTMLElement): () => void {
  let disposed = false;
  let stop = () => {};

  void (async () => {
    let mark: HTMLImageElement | null = null;
    try {
      mark = await loadImage(MARK_SRC);
    } catch {
      mark = null;
    }
    if (disposed) return;
    stop = mountCoins(host, mark);
  })();

  return () => {
    disposed = true;
    stop();
  };
}

export default function TokenCoins() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    return startTokenCoins(host);
  }, []);

  return <div ref={hostRef} className="token-coins" aria-hidden="true" />;
}
