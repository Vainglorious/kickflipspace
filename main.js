import * as THREE from 'three';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x050510);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
camera.position.set(0, 3, 14);
camera.lookAt(0, 0, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0x2233aa, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
sunLight.position.set(-8, 6, 4);
scene.add(sunLight);

const rimLight = new THREE.DirectionalLight(0x8844ff, 1.2);
rimLight.position.set(6, -2, -4);
scene.add(rimLight);

// Stars
function makeStars(count) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    pos[i] = (Math.random() - 0.5) * 400;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.35,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
  });
  return new THREE.Points(geo, mat);
}
const stars = makeStars(2500);
scene.add(stars);

// Nebula glow — large transparent sphere around scene
const nebulaGeo = new THREE.SphereGeometry(180, 16, 16);
const nebulaMat = new THREE.MeshBasicMaterial({
  color: 0x1a0444,
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.35,
});
scene.add(new THREE.Mesh(nebulaGeo, nebulaMat));

// Meteor
const meteorGeo = new THREE.IcosahedronGeometry(2.2, 1);
// Slightly distort vertices for a rougher look
const mPos = meteorGeo.attributes.position;
for (let i = 0; i < mPos.count; i++) {
  mPos.setXYZ(
    i,
    mPos.getX(i) + (Math.random() - 0.5) * 0.4,
    mPos.getY(i) + (Math.random() - 0.5) * 0.4,
    mPos.getZ(i) + (Math.random() - 0.5) * 0.4,
  );
}
meteorGeo.computeVertexNormals();

const meteorMat = new THREE.MeshStandardMaterial({
  color: 0x7a6e5a,
  roughness: 0.95,
  metalness: 0.05,
});
const meteor = new THREE.Mesh(meteorGeo, meteorMat);
meteor.position.set(1.2, -1.5, 0);
scene.add(meteor);

// Glow halo around meteor (sprite-based)
const glowTex = makeGlowTexture();
const glowMat = new THREE.SpriteMaterial({
  map: glowTex,
  color: 0xff6633,
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const meteorGlow = new THREE.Sprite(glowMat);
meteorGlow.scale.set(12, 12, 1);
meteor.add(meteorGlow);

function makeGlowTexture() {
  const size = 128;
  const cnv = document.createElement('canvas');
  cnv.width = size;
  cnv.height = size;
  const ctx = cnv.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,180,80,0.6)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(cnv);
}

// Skateboard (built from Three.js primitives)
function makeSkateboard() {
  const group = new THREE.Group();

  const deckMat = new THREE.MeshStandardMaterial({ color: 0xe8c96b, roughness: 0.6 });
  const truckMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3 });
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
  const wheelRimMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.7, roughness: 0.2 });

  // Deck
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 0.12, 0.9),
    deckMat,
  );
  // Nose/tail slight kick — fake with a tapered look via a CylinderGeometry-based approach
  group.add(deck);

  // Trucks (2)
  const truckPositions = [-1.1, 1.1];
  truckPositions.forEach((xPos) => {
    const axle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1.1, 8),
      truckMat,
    );
    axle.rotation.z = Math.PI / 2;
    axle.position.set(xPos, -0.1, 0);
    group.add(axle);

    const hanger = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.15, 0.5),
      truckMat,
    );
    hanger.position.set(xPos, -0.07, 0);
    group.add(hanger);
  });

  // Wheels (4)
  const wheelXs = [-1.1, 1.1];
  const wheelZs = [-0.52, 0.52];
  wheelXs.forEach((wx) => {
    wheelZs.forEach((wz) => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 0.2, 16),
        wheelMat,
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, -0.2, wz);
      group.add(wheel);

      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.22, 8),
        wheelRimMat,
      );
      rim.rotation.z = Math.PI / 2;
      rim.position.set(wx, -0.2, wz);
      group.add(rim);
    });
  });

  // Grip tape stripe
  const tape = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.01, 0.85),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1 }),
  );
  tape.position.y = 0.07;
  group.add(tape);

  return group;
}

const board = makeSkateboard();
board.position.set(-3, 2, 0);
scene.add(board);

// Particle trail for the board
const trailGeo = new THREE.BufferGeometry();
const trailCount = 60;
const trailPositions = new Float32Array(trailCount * 3);
trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
const trailMat = new THREE.PointsMaterial({
  color: 0xaa66ff,
  size: 0.12,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const trail = new THREE.Points(trailGeo, trailMat);
scene.add(trail);
const trailHistory = Array.from({ length: trailCount }, () => new THREE.Vector3(-99, -99, -99));

// Resize handling
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// Animation
const FLIP_DURATION = 1.6;   // seconds per kickflip cycle
const ARC_HEIGHT = 4.2;       // how high the board jumps
const ORBIT_RADIUS = 3.8;     // horizontal orbit radius around meteor

let elapsed = 0;
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  elapsed += dt;

  // Stars drift
  stars.rotation.y += 0.00008;
  stars.rotation.x += 0.00003;

  // Meteor rotation + slow bob
  meteor.rotation.y += 0.004;
  meteor.rotation.x += 0.001;
  meteor.position.y = -1.5 + Math.sin(elapsed * 0.3) * 0.15;

  // Board kickflip orbit
  const t = (elapsed % FLIP_DURATION) / FLIP_DURATION; // 0→1 per cycle

  // Orbit angle: full 360° per cycle, offset so board passes OVER the meteor
  const angle = t * Math.PI * 2 - Math.PI * 0.5;
  const bx = Math.cos(angle) * ORBIT_RADIUS + meteor.position.x;
  const bz = Math.sin(angle) * 1.2;

  // Arc height peaks when passing over meteor (angle ≈ 0)
  const arcPhase = Math.cos(angle);
  const by = meteor.position.y + 1.0 + Math.max(0, arcPhase) * ARC_HEIGHT;

  board.position.set(bx, by, bz);

  // Kickflip: rotate on board's long axis when ascending / over top
  board.rotation.x = elapsed * 5.5;   // continuous spin on long axis (the kickflip)
  board.rotation.y = -angle + Math.PI; // face direction of travel

  // Trail
  trailHistory.unshift(board.position.clone());
  trailHistory.length = trailCount;
  const tp = trailGeo.attributes.position;
  trailHistory.forEach((p, i) => {
    tp.setXYZ(i, p.x, p.y, p.z);
  });
  tp.needsUpdate = true;
  trailMat.opacity = 0.5;

  renderer.render(scene, camera);
}

animate();
