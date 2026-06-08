import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

// ── Global cursor state ───────────────────────────────────────────────────────
const cursor = { x: 0, y: 0, prevX: 0, prevY: 0, speed: 0 };

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

// ── Mouse tracker ────────────────────────────────────────────────────────────
function MouseTracker() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - cursor.prevX;
      const dy = e.clientY - cursor.prevY;
      cursor.speed  = lerp(cursor.speed, Math.sqrt(dx * dx + dy * dy), 0.3);
      cursor.x      = (e.clientX / window.innerWidth)  * 2 - 1;
      cursor.y      = -(e.clientY / window.innerHeight) * 2 + 1;
      cursor.prevX  = e.clientX;
      cursor.prevY  = e.clientY;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return null;
}

// ── Convert lat/lon to 3D sphere position ─────────────────────────────────────
function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ── Network node positions (major cities / geographic hubs) ───────────────────
const NODE_POSITIONS: [number, number][] = [
  // Americas
  [40.7, -74.0],   // New York
  [34.0, -118.2],  // Los Angeles
  [19.4, -99.1],   // Mexico City
  [-23.5, -46.6],  // São Paulo
  [4.7, -74.1],    // Bogotá
  [49.2, -123.1],  // Vancouver
  // Europe
  [51.5, -0.1],    // London
  [48.9, 2.3],     // Paris
  [52.5, 13.4],    // Berlin
  [55.7, 37.6],    // Moscow
  [59.9, 10.7],    // Oslo
  [41.0, 29.0],    // Istanbul
  // Africa
  [30.0, 31.2],    // Cairo
  [-1.3, 36.8],    // Nairobi
  [6.5, 3.4],      // Lagos
  [-33.9, 18.4],   // Cape Town
  // Asia
  [39.9, 116.4],   // Beijing
  [35.7, 139.7],   // Tokyo
  [1.3, 103.8],    // Singapore
  [28.6, 77.2],    // New Delhi
  [55.7, 37.6],    // Moscow (Asia side)
  [31.2, 121.5],   // Shanghai
  [37.6, 127.0],   // Seoul
  // Oceania
  [-33.9, 151.2],  // Sydney
  [-36.9, 174.8],  // Auckland
];

// ── Procedural globe arc between two sphere positions ─────────────────────────
function createArc(p1: THREE.Vector3, p2: THREE.Vector3, segments = 48): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const midPoint = p1.clone().add(p2).multiplyScalar(0.5);
  const midLen   = midPoint.length();
  midPoint.normalize().multiplyScalar(midLen * 1.22); // lift arc above surface

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Quadratic bezier: lerp(lerp(p1,mid,t), lerp(mid,p2,t), t)
    const a = p1.clone().lerp(midPoint, t);
    const b = midPoint.clone().lerp(p2, t);
    points.push(a.lerp(b, t));
  }
  return points;
}

// ── Globe Component ───────────────────────────────────────────────────────────
function Globe() {
  const groupRef   = useRef<THREE.Group>(null!);
  const glowRef    = useRef<THREE.Mesh>(null!);
  const nodesRef   = useRef<THREE.InstancedMesh>(null!);

  // ── Static geometry construction ──────────────────────────────────────────
  const RADIUS = 2.0;

  const { nodePositions, arcLinePositions, arcColors } = useMemo(() => {
    // Convert lat/lon to 3D points
    const nodePositions = NODE_POSITIONS.map(([lat, lon]) =>
      latLonToVec3(lat, lon, RADIUS)
    );

    // Build arcs: connect each node to ~3 nearby nodes
    const arcLinePositions: number[] = [];
    const arcColors: number[] = [];
    const used = new Set<string>();

    for (let i = 0; i < nodePositions.length; i++) {
      // Pick 2–3 closest other nodes
      const distances = nodePositions
        .map((p, j) => ({ j, dist: nodePositions[i].distanceTo(p) }))
        .filter(({ j, dist }) => j !== i && dist > 0.01)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);

      for (const { j } of distances) {
        const key = [Math.min(i, j), Math.max(i, j)].join("-");
        if (used.has(key)) continue;
        used.add(key);

        const pts = createArc(nodePositions[i], nodePositions[j]);
        for (let k = 0; k < pts.length - 1; k++) {
          const t0 = k / (pts.length - 1);
          const t1 = (k + 1) / (pts.length - 1);
          const alpha0 = Math.sin(t0 * Math.PI);
          const alpha1 = Math.sin(t1 * Math.PI);
          arcLinePositions.push(pts[k].x, pts[k].y, pts[k].z);
          arcLinePositions.push(pts[k + 1].x, pts[k + 1].y, pts[k + 1].z);
          arcColors.push(0.0, 0.6 + alpha0 * 0.4, 1.0);
          arcColors.push(0.0, 0.6 + alpha1 * 0.4, 1.0);
        }
      }
    }

    return { nodePositions, arcLinePositions, arcColors };
  }, []);

  // ── Instanced mesh matrix setup for nodes ──────────────────────────────────
  useEffect(() => {
    if (!nodesRef.current) return;
    const mat = new THREE.Matrix4();
    nodePositions.forEach((pos, i) => {
      mat.setPosition(pos);
      nodesRef.current.setMatrixAt(i, mat);
    });
    nodesRef.current.instanceMatrix.needsUpdate = true;
  }, [nodePositions]);

  // ── Arc line geometry ──────────────────────────────────────────────────────
  const arcGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(arcLinePositions, 3));
    geo.setAttribute("color",    new THREE.Float32BufferAttribute(arcColors, 3));
    return geo;
  }, [arcLinePositions, arcColors]);

  // ── Wireframe sphere geometry ──────────────────────────────────────────────
  const wireGeo = useMemo(() => new THREE.IcosahedronGeometry(RADIUS, 4), []);

  // ── Materials ──────────────────────────────────────────────────────────────
  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#0a3a7a",
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  }), []);

  const arcMat = useMemo(() => new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    linewidth: 1,
  }), []);

  const nodeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#00cfff" }), []);

  // ── Glow sphere (additive blending halo) ──────────────────────────────────
  const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#0050ff",
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  // ── Per-frame animation ────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Speed decay
    cursor.speed = lerp(cursor.speed, 0, 0.025);

    if (groupRef.current) {
      // Slow base auto-rotation
      groupRef.current.rotation.y += 0.0015 + cursor.speed * 0.0004;
      // Tilt toward cursor Y
      groupRef.current.rotation.x = lerp(
        groupRef.current.rotation.x,
        -cursor.y * 0.25,
        0.04
      );
    }

    // Glow pulse
    if (glowRef.current) {
      const pulse = Math.sin(t * 1.4) * 0.02;
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = clamp(0.06 + pulse + cursor.speed * 0.003, 0.04, 0.22);
    }

    // Arc opacity reacts to cursor speed
    arcMat.opacity = clamp(0.65 + cursor.speed * 0.012, 0.6, 1.0);

    // Wire opacity
    wireMat.opacity = clamp(0.18 + cursor.speed * 0.005, 0.15, 0.4);
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe globe */}
      <mesh geometry={wireGeo} material={wireMat} />

      {/* Network arcs */}
      <lineSegments geometry={arcGeo} material={arcMat} />

      {/* Network nodes (instanced) */}
      <instancedMesh ref={nodesRef} args={[undefined, undefined, nodePositions.length]} material={nodeMat}>
        <sphereGeometry args={[0.038, 8, 8]} />
      </instancedMesh>

      {/* Outer glow halo */}
      <mesh ref={glowRef} material={glowMat}>
        <sphereGeometry args={[RADIUS * 1.18, 32, 32]} />
      </mesh>
    </group>
  );
}

// ── Light beams emanating from globe equator ─────────────────────────────────
function EquatorBeam() {
  const ref = useRef<THREE.Mesh>(null!);

  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#00aaff",
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.22;
      mat.opacity = 0.10 + Math.sin(t * 0.9) * 0.05 + cursor.speed * 0.003;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} material={mat}>
      <ringGeometry args={[1.95, 2.1, 64]} />
    </mesh>
  );
}

// ── Star/particle field ───────────────────────────────────────────────────────
function Stars() {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      // Distribute on a sphere shell
      const phi   = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = 5 + Math.random() * 6;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi);
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.006;
      ref.current.rotation.x = t * 0.003;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#4488ff"
        size={0.028}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

// ── Floating data packet dots moving along arcs ──────────────────────────────
function DataPackets() {
  const ref = useRef<THREE.Points>(null!);
  const RADIUS = 2.0;

  const { positions, phases } = useMemo(() => {
    const count = 40;
    const positions = new Float32Array(count * 3);
    const phases    = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, phases };
  }, []);

  const pairIndices = useMemo(() => {
    const count = 40;
    return Array.from({ length: count }, () => {
      const i = Math.floor(Math.random() * NODE_POSITIONS.length);
      let   j = Math.floor(Math.random() * NODE_POSITIONS.length);
      if (j === i) j = (i + 1) % NODE_POSITIONS.length;
      return [i, j] as [number, number];
    });
  }, []);

  const nodeVecs = useMemo(() =>
    NODE_POSITIONS.map(([lat, lon]) => latLonToVec3(lat, lon, RADIUS)), []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!ref.current) return;

    const posArr = ref.current.geometry.attributes.position.array as Float32Array;

    pairIndices.forEach(([i, j], idx) => {
      const speed = 0.4 + (idx % 5) * 0.08;
      const tVal  = ((t * speed + phases[idx]) % (Math.PI * 2)) / (Math.PI * 2);
      const p1    = nodeVecs[i];
      const p2    = nodeVecs[j];

      // Quadratic bezier
      const midPoint = p1.clone().add(p2).multiplyScalar(0.5)
        .normalize().multiplyScalar(p1.clone().add(p2).multiplyScalar(0.5).length() * 1.22);

      const a = p1.clone().lerp(midPoint, tVal);
      const b = midPoint.clone().lerp(p2, tVal);
      const pos = a.lerp(b, tVal);

      posArr[idx * 3]     = pos.x;
      posArr[idx * 3 + 1] = pos.y;
      posArr[idx * 3 + 2] = pos.z;
    });

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00ffee"
        size={0.055}
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

// ── Bottom horizon glow ───────────────────────────────────────────────────────
function HorizonGlow() {
  const ref = useRef<THREE.Mesh>(null!);

  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#0066ff",
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      mat.opacity = 0.32 + Math.sin(t * 0.6) * 0.08 + cursor.speed * 0.008;
    }
  });

  // A wide flat ellipse just below the globe
  return (
    <mesh ref={ref} position={[0, -2.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={mat}>
      <ellipseCurve args={[0, 0, 2.8, 0.35, 0, Math.PI * 2] as any} />
      <planeGeometry args={[5.6, 0.7, 32, 1]} />
    </mesh>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 5.5], fov: 44 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <MouseTracker />

        {/* Deep space ambient */}
        <ambientLight intensity={0.08} color="#0044aa" />

        {/* Key blue fill light from front-left */}
        <pointLight position={[-4, 3, 4]} intensity={4.5} color="#0088ff" />

        {/* Subtle purple rim */}
        <pointLight position={[4, -2, -3]} intensity={2.0} color="#4400aa" />

        {/* Top fill */}
        <pointLight position={[0, 6, 2]} intensity={1.5} color="#0033cc" />

        <Globe />
        <EquatorBeam />
        <DataPackets />
        <Stars />
        <HorizonGlow />
      </Suspense>
    </Canvas>
  );
}