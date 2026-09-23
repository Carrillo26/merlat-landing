/**
 * Decorative dotted Earth for #product (Markets).
 * Look-alike of a "base" dotted globe preset — NOT OriginKit source.
 * Land dots: Natural Earth 110m land, pre-sampled (assets/js/land-dots.json).
 * LATAM-framed: hero hemisphere, brighter LATAM dots, soft Brazil marker.
 * three.js from pinned CDN; vanilla JS for GitHub Pages.
 */
(function () {
  "use strict";

  var THREE_CDN = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
  var LAND_URL = "assets/js/land-dots.json";
  var GLOBE_RADIUS = 1;
  // Frame Latin America (Mexico→Southern Cone) front-and-center
  var INITIAL_LAT = -5;
  var INITIAL_LON = -60;
  // Soft marker near Brazil centroid
  var MARKER_LAT = -10.5;
  var MARKER_LON = -53;
  // Gentle yaw oscillation around home facing (keeps LATAM in hero arc)
  var SPIN_AMP = 0.42; // radians (~24°)
  var SPIN_PERIOD_MS = 28000;
  var SPIN_AMP_HOVER = 0.18;

  var state = {
    started: false,
    disposed: false,
    reducedMotion: false,
    hovering: false,
    raf: 0,
    t0: 0,
    baseQuat: null,
    renderer: null,
    scene: null,
    camera: null,
    globeGroup: null,
    spinGroup: null,
    canvas: null,
    section: null,
    resizeObs: null,
    io: null,
  };

  function prefersReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function isMobile() {
    return (
      window.matchMedia("(max-width: 720px)").matches ||
      (navigator.maxTouchPoints > 1 && window.innerWidth < 900)
    );
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (window.THREE) {
        resolve(window.THREE);
        return;
      }
      var tries = 0;
      var wait = setInterval(function () {
        tries += 1;
        if (window.THREE) {
          clearInterval(wait);
          resolve(window.THREE);
          return;
        }
        if (tries > 40) {
          clearInterval(wait);
          var s = document.createElement("script");
          s.src = src;
          s.onload = function () {
            if (window.THREE) resolve(window.THREE);
            else reject(new Error("THREE missing after load"));
          };
          s.onerror = function () {
            reject(new Error("Failed to load " + src));
          };
          document.head.appendChild(s);
        }
      }, 50);
    });
  }

  function latLonToVec3(lat, lon, r, THREE) {
    var phi = ((90 - lat) * Math.PI) / 180;
    var theta = ((lon + 180) * Math.PI) / 180;
    var x = -r * Math.sin(phi) * Math.cos(theta);
    var z = r * Math.sin(phi) * Math.sin(theta);
    var y = r * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  /** Rough LATAM land mask (Mexico → Chile/Argentina + Caribbean). */
  function isLatam(lat, lon) {
    if (lon < -118 || lon > -34) return false;
    if (lat < -56 || lat > 33) return false;
    // Cut continental USA / Canada (keep Mexico & Caribbean)
    if (lat > 24.5 && lon < -97) return false;
    if (lat > 27 && lon > -97 && lon < -80) return false;
    return true;
  }

  function unpackDots(flat) {
    var out = [];
    for (var i = 0; i < flat.length; i += 2) {
      out.push(flat[i] / 100, flat[i + 1] / 100);
    }
    return out;
  }

  function splitLatam(latLonPairs) {
    var latam = [];
    var world = [];
    for (var i = 0; i < latLonPairs.length; i += 2) {
      var lat = latLonPairs[i];
      var lon = latLonPairs[i + 1];
      if (isLatam(lat, lon)) {
        latam.push(lat, lon);
      } else {
        world.push(lat, lon);
      }
    }
    return { latam: latam, world: world };
  }

  function buildPoints(THREE, latLonPairs, radius, opts) {
    var n = latLonPairs.length / 2;
    if (n === 0) return null;
    var positions = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var v = latLonToVec3(
        latLonPairs[i * 2],
        latLonPairs[i * 2 + 1],
        radius,
        THREE
      );
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    var mat = new THREE.PointsMaterial({
      color: opts.color,
      size: opts.size,
      sizeAttenuation: true,
      transparent: true,
      opacity: opts.opacity,
      depthWrite: false,
    });
    return new THREE.Points(geo, mat);
  }

  function buildGraticule(THREE, radius, stepDeg) {
    var positions = [];
    var segments = 64;
    var lat, lon, i, v;

    for (lon = -180; lon < 180; lon += stepDeg) {
      for (i = 0; i < segments; i++) {
        lat = -90 + (i / segments) * 180;
        v = latLonToVec3(lat, lon, radius, THREE);
        positions.push(v.x, v.y, v.z);
        lat = -90 + ((i + 1) / segments) * 180;
        v = latLonToVec3(lat, lon, radius, THREE);
        positions.push(v.x, v.y, v.z);
      }
    }
    for (lat = -90 + stepDeg; lat < 90; lat += stepDeg) {
      for (i = 0; i < segments; i++) {
        lon = -180 + (i / segments) * 360;
        v = latLonToVec3(lat, lon, radius, THREE);
        positions.push(v.x, v.y, v.z);
        lon = -180 + ((i + 1) / segments) * 360;
        v = latLonToVec3(lat, lon, radius, THREE);
        positions.push(v.x, v.y, v.z);
      }
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    var mat = new THREE.LineBasicMaterial({
      color: 0xd4d4d4,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });
    return new THREE.LineSegments(geo, mat);
  }

  function buildOcean(THREE, radius) {
    var geo = new THREE.SphereGeometry(radius * 0.992, 48, 32);
    var mat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.9,
    });
    return new THREE.Mesh(geo, mat);
  }

  function buildLatamMarker(THREE, radius) {
    var group = new THREE.Group();
    var pos = latLonToVec3(MARKER_LAT, MARKER_LON, radius * 1.02, THREE);

    // Soft outer glow (larger, translucent red)
    var glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([pos.x, pos.y, pos.z], 3)
    );
    var glow = new THREE.Points(
      glowGeo,
      new THREE.PointsMaterial({
        color: 0xe10600,
        size: isMobile() ? 0.12 : 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      })
    );

    // Bright core
    var coreGeo = new THREE.BufferGeometry();
    coreGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([pos.x, pos.y, pos.z], 3)
    );
    var core = new THREE.Points(
      coreGeo,
      new THREE.PointsMaterial({
        color: 0xfff5f0,
        size: isMobile() ? 0.036 : 0.028,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      })
    );

    group.add(glow);
    group.add(core);
    return group;
  }

  /** Face (lat,lon) toward the camera (+Z) via quaternion. */
  function faceLatLon(group, lat, lon, THREE) {
    var from = latLonToVec3(lat, lon, 1, THREE).normalize();
    var to = new THREE.Vector3(0, 0, 1);
    var q = new THREE.Quaternion().setFromUnitVectors(from, to);
    group.quaternion.copy(q);
    return q.clone();
  }

  function resize() {
    if (!state.renderer || !state.camera || !state.canvas) return;
    var parent = state.canvas.parentElement;
    if (!parent) return;
    var w = parent.clientWidth || 1;
    var h = parent.clientHeight || 1;
    var dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2);
    state.renderer.setPixelRatio(dpr);
    state.renderer.setSize(w, h, false);
    state.camera.aspect = w / h;
    state.camera.updateProjectionMatrix();
  }

  function animate(now) {
    if (state.disposed) return;
    state.raf = requestAnimationFrame(animate);
    if (state.spinGroup && !state.reducedMotion && state.baseQuat) {
      var t = (now - state.t0) / SPIN_PERIOD_MS;
      var amp = state.hovering ? SPIN_AMP_HOVER : SPIN_AMP;
      var yaw = Math.sin(t * Math.PI * 2) * amp;
      // Oscillate around home facing so LATAM stays the hero hemisphere
      var qYaw = new window.THREE.Quaternion().setFromAxisAngle(
        new window.THREE.Vector3(0, 1, 0),
        yaw
      );
      state.spinGroup.quaternion.copy(state.baseQuat).multiply(qYaw);
    }
    if (state.renderer && state.scene && state.camera) {
      state.renderer.render(state.scene, state.camera);
    }
  }

  function dispose() {
    state.disposed = true;
    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
    if (state.resizeObs) {
      try {
        state.resizeObs.disconnect();
      } catch (e) {}
      state.resizeObs = null;
    }
    if (state.io) {
      try {
        state.io.disconnect();
      } catch (e) {}
      state.io = null;
    }
    if (state.section) {
      state.section.removeEventListener("mouseenter", onEnter);
      state.section.removeEventListener("mouseleave", onLeave);
    }
    if (state.renderer) {
      try {
        state.renderer.dispose();
        var gl = state.renderer.getContext();
        var lose = gl && gl.getExtension("WEBGL_lose_context");
        if (lose) lose.loseContext();
      } catch (e) {}
      state.renderer = null;
    }
    state.scene = null;
    state.camera = null;
    state.globeGroup = null;
    state.spinGroup = null;
    state.baseQuat = null;
  }

  function onEnter() {
    state.hovering = true;
  }
  function onLeave() {
    state.hovering = false;
  }

  function onVisibility() {
    if (document.hidden) {
      if (state.raf) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      }
    } else if (state.started && !state.disposed && !state.raf) {
      state.t0 = performance.now();
      animate(state.t0);
    }
  }

  async function boot() {
    if (state.started) return;
    state.started = true;
    state.reducedMotion = prefersReducedMotion();

    var canvas = document.getElementById("marketsGlobe");
    var section = document.getElementById("product");
    if (!canvas || !section) return;
    state.canvas = canvas;
    state.section = section;

    var THREE;
    try {
      THREE = await loadScript(THREE_CDN);
    } catch (err) {
      console.warn("[markets-globe]", err);
      return;
    }

    var landData;
    try {
      var res = await fetch(LAND_URL);
      if (!res.ok) throw new Error("land-dots HTTP " + res.status);
      landData = await res.json();
    } catch (err) {
      console.warn("[markets-globe] land data", err);
      return;
    }

    var useLo = isMobile();
    var pairs = unpackDots(useLo ? landData.lo : landData.hi);
    var split = splitLatam(pairs);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.06, 2.55);

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !useLo,
      powerPreference: "low-power",
    });
    renderer.setClearColor(0x000000, 0);

    // spinGroup holds geometry; its quaternion = baseFacing * yawOscillation
    var spinGroup = new THREE.Group();
    spinGroup.add(buildOcean(THREE, GLOBE_RADIUS));
    spinGroup.add(buildGraticule(THREE, GLOBE_RADIUS * 1.002, 15));

    var worldPts = buildPoints(THREE, split.world, GLOBE_RADIUS * 1.006, {
      color: 0x9a9a96,
      size: useLo ? 0.008 : 0.0065,
      opacity: 0.28,
    });
    if (worldPts) spinGroup.add(worldPts);

    // LATAM hero layer — soft Merlat red (#E10600 family), editorial not neon
    var latamPts = buildPoints(THREE, split.latam, GLOBE_RADIUS * 1.01, {
      color: 0xe85c54,
      size: useLo ? 0.018 : 0.0145,
      opacity: 0.92,
    });
    if (latamPts) spinGroup.add(latamPts);

    // Warm white core so LATAM land still reads as dotted fill
    var latamCore = buildPoints(THREE, split.latam, GLOBE_RADIUS * 1.014, {
      color: 0xfff2ee,
      size: useLo ? 0.01 : 0.008,
      opacity: 0.88,
    });
    if (latamCore) spinGroup.add(latamCore);

    spinGroup.add(buildLatamMarker(THREE, GLOBE_RADIUS));

    var baseQuat = faceLatLon(spinGroup, INITIAL_LAT, INITIAL_LON, THREE);
    state.baseQuat = baseQuat;
    scene.add(spinGroup);

    state.scene = scene;
    state.camera = camera;
    state.renderer = renderer;
    state.spinGroup = spinGroup;
    state.globeGroup = spinGroup;

    resize();
    if (typeof ResizeObserver !== "undefined") {
      state.resizeObs = new ResizeObserver(resize);
      state.resizeObs.observe(canvas.parentElement);
    } else {
      window.addEventListener("resize", resize);
    }

    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    state.t0 = performance.now();
    if (state.reducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate(state.t0);
    }
  }

  function lazyInit() {
    var section = document.getElementById("product");
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      boot();
      return;
    }

    state.io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            boot();
            if (state.io) {
              state.io.disconnect();
              state.io = null;
            }
          }
        });
      },
      { root: null, rootMargin: "120px 0px", threshold: 0.05 }
    );
    state.io.observe(section);
  }

  window.addEventListener("pagehide", function () {
    dispose();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", lazyInit);
  } else {
    lazyInit();
  }
})();
