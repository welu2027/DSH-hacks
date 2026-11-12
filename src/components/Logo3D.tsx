"use client";

import { useEffect, useRef } from "react";

/* The DSH Hacks mark as a 3D coin: the circle logo on both faces of a
   white disc with a metallic DSH-blue rim, turning slowly and leaning
   toward the pointer. three loads only when the coin scrolls near; paused
   off screen; reduced motion: still, at a three-quarter angle. */
export default function Logo3D({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let dispose = () => {};
    let gone = false;

    const start = async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (gone) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
      camera.position.set(0, 0, 6.2);

      const blue = new THREE.Color(getComputedStyle(el).getPropertyValue("--blue-600").trim() || "#2F5FD0");
      const tex = await new THREE.TextureLoader().loadAsync("/dsh-logo-circle.png");
      if (gone) { renderer.dispose(); return; }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;

      // the coin: rim, then a logo decal laid over each white face
      const coin = new THREE.Group();
      const R = 1.25, T = 0.2;
      const rimMat = new THREE.MeshStandardMaterial({ color: blue, metalness: 0.9, roughness: 0.28 });
      const faceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.45 });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, T, 96, 1), [rimMat, faceMat, faceMat]);
      body.rotation.x = Math.PI / 2;
      coin.add(body);
      const lip = new THREE.Mesh(new THREE.TorusGeometry(R, 0.06, 24, 128), rimMat);
      lip.scale.z = T / 0.12; // a rounded edge as thick as the coin
      coin.add(lip);
      const decal = new THREE.MeshStandardMaterial({ map: tex, transparent: true, metalness: 0.35, roughness: 0.35 });
      for (const side of [1, -1]) {
        const face = new THREE.Mesh(new THREE.CircleGeometry(R * 0.97, 96), decal);
        face.position.z = side * (T / 2 + 0.002);
        if (side < 0) face.rotation.y = Math.PI;
        coin.add(face);
      }
      scene.add(coin);
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(2, 3, 4);
      scene.add(key, new THREE.AmbientLight(0xffffff, 0.5));

      const size = () => {
        const w = el.clientWidth;
        renderer.setSize(w, w, false);
        renderer.domElement.style.width = renderer.domElement.style.height = "100%";
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(el);

      let tx = 0, ty = 0, spin = reduce ? -0.45 : 0, raf = 0, on = true;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 0.9;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 0.6;
      };
      window.addEventListener("pointermove", move, { passive: true });

      const frame = (t: number) => {
        // sway rather than spin, so the face stays toward the viewer
        if (!reduce) spin = Math.sin(t / 2200) * 0.75;
        coin.rotation.y += (spin + tx - coin.rotation.y) * 0.08;
        coin.rotation.x += (ty - coin.rotation.x) * 0.08;
        coin.position.y = reduce ? 0 : Math.sin(t / 1400) * 0.06;
        renderer.render(scene, camera);
        raf = on ? requestAnimationFrame(frame) : 0;
      };
      raf = requestAnimationFrame(frame);
      const io = new IntersectionObserver(([e]) => {
        on = e.isIntersecting;
        if (on && !raf) raf = requestAnimationFrame(frame);
      });
      io.observe(el);

      dispose = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", move);
        tex.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // load three only once the coin is close to the viewport
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      start();
    }, { rootMargin: "400px" });
    near.observe(el);

    return () => { gone = true; near.disconnect(); dispose(); };
  }, []);

  return <div ref={ref} className={`logo3d ${className}`} role="img" aria-label="DSH Hacks logo" />;
}
