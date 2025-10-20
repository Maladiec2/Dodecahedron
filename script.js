// Import from CDN (these work perfectly on GitHub Pages)
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/controls/OrbitControls.js";

// Get the canvas and set up the renderer
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create the scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(3, 3, 3);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
const point = new THREE.PointLight(0xffffff, 1);
point.position.set(5, 5, 5);
scene.add(ambient, point);

// Create dodecahedron wireframe
const geometry = new THREE.DodecahedronGeometry(1);
const edges = new THREE.EdgesGeometry(geometry);
const material = new THREE.LineBasicMaterial({ color: 0x00ffcc });
const wireframe = new THREE.LineSegments(edges, material);
scene.add(wireframe);

// KPI control functions
export function setLineColor(hexColor) {
  wireframe.material.color.set(hexColor);
}

export function setLineLength(scaleFactor) {
  wireframe.scale.set(scaleFactor, scaleFactor, scaleFactor);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  wireframe.rotation.y += 0.003;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
