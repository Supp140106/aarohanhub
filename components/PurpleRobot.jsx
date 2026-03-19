'use client'
import { useEffect, useRef } from "react";
import * as THREE from "three";
export default function PurpleRobot() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = mount.clientWidth;
    const H = mount.clientHeight;

    // ── RENDERER ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.setClearColor(0x000000);
    mount.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ────────────────────────────────────
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 1.6, 7.2);
    camera.lookAt(0, 0.8, 0);

    // ── LIGHTS ────────────────────────────────────────────
    // Dark ambient — moody base like the reference
    scene.add(new THREE.AmbientLight(0x220033, 2.0));

    // Key — cool blue-purple from top-left (glossy sheen on head)
    const key = new THREE.DirectionalLight(0xbbaaff, 4.0);
    key.position.set(-3, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 30;
    key.shadow.camera.left = key.shadow.camera.bottom = -5;
    key.shadow.camera.right = key.shadow.camera.top = 5;
    key.shadow.bias = -0.0005;
    scene.add(key);

    // Hot red from right — the red edge highlight visible in reference
    const rightRim = new THREE.DirectionalLight(0xff1100, 3.0);
    rightRim.position.set(6, 2, 3);
    scene.add(rightRim);

    // HOT PINK point light from behind — creates the neon rim glow
    const pinkBack = new THREE.PointLight(0xff0099, 5.0, 9);
    pinkBack.position.set(0, 1.8, -2.5);
    scene.add(pinkBack);

    // Soft purple front so eyes are visible
    const front = new THREE.DirectionalLight(0x7755ff, 2.0);
    front.position.set(0, 0.5, 7);
    scene.add(front);

    // Purple under glow
    const glowLight = new THREE.PointLight(0x8800ff, 3.0, 8);
    glowLight.position.set(0, -0.8, 1.5);
    scene.add(glowLight);

    // Top purple wash
    const topLight = new THREE.PointLight(0xaa66ff, 2.5, 9);
    topLight.position.set(0, 5, 1);
    scene.add(topLight);

    // ── MATERIALS ─────────────────────────────────────────

    // HEAD — deep dark indigo, mirror-gloss (matches reference)
    const headMat = new THREE.MeshPhysicalMaterial({
      color: 0x18004a,
      metalness: 0.0,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
    });

    // CUBE — near-black glossy pedestal
    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: 0x050310,
      metalness: 0.15,
      roughness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.06,
    });

    // NECK — very dark glossy black-purple
    const neckMat = new THREE.MeshPhysicalMaterial({
      color: 0x080018,
      metalness: 0.1,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
    });

    // EYES — white spheres
    const eyeWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      emissive: 0xffffff,
      emissiveIntensity: 0.25,
    });

    // RIM — HOT PINK/MAGENTA neon glow (the defining feature of the reference)
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xff0077,
      metalness: 0.2,
      roughness: 0.04,
      emissive: 0xff0055,
      emissiveIntensity: 3.0,
    });

    // ── ROUNDED BOX HELPER ────────────────────────────────
    function roundedBox(w, h, d, r, segs = 10) {
      const shape = new THREE.Shape();
      const x = -w / 2, y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: d,
        bevelEnabled: true,
        bevelThickness: r * 0.85,
        bevelSize: r * 0.85,
        bevelOffset: -r * 0.85,
        bevelSegments: segs,
      });
      geo.center();
      return geo;
    }

    // ── ROBOT GROUP ───────────────────────────────────────
    const robot = new THREE.Group();
    robot.position.set(0, 0.05, 0);
    scene.add(robot);

    // Pedestal cube
    const cubeGeo = new THREE.BoxGeometry(2.2, 2.2, 2.2, 4, 4, 4);
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    cube.position.y = -0.6;
    cube.castShadow = true;
    cube.receiveShadow = true;
    robot.add(cube);

    // Pink edge glow on cube
    const edgeGeo = new THREE.EdgesGeometry(cubeGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xff0077, transparent: true, opacity: 0.5 });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    edgeLines.position.y = -0.6;
    robot.add(edgeLines);

    // ── HEAD GROUP ────────────────────────────────────────
    const headGroup = new THREE.Group();
    headGroup.position.y = 2.0;
    robot.add(headGroup);

    // Neck
    const neckGroup = new THREE.Group();
    neckGroup.position.y = -0.72;
    headGroup.add(neckGroup);

    const neckUp = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.42, 32), neckMat);
    neckUp.position.y = 0.1;
    neckUp.castShadow = true;
    neckGroup.add(neckUp);

    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), neckMat);
    ball.position.y = -0.28;
    ball.castShadow = true;
    neckGroup.add(ball);

    // Head — dark glossy body
    const head = new THREE.Mesh(roundedBox(1.82, 1.28, 0.58, 0.22, 10), headMat);
    head.castShadow = true;
    headGroup.add(head);

    // Rim — hot pink glowing neon outline (slightly larger than head)
    const headRim = new THREE.Mesh(roundedBox(1.92, 1.36, 0.54, 0.26, 12), rimMat);
    headRim.position.z = -0.02;
    headGroup.add(headRim);

    // Eyes
    [-0.42, 0.42].forEach(x => {
      const socketMat = new THREE.MeshStandardMaterial({ color: 0x03000e, roughness: 0.9 });
      const socket = new THREE.Mesh(new THREE.SphereGeometry(0.25, 32, 32), socketMat);
      socket.position.set(x, 0.06, 0.26);
      socket.scale.z = 0.3;
      headGroup.add(socket);

      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.21, 32, 32), eyeWhiteMat);
      eye.position.set(x, 0.06, 0.31);
      headGroup.add(eye);

      const specMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const spec = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), specMat);
      spec.position.set(x + 0.07, 0.14, 0.5);
      headGroup.add(spec);
    });

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 18),
      new THREE.MeshStandardMaterial({ color: 0x03010a, metalness: 0.3, roughness: 0.8 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.72;
    floor.receiveShadow = true;
    scene.add(floor);

    // Background — pure black
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(30, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })
    ));

    // ── CURSOR TRACKING ───────────────────────────────────
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    const onMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onTouchMove = (e) => {
      const t = e.touches[0];
      targetX = (t.clientX / window.innerWidth) * 2 - 1;
      targetY = -((t.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // ── ANIMATION LOOP ────────────────────────────────────
    let t = 0;
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.016;

      curX += (targetX - curX) * 0.055;
      curY += (targetY - curY) * 0.055;

      headGroup.rotation.y = curX * 0.55;
      headGroup.rotation.x = -curY * 0.32;
      robot.rotation.y = curX * 0.06;
      robot.position.y = Math.sin(t * 1.1) * 0.06;

      // Pulsing neon rim glow
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
      rimMat.emissiveIntensity = 2.5 + pulse * 1.2;
      pinkBack.intensity = 4.5 + pulse * 1.5;
      glowLight.intensity = 2.5 + pulse * 0.8;
      edgeMat.opacity = 0.35 + pulse * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    // ── RESIZE ────────────────────────────────────────────
    const onResize = () => {
      const W = mount.clientWidth;
      const H = mount.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    // ── CLEANUP ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        background: "#050005",
        overflow: "hidden",
        display: "block",
        borderRadius: "inherit",
      }}
    />
  );
}