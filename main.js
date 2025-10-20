import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Renderer setup
const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene + camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(3, 3, 3);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
const point = new THREE.PointLight(0xffffff, 1);
point.position.set(5, 5, 5);
scene.add(ambient, point);

// Dodecahedron wireframe
const geometry = new THREE.DodecahedronGeometry(1);
const edges = new THREE.EdgesGeometry(geometry);
const material = new THREE.LineBasicMaterial({ color: 0x00ffcc });
const wireframe = new THREE.LineSegments(edges, material);
scene.add(wireframe);

// Functions to modify KPIs
export function setLineColor(hexColor) {
  wireframe.material.color.set(hexColor);
}

export function setLineLength(scaleFactor) {
  wireframe.scale.set(scaleFactor, scaleFactor, scaleFactor);
}

// Animate
function animate() {
  requestAnimationFrame(animate);
  wireframe.rotation.y += 0.003;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
