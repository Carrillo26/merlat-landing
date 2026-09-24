"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Texture,
  Vector2,
  WebGLRenderer,
} from "three";

/**
 * Iridescent Merlat coins for the Token section.
 * Face relief is sampled from public/merlat-mark.png — the real Sí/No mark:
 * a circle split by a vertical gap, solid on the left, stroked on the right.
 */

const MARK_URL = "/merlat-mark.png";
const MARK_SIZE = 512;
/** Glyph radius in the source image (px from center to the outer stroke). */
const GLYPH_RADIUS_PX = 176;
/** That glyph radius mapped onto the coin face (coin radius is 1). */
const MARK_RADIUS = 0.8;
const FACE_RADIUS = 0.928;
const HALF_THICKNESS = 0.072;
const FACE_RINGS = 96;
const FACE_SEGMENTS = 280;

const MOBILE_QUERY = "(max-width: 760px)";

type CoinSpec = {
  /** Resting orbit angle. 0 is screen-right, π/2 is screen-up. */
  angle: number;
  /** Distance from center as a fraction of the frame. >1 clips the coin. */
  ring: number;
  z: number;
  scale: number;
  rotX: number;
  roll: number;
  yaw: number;
  orbit: number;
  spin: number;
  phase: number;
  mobile: boolean;
};

const COINS: CoinSpec[] = [
  { angle: 2.45, ring: 0.98, z: 0.4, scale: 1.16, rotX: 1.36, roll: 0.18, yaw: 0.1, orbit: 0.08, spin: 0.36, phase: 0.2, mobile: true },
  { angle: 3.12, ring: 1.05, z: -0.45, scale: 0.92, rotX: 0.38, roll: 0.06, yaw: 0.65, orbit: 0.055, spin: -0.5, phase: 1.1, mobile: true },
  { angle: 3.78, ring: 0.9, z: 1.15, scale: 1.32, rotX: 1.5, roll: -0.16, yaw: -0.2, orbit: 0.095, spin: 0.28, phase: 2.15, mobile: true },
  { angle: 4.35, ring: 1.03, z: 0.08, scale: 0.7, rotX: 0.26, roll: 0.58, yaw: 1.0, orbit: 0.12, spin: 0.62, phase: 0.5, mobile: false },
  { angle: 4.95, ring: 0.95, z: -0.75, scale: 0.62, rotX: 1.18, roll: -0.32, yaw: 0.4, orbit: -0.065, spin: -0.32, phase: 1.65, mobile: true },
  { angle: 5.52, ring: 0.93, z: 0.95, scale: 1.22, rotX: 1.55, roll: 0.08, yaw: 0.02, orbit: 0.085, spin: 0.42, phase: 2.6, mobile: true },
  { angle: 0.06, ring: 1.06, z: 0.18, scale: 1.12, rotX: 0.46, roll: -0.14, yaw: 0.8, orbit: 0.07, spin: -0.38, phase: 0.3, mobile: false },
  { angle: 0.78, ring: 0.97, z: -0.2, scale: 1.08, rotX: 1.34, roll: 0.3, yaw: -0.35, orbit: 0.05, spin: 0.26, phase: 1.3, mobile: true },
  { angle: 1.42, ring: 1.04, z: 0.48, scale: 0.76, rotX: 0.3, roll: 0.9, yaw: 0.25, orbit: -0.1, spin: 0.55, phase: 2.4, mobile: false },
  { angle: 1.92, ring: 0.91, z: -1.1, scale: 0.56, rotX: 1.08, roll: -0.2, yaw: 1.1, orbit: 0.125, spin: -0.46, phase: 3.0, mobile: false },
  { angle: 2.88, ring: 0.88, z: 0.55, scale: 0.68, rotX: 1.22, roll: 0.1, yaw: -0.65, orbit: -0.075, spin: 0.4, phase: 0.8, mobile: false },
];

type MarkField = Float32Array;

export default function TokenCoins() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let teardown = () => {};

    loadMarkField()
      .then((field) => {
        if (disposed) return;
        teardown = mountCoins(host, field);
      })
      .catch(() => {
        if (disposed) return;
        teardown = mountCoins(host, proceduralMark());
      });

    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  return <div ref={hostRef} className="token-coins" aria-hidden="true" />;
}

function mountCoins(host: HTMLElement, field: MarkField): () => void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia(MOBILE_QUERY);

  const scene = new Scene();
  scene.background = new Color(0x000000);

  const camera = new PerspectiveCamera(30, 1, 0.1, 40);
  camera.position.set(0, 0, 7.7);

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      depth: true,
      stencil: false,
      powerPreference: "default",
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

  const envMap = createEnvironment(renderer);
  scene.environment = envMap;

  const metal = new MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 1,
    roughness: 0.2,
    envMapIntensity: 1.35,
    clearcoat: 0.65,
    clearcoatRoughness: 0.18,
    iridescence: 1,
    iridescenceIOR: 1.25,
    iridescenceThicknessRange: [180, 720],
    ior: 1.45,
  });
  const faceMetal = metal.clone();
  faceMetal.vertexColors = true;

  addLights(scene);

  const rimGeo = createRimGeometry();
  const frontGeo = createFaceGeometry(1, field);
  const backGeo = createFaceGeometry(-1, field);

  type Coin = { root: Group; tilt: Group; spin: Group; spec: CoinSpec };
  const coins: Coin[] = COINS.map((spec) => {
    const root = new Group();
    const tilt = new Group();
    const spin = new Group();
    spin.add(new Mesh(rimGeo, metal), new Mesh(frontGeo, faceMetal), new Mesh(backGeo, faceMetal));
    tilt.add(spin);
    root.add(tilt);
    scene.add(root);
    return { root, tilt, spin, spec };
  });

  const place = (elapsed: number) => {
    const compact = mobile.matches;
    const sizeMul = compact ? 0.8 : 1;
    for (const coin of coins) {
      const spec = coin.spec;
      coin.root.visible = !compact || spec.mobile;
      if (!coin.root.visible) continue;

      const angle = spec.angle + elapsed * spec.orbit;
      const breathe = 1 + Math.sin(elapsed * 0.35 + spec.phase) * 0.02;
      const { halfW, halfH } = frustumAt(camera, spec.z);
      coin.root.position.set(
        Math.cos(angle) * spec.ring * halfW * breathe,
        Math.sin(angle) * spec.ring * halfH * breathe,
        spec.z + Math.sin(elapsed * 0.22 + spec.phase) * 0.12,
      );
      coin.root.scale.setScalar(0.5 * spec.scale * sizeMul);
      coin.tilt.rotation.x = spec.rotX + Math.sin(elapsed * 0.28 + spec.phase) * 0.12;
      coin.tilt.rotation.z = spec.roll + Math.cos(elapsed * 0.2 + spec.phase) * 0.06;
      coin.spin.rotation.y = spec.yaw + elapsed * spec.spin;
    }
  };

  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width < 2 || height < 2) return;
    const dprCap = width < 800 ? 1.25 : 1.6;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  let raf = 0;
  let looping = false;
  const startedAt = performance.now();

  const renderFrame = (elapsed: number) => {
    place(elapsed);
    renderer.render(scene, camera);
  };

  const frame = (now: number) => {
    renderFrame((now - startedAt) / 1000);
    if (looping) raf = requestAnimationFrame(frame);
  };

  const syncLoop = () => {
    const shouldRun = !reduce.matches && !document.hidden && isInView(host);
    if (shouldRun && !looping) {
      looping = true;
      raf = requestAnimationFrame(frame);
      return;
    }
    if (!shouldRun && looping) {
      looping = false;
      cancelAnimationFrame(raf);
    }
    if (!shouldRun) renderFrame(reduce.matches ? 0 : (performance.now() - startedAt) / 1000);
  };

  resize();
  syncLoop();

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (!looping) syncLoop();
  });
  resizeObserver.observe(host);

  const intersection = new IntersectionObserver(syncLoop, { threshold: 0.02 });
  intersection.observe(host);

  const onPreference = () => syncLoop();
  reduce.addEventListener("change", onPreference);
  mobile.addEventListener("change", onPreference);
  document.addEventListener("visibilitychange", onPreference);

  return () => {
    looping = false;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersection.disconnect();
    reduce.removeEventListener("change", onPreference);
    mobile.removeEventListener("change", onPreference);
    document.removeEventListener("visibilitychange", onPreference);

    rimGeo.dispose();
    frontGeo.dispose();
    backGeo.dispose();
    metal.dispose();
    faceMetal.dispose();
    envMap.dispose();

    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement.parentElement === host) {
      host.removeChild(renderer.domElement);
    }
  };
}

function frustumAt(camera: PerspectiveCamera, z: number): { halfW: number; halfH: number } {
  const distance = Math.max(0.8, camera.position.z - z);
  const halfH = Math.tan((camera.fov * Math.PI) / 360) * distance;
  return { halfW: halfH * camera.aspect, halfH };
}

function isInView(host: HTMLElement): boolean {
  const rect = host.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

function addLights(scene: Scene) {
  const specs: [number, number, number, number, number][] = [
    [0xfff1f6, 2.4, 0.6, 1.2, 8.2],
    [0xff5ea8, 2.2, 6.2, 2.2, 4.4],
    [0x49d4ff, 2.1, -5.6, -1.4, 5.2],
    [0xffc56a, 1.8, 1.4, 5.2, 3.2],
    [0xb9a0ff, 1.6, -2.4, 3.2, 6.2],
    [0xff8a5a, 1.4, 4.6, -3.4, 2.8],
  ];
  for (const [color, intensity, x, y, z] of specs) {
    const light = new DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    scene.add(light);
  }
}

function createEnvironment(renderer: WebGLRenderer): Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const blank = new CanvasTexture(canvas);
    blank.mapping = EquirectangularReflectionMapping;
    blank.colorSpace = SRGBColorSpace;
    return pmrem(renderer, blank);
  }

  const wash = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  wash.addColorStop(0, "#3a1238");
  wash.addColorStop(0.45, "#12324c");
  wash.addColorStop(1, "#4a2614");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const blobs: { x: number; y: number; r: number; color: string }[] = [
    { x: 384, y: 128, r: 130, color: "rgba(255, 126, 186, 0.95)" },
    { x: 300, y: 90, r: 100, color: "rgba(70, 214, 255, 0.9)" },
    { x: 460, y: 150, r: 90, color: "rgba(255, 196, 110, 0.9)" },
    { x: 250, y: 170, r: 80, color: "rgba(176, 140, 255, 0.85)" },
    { x: 80, y: 70, r: 90, color: "rgba(255, 90, 160, 0.9)" },
    { x: 140, y: 190, r: 100, color: "rgba(255, 150, 90, 0.85)" },
    { x: 400, y: 40, r: 28, color: "rgba(255, 255, 255, 0.95)" },
    { x: 330, y: 140, r: 18, color: "rgba(255, 255, 255, 0.8)" },
  ];

  for (const blob of blobs) {
    const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
    gradient.addColorStop(0, blob.color);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const source = new CanvasTexture(canvas);
  source.mapping = EquirectangularReflectionMapping;
  source.colorSpace = SRGBColorSpace;
  return pmrem(renderer, source);
}

function pmrem(renderer: WebGLRenderer, source: CanvasTexture): Texture {
  const generator = new PMREMGenerator(renderer);
  generator.compileEquirectangularShader();
  const map = generator.fromEquirectangular(source).texture;
  source.dispose();
  generator.dispose();
  return map;
}

function createRimGeometry(): LatheGeometry {
  const thickness = HALF_THICKNESS;
  const points = [
    new Vector2(0.9, -thickness),
    new Vector2(0.942, -thickness),
    new Vector2(0.966, -thickness * 0.8),
    new Vector2(0.986, -thickness * 0.4),
    new Vector2(0.998, -0.01),
    new Vector2(1, 0),
    new Vector2(0.998, 0.01),
    new Vector2(0.986, thickness * 0.4),
    new Vector2(0.966, thickness * 0.8),
    new Vector2(0.942, thickness),
    new Vector2(0.9, thickness),
  ];
  return new LatheGeometry(points, 160);
}

function createFaceGeometry(side: 1 | -1, field: MarkField): BufferGeometry {
  const rings = FACE_RINGS;
  const segments = FACE_SEGMENTS;
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const eps = 0.01;

  for (let ring = 0; ring <= rings; ring += 1) {
    const radius = (ring / rings) * FACE_RADIUS;
    for (let step = 0; step <= segments; step += 1) {
      const theta = (step / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const relief = reliefAt(field, x, z);
      const y = side * (HALF_THICKNESS + 0.0016 + relief.height);
      positions.push(x, y, z);
      colors.push(relief.shade, relief.shade, relief.shade);

      const dhdx = (reliefAt(field, x + eps, z).height - reliefAt(field, x - eps, z).height) / (2 * eps);
      const dhdz = (reliefAt(field, x, z + eps).height - reliefAt(field, x, z - eps).height) / (2 * eps);
      const nx = -dhdx;
      const ny = side;
      const nz = -dhdz;
      const length = Math.hypot(nx, ny, nz) || 1;
      normals.push(nx / length, ny / length, nz / length);
    }
  }

  const stride = segments + 1;
  for (let ring = 0; ring < rings; ring += 1) {
    for (let step = 0; step < segments; step += 1) {
      const a = ring * stride + step;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      if (side === 1) indices.push(a, c, b, b, c, d);
      else indices.push(a, b, c, b, d, c);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3));
  geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

function reliefAt(field: MarkField, x: number, z: number): { height: number; shade: number } {
  const dist = Math.hypot(x, z);
  const mask = sampleField(field, x, z);
  const eps = 0.014;
  const gx = sampleField(field, x + eps, z) - sampleField(field, x - eps, z);
  const gz = sampleField(field, x, z + eps) - sampleField(field, x, z - eps);
  const edge = Math.min(1, (Math.hypot(gx, gz) / (2 * eps)) * 0.05);
  let height = mask * 0.042 + edge * 0.026;
  height += bead(dist, 0.868, 0.015, 0.018);
  height += bead(dist, 0.918, 0.011, 0.014);
  const shade = 0.86 + 0.14 * Math.min(1, mask * 0.85 + edge);
  return { height, shade };
}

function bead(dist: number, radius: number, width: number, amplitude: number): number {
  const delta = Math.abs(dist - radius);
  if (delta >= width) return 0;
  const u = delta / width;
  return amplitude * (0.5 + 0.5 * Math.cos(Math.PI * u));
}

function sampleField(field: MarkField, x: number, z: number): number {
  const px = MARK_SIZE / 2 + (x / MARK_RADIUS) * GLYPH_RADIUS_PX;
  const py = MARK_SIZE / 2 - (z / MARK_RADIUS) * GLYPH_RADIUS_PX;
  return bilinear(field, MARK_SIZE, px, py);
}

function bilinear(data: MarkField, size: number, x: number, y: number): number {
  if (x < 0 || y < 0 || x > size - 1 || y > size - 1) return 0;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, size - 1);
  const y1 = Math.min(y0 + 1, size - 1);
  const tx = x - x0;
  const ty = y - y0;
  const row0 = y0 * size;
  const row1 = y1 * size;
  const a = data[row0 + x0] + (data[row0 + x1] - data[row0 + x0]) * tx;
  const b = data[row1 + x0] + (data[row1 + x1] - data[row1 + x0]) * tx;
  return a + (b - a) * ty;
}

async function loadMarkField(): Promise<MarkField> {
  const image = new Image();
  image.decoding = "async";
  image.src = MARK_URL;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = MARK_SIZE;
  canvas.height = MARK_SIZE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return proceduralMark();

  ctx.drawImage(image, 0, 0, MARK_SIZE, MARK_SIZE);
  const pixels = ctx.getImageData(0, 0, MARK_SIZE, MARK_SIZE).data;
  const raw = new Float32Array(MARK_SIZE * MARK_SIZE);
  for (let i = 0; i < raw.length; i += 1) {
    const offset = i * 4;
    const r = pixels[offset];
    const g = pixels[offset + 1];
    const b = pixels[offset + 2];
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    raw[i] = smoothstep(0.42, 0.78, luminance);
  }
  return boxBlur(raw, MARK_SIZE, 8);
}

function proceduralMark(): MarkField {
  const field = new Float32Array(MARK_SIZE * MARK_SIZE);
  const center = MARK_SIZE / 2;
  const radius = GLYPH_RADIUS_PX;
  const gap = 10;
  const stroke = 8;
  for (let y = 0; y < MARK_SIZE; y += 1) {
    for (let x = 0; x < MARK_SIZE; x += 1) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) continue;
      const left = dx < -gap && dist <= radius - 2;
      const ring = Math.abs(dist - (radius - stroke * 0.5)) < stroke * 0.5 && dx > gap;
      const stem = dx > gap && dx < gap + stroke && Math.abs(dy) < radius - stroke;
      if (left || ring || stem) field[y * MARK_SIZE + x] = 1;
    }
  }
  return boxBlur(field, MARK_SIZE, 8);
}

function boxBlur(source: Float32Array, size: number, radius: number): Float32Array {
  const temp = new Float32Array(source.length);
  const output = new Float32Array(source.length);
  blurAxis(source, temp, size, radius, true);
  blurAxis(temp, output, size, radius, false);
  return output;
}

function blurAxis(
  input: Float32Array,
  output: Float32Array,
  size: number,
  radius: number,
  horizontal: boolean,
) {
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let sum = 0;
      let count = 0;
      for (let offset = -radius; offset <= radius; offset += 1) {
        const sx = horizontal ? x + offset : x;
        const sy = horizontal ? y : y + offset;
        if (sx < 0 || sy < 0 || sx >= size || sy >= size) continue;
        sum += input[sy * size + sx];
        count += 1;
      }
      output[y * size + x] = count > 0 ? sum / count : 0;
    }
  }
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
