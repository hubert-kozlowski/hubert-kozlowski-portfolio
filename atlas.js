import * as THREE from './vendor/three.module.min.js';

const MODULES = [
  { id: 'about', color: 0x67e8f9, position: [-2.7, 1.35, -0.45] },
  { id: 'learn-more', color: 0x8be9fd, position: [-0.85, 2.05, 0.38] },
  { id: 'others', color: 0xa78bfa, position: [1.35, 1.42, -0.72] },
  { id: 'industry', color: 0x67e8f9, position: [2.7, 0.05, 0.52] },
  { id: 'community', color: 0x8be9fd, position: [1.18, -1.45, -0.28] },
  { id: 'development', color: 0xa78bfa, position: [-1.15, -1.9, 0.66] },
  { id: 'next', color: 0x67e8f9, position: [-2.9, -0.52, -0.58] }
];

const PRIMARY_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]
];

const CROSS_CONNECTIONS = [
  [0, 4], [1, 5], [2, 5], [3, 6], [1, 3]
];

const clampPixelRatio = () => Math.min(window.devicePixelRatio || 1, 1.75);

const createGlowTexture = (hexColor) => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  const color = `#${hexColor.toString(16).padStart(6, '0')}`;
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.18, color);
  gradient.addColorStop(0.48, `${color}55`);
  gradient.addColorStop(1, `${color}00`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const createParticlePositions = (count) => {
  const positions = new Float32Array(count * 3);
  let seed = 42;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let index = 0; index < count; index += 1) {
    const radius = 2.6 + random() * 2.6;
    const theta = random() * Math.PI * 2;
    const y = (random() - 0.5) * 4.6;
    positions[index * 3] = Math.cos(theta) * radius;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = Math.sin(theta) * radius * 0.72;
  }

  return positions;
};

export function initAtlas() {
  const canvas = document.querySelector('#atlas-canvas');
  const hero = document.querySelector('[data-hero]');

  if (!canvas || !hero) return;

  const probe = document.createElement('canvas');
  const webglAvailable = Boolean(
    probe.getContext('webgl2') ||
    probe.getContext('webgl') ||
    probe.getContext('experimental-webgl')
  );

  if (!webglAvailable) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (error) {
    return;
  }

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverQuery = window.matchMedia('(hover: hover)');

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(clampPixelRatio());
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.15, 7.2);

  const atlasGroup = new THREE.Group();
  scene.add(atlasGroup);

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(createParticlePositions(260), 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
    color: 0x67e8f9,
    size: 0.024,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }));
  atlasGroup.add(particles);

  const buildTraceGeometry = (connections) => {
    const points = [];
    connections.forEach(([startIndex, endIndex]) => {
      points.push(new THREE.Vector3(...MODULES[startIndex].position));
      points.push(new THREE.Vector3(...MODULES[endIndex].position));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  };

  const primaryTraces = new THREE.LineSegments(buildTraceGeometry(PRIMARY_CONNECTIONS), new THREE.LineBasicMaterial({
    color: 0x67e8f9,
    transparent: true,
    opacity: 0.34,
    blending: THREE.AdditiveBlending
  }));
  atlasGroup.add(primaryTraces);

  const crossTraces = new THREE.LineSegments(buildTraceGeometry(CROSS_CONNECTIONS), new THREE.LineBasicMaterial({
    color: 0xa78bfa,
    transparent: true,
    opacity: 0.14,
    blending: THREE.AdditiveBlending
  }));
  atlasGroup.add(crossTraces);

  const nodeGeometry = new THREE.SphereGeometry(0.085, 24, 16);
  const haloScale = 0.78;
  const nodes = MODULES.map((module) => {
    const position = new THREE.Vector3(...module.position);
    const material = new THREE.MeshBasicMaterial({ color: module.color });
    const mesh = new THREE.Mesh(nodeGeometry, material);
    mesh.position.copy(position);
    atlasGroup.add(mesh);

    const haloMaterial = new THREE.SpriteMaterial({
      map: createGlowTexture(module.color),
      color: module.color,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Sprite(haloMaterial);
    halo.position.copy(position);
    halo.scale.setScalar(haloScale);
    atlasGroup.add(halo);

    return {
      ...module,
      mesh,
      halo,
      baseScale: 1,
      targetScale: 1,
      vector: position
    };
  });

  const pulseGeometry = new THREE.SphereGeometry(0.027, 12, 8);
  const pulseMaterial = new THREE.MeshBasicMaterial({
    color: 0xedf4ff,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending
  });
  const pulses = PRIMARY_CONNECTIONS.map(([startIndex, endIndex], index) => {
    const mesh = new THREE.Mesh(pulseGeometry, pulseMaterial.clone());
    atlasGroup.add(mesh);
    return {
      mesh,
      start: nodes[startIndex].vector,
      end: nodes[endIndex].vector,
      offset: index / PRIMARY_CONNECTIONS.length
    };
  });

  let activeModule = '';
  let heroVisible = true;
  let animationFrame = 0;
  let lastTime = 0;
  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;

  const setActiveModule = (id) => {
    activeModule = id || '';
    nodes.forEach((node) => {
      const isActive = node.id === activeModule;
      node.targetScale = isActive ? 1.62 : 1;
      node.halo.material.opacity = isActive ? 0.92 : 0.5;
      node.mesh.material.color.setHex(isActive ? 0xffffff : node.color);
    });
  };

  const resize = () => {
    const width = Math.max(1, hero.clientWidth);
    const height = Math.max(1, hero.clientHeight);
    const aspect = width / height;

    renderer.setPixelRatio(clampPixelRatio());
    renderer.setSize(width, height, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    atlasGroup.position.x = aspect > 1.15 ? 1.45 : 0;
    atlasGroup.position.y = aspect > 1.15 ? -0.05 : 0.35;
    atlasGroup.scale.setScalar(aspect > 1.15 ? 1 : 0.82);
  };

  const updateScene = (time) => {
    const seconds = time * 0.001;
    const delta = Math.min(0.05, Math.max(0.001, seconds - lastTime || 0.016));
    lastTime = seconds;

    pointerX += (targetPointerX - pointerX) * 0.055;
    pointerY += (targetPointerY - pointerY) * 0.055;

    atlasGroup.rotation.y = seconds * 0.045 + pointerX * 0.14;
    atlasGroup.rotation.x = -0.04 + pointerY * 0.08;
    particles.rotation.y = seconds * -0.018;

    nodes.forEach((node, index) => {
      const idlePulse = 1 + Math.sin(seconds * 1.2 + index * 0.72) * 0.035;
      const desiredScale = node.targetScale * idlePulse;
      const currentScale = node.mesh.scale.x;
      const nextScale = currentScale + (desiredScale - currentScale) * Math.min(1, delta * 8);
      node.mesh.scale.setScalar(nextScale);
      node.halo.scale.setScalar(haloScale * nextScale * (node.id === activeModule ? 1.24 : 1));
    });

    pulses.forEach((pulse) => {
      const progress = (seconds * 0.09 + pulse.offset) % 1;
      pulse.mesh.position.lerpVectors(pulse.start, pulse.end, progress);
      pulse.mesh.material.opacity = 0.2 + Math.sin(progress * Math.PI) * 0.62;
    });

    renderer.render(scene, camera);
  };

  const renderStatic = () => {
    atlasGroup.rotation.set(-0.04, 0.18, 0);
    nodes.forEach((node) => {
      const scale = node.id === activeModule ? 1.5 : 1;
      node.mesh.scale.setScalar(scale);
      node.halo.scale.setScalar(haloScale * scale);
    });
    renderer.render(scene, camera);
  };

  const stopAnimation = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  };

  const animate = (time) => {
    animationFrame = requestAnimationFrame(animate);
    if (document.hidden || !heroVisible) return;
    updateScene(time);
  };

  const startAnimation = () => {
    stopAnimation();
    if (reduceMotionQuery.matches) {
      renderStatic();
      return;
    }
    animationFrame = requestAnimationFrame(animate);
  };

  const handlePointerMove = (event) => {
    if (!hoverQuery.matches) return;
    const rect = hero.getBoundingClientRect();
    targetPointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    targetPointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const handlePointerLeave = () => {
    targetPointerX = 0;
    targetPointerY = 0;
  };

  const visibilityObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
    }, { threshold: 0.02 })
    : null;

  if (visibilityObserver) {
    visibilityObserver.observe(hero);
  }

  window.addEventListener('career-system:active-module', (event) => {
    setActiveModule(event.detail?.id);
    if (reduceMotionQuery.matches) {
      renderStatic();
    }
  });

  window.addEventListener('resize', () => {
    resize();
    if (reduceMotionQuery.matches) {
      renderStatic();
    }
  }, { passive: true });

  reduceMotionQuery.addEventListener?.('change', startAnimation);
  hero.addEventListener('pointermove', handlePointerMove, { passive: true });
  hero.addEventListener('pointerleave', handlePointerLeave, { passive: true });
  canvas.addEventListener('webglcontextlost', () => {
    stopAnimation();
    hero.classList.remove('atlas-live');
  });

  resize();
  startAnimation();
  hero.classList.add('atlas-live');
}
