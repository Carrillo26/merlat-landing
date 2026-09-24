"use client";

/**
 * Globe — Originkit
 *
 * three.js + d3-geo globe matching the OriginKit base preset
 * (dots, country outlines, 15° graticule, markers, drag-to-spin, stopOnHover).
 * The owner-supplied source was not on disk, so this file follows that preset API.
 * It was not installed with `npx originkit add`.
 *
 * LATAM land dots are Merlat red (#E10600). The rest of the world stays dimmer.
 */

import { useEffect, useRef } from "react";
import { geoContains, geoGraticule } from "d3-geo";
import * as THREE from "three";
import land from "./land-110m.json";

const LATAM_RED = "#E10600";

const LATAM_ISO = new Set([
  "MX", "GT", "BZ", "HN", "SV", "NI", "CR", "PA",
  "CU", "HT", "DO", "JM", "TT", "BS", "BB", "AG", "DM", "GD", "KN", "LC", "VC",
  "CO", "VE", "GY", "SR", "EC", "PE", "BO", "BR", "PY", "UY", "AR", "CL",
]);

export type GlobeMarker = {
  lat: number;
  lng: number;
  color?: string;
};

export type GlobeProps = {
  direction?: "left" | "right";
  scale?: number;
  stopOnHover?: boolean;
  initialLatitude?: number;
  initialLongitude?: number;
  fill?: "dots" | "solid";
  fillColor?: string;
  showOutline?: boolean;
  outlineColor?: string;
  showGrid?: boolean;
  graticuleColor?: string;
  oceanColor?: string;
  speed?: number;
  markers?: GlobeMarker[];
  className?: string;
};

type Ring = number[][];

type LandFeature = {
  properties: { iso: string; name: string };
  geometry: { type: string; coordinates: unknown };
  rings: Ring[];
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
  latam: boolean;
};

const features: LandFeature[] = (land.features as unknown as LandFeature[]).map((feature) => {
  const rings = ringsOf(feature.geometry);
  let minLon = 180;
  let maxLon = -180;
  let minLat = 90;
  let maxLat = -90;
  for (const ring of rings) {
    for (const pair of ring) {
      const lon = pair[0];
      const lat = pair[1];
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return {
    ...feature,
    rings,
    minLon,
    maxLon,
    minLat,
    maxLat,
    latam: LATAM_ISO.has(feature.properties.iso),
  };
});

export default function Globe({
  direction = "left",
  scale = 8,
  stopOnHover = true,
  initialLatitude = 23,
  initialLongitude = -23,
  fill = "dots",
  fillColor = "#FFFFFF",
  showOutline = true,
  outlineColor = "#FFFFFF",
  showGrid = true,
  graticuleColor = "#D4D4D4",
  oceanColor = "#000000",
  speed = 2,
  markers = [],
  className,
}: GlobeProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spin = reduced ? 0 : speed * (direction === "right" ? -1 : 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
    camera.position.z = Math.max(2.35, 6.4 - scale * 0.38);

    const group = new THREE.Group();
    group.rotation.order = "YXZ";
    group.rotation.y = THREE.MathUtils.degToRad(-initialLongitude);
    group.rotation.x = THREE.MathUtils.degToRad(initialLatitude);
    scene.add(group);

    const disposables: { dispose: () => void }[] = [];

    const ocean = new THREE.Mesh(
      new THREE.SphereGeometry(0.985, 48, 48),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(oceanColor) }),
    );
    disposables.push(ocean.geometry, ocean.material);
    group.add(ocean);

    const samples = fill === "solid" ? 11000 : 5200;
    const world: number[] = [];
    const latam: number[] = [];
    for (const point of fibonacci(samples)) {
      const region = landAt(point.lon, point.lat);
      if (!region) continue;
      const vertex = toVec(point.lon, point.lat, 1.002);
      const bucket = region === "latam" ? latam : world;
      bucket.push(vertex.x, vertex.y, vertex.z);
    }

    const dotSize = fill === "solid" ? 0.05 : 0.02;
    group.add(points(world, fillColor, dotSize, fill === "solid" ? 0.9 : 0.32, disposables));
    group.add(points(latam, LATAM_RED, fill === "solid" ? 0.055 : 0.028, 1, disposables));

    if (showOutline) {
      const worldLines: number[] = [];
      const latamLines: number[] = [];
      for (const feature of features) {
        const target = feature.latam ? latamLines : worldLines;
        for (const ring of feature.rings) pushRing(target, ring, 1.006);
      }
      group.add(lines(worldLines, outlineColor, 0.28, disposables));
      group.add(lines(latamLines, LATAM_RED, 0.85, disposables));
    }

    if (showGrid) {
      const grid: number[] = [];
      const graticule = geoGraticule().step([15, 15])();
      for (const line of graticule.coordinates) pushRing(grid, line, 1.004);
      group.add(lines(grid, graticuleColor, 0.22, disposables));
    }

    for (const marker of markers) {
      const position = toVec(marker.lng, marker.lat, 1.03);
      const color = new THREE.Color(marker.color ?? LATAM_RED);
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.034, 12, 12),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35 }),
      );
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.016, 12, 12),
        new THREE.MeshBasicMaterial({ color }),
      );
      halo.position.copy(position);
      pin.position.copy(position);
      disposables.push(halo.geometry, halo.material, pin.geometry, pin.material);
      group.add(halo, pin);
    }

    let frame = 0;
    let hovering = false;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velocityX = 0;
    let velocityY = 0;

    const resize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      velocityX = 0;
      velocityY = 0;
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      velocityY = dx * 0.005;
      velocityX = dy * 0.005;
      group.rotation.y += velocityY;
      group.rotation.x += velocityX;
    };
    const onUp = () => {
      dragging = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);

    const tick = () => {
      const paused = dragging || (stopOnHover && hovering);
      if (!paused) {
        group.rotation.y += THREE.MathUtils.degToRad(0.045 * spin);
      }
      if (!dragging) {
        group.rotation.y += velocityY;
        group.rotation.x += velocityX;
        velocityY *= 0.94;
        velocityX *= 0.94;
      }
      group.rotation.x = THREE.MathUtils.clamp(group.rotation.x, -1.05, 1.05);
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      for (const item of disposables) item.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [
    direction,
    scale,
    stopOnHover,
    initialLatitude,
    initialLongitude,
    fill,
    fillColor,
    showOutline,
    outlineColor,
    showGrid,
    graticuleColor,
    oceanColor,
    speed,
    markers,
  ]);

  return <div ref={hostRef} className={className ? `originkit-globe ${className}` : "originkit-globe"} aria-hidden="true" />;
}

function points(
  positions: number[],
  color: string,
  size: number,
  opacity: number,
  disposables: { dispose: () => void }[],
) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: new THREE.Color(color),
    size,
    sizeAttenuation: true,
    transparent: true,
    opacity,
    depthWrite: false,
  });
  disposables.push(geometry, material);
  return new THREE.Points(geometry, material);
}

function lines(
  positions: number[],
  color: string,
  opacity: number,
  disposables: { dispose: () => void }[],
) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
  });
  disposables.push(geometry, material);
  return new THREE.LineSegments(geometry, material);
}

function pushRing(target: number[], ring: Ring, radius: number) {
  for (let index = 1; index < ring.length; index += 1) {
    const start = toVec(ring[index - 1][0], ring[index - 1][1], radius);
    const end = toVec(ring[index][0], ring[index][1], radius);
    if (start.distanceTo(end) > 0.4) continue;
    target.push(start.x, start.y, start.z, end.x, end.y, end.z);
  }
}

function toVec(lon: number, lat: number, radius: number) {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    Math.cos(phi) * Math.sin(lambda),
    Math.sin(phi),
    Math.cos(phi) * Math.cos(lambda),
  ).multiplyScalar(radius);
}

function fibonacci(count: number) {
  const points: { lon: number; lat: number }[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / Math.max(count - 1, 1)) * 2;
    const radial = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;
    const x = Math.cos(theta) * radial;
    const z = Math.sin(theta) * radial;
    points.push({
      lat: (Math.asin(Math.min(1, Math.max(-1, y))) * 180) / Math.PI,
      lon: (Math.atan2(x, z) * 180) / Math.PI,
    });
  }
  return points;
}

function landAt(lon: number, lat: number): "latam" | "world" | null {
  for (const feature of features) {
    if (lon < feature.minLon || lon > feature.maxLon || lat < feature.minLat || lat > feature.maxLat) {
      continue;
    }
    if (geoContains(feature as unknown as GeoJSON.Feature, [lon, lat])) {
      return feature.latam ? "latam" : "world";
    }
  }
  return null;
}

function ringsOf(geometry: { type: string; coordinates: unknown }): Ring[] {
  if (geometry.type === "Polygon") return geometry.coordinates as Ring[];
  if (geometry.type === "MultiPolygon") return (geometry.coordinates as Ring[][]).flat();
  return [];
}
