// ----- Imports -----
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/controls/OrbitControls.js';

// ----- Renderer, Scene, Camera -----
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(3,3,3);

// ----- Controls -----
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.5;
controls.maxDistance = 10;

// ----- Lights -----
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const pl = new THREE.PointLight(0xffffff,1);
pl.position.set(5,5,5);
scene.add(pl);

// ----- Dodecahedron Geometry -----
const dodeGeom = new THREE.DodecahedronGeometry(1);
const edgesGeom = new THREE.EdgesGeometry(dodeGeom);
const posAttr = edgesGeom.attributes.position;
const positions = posAttr.array;
const vertexCount = posAttr.count;
const segmentCount = vertexCount / 2;

// colors per vertex
const colors = new Float32Array(vertexCount * 3);
const defaultColor = new THREE.Color(0x00ffcc);
for(let i=0;i<vertexCount;i++){
  colors[i*3+0]=defaultColor.r;
  colors[i*3+1]=defaultColor.g;
  colors[i*3+2]=defaultColor.b;
}

const lineGeom = new THREE.BufferGeometry();
lineGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions),3));
lineGeom.setAttribute('color', new THREE.BufferAttribute(colors,3));

const lineMat = new THREE.LineBasicMaterial({ vertexColors:true, toneMapped:false, linewidth:1 });
const lineSegments = new THREE.LineSegments(lineGeom,lineMat);
scene.add(lineSegments);

// copy original positions for scaling
const originalPositions = lineGeom.attributes.position.array.slice();

// ----- Utility Functions -----
function applyGlobalColor(hex){
  const c = new THREE.Color(hex);
  const colAttr = lineGeom.attributes.color;
  for(let i=0;i<vertexCount;i++){
    colAttr.array[i*3+0]=c.r;
    colAttr.array[i*3+1]=c.g;
    colAttr.array[i*3+2]=c.b;
  }
  colAttr.needsUpdate=true;
}

function applyEdgeColorList(colorsList){
  const colAttr = lineGeom.attributes.color;
  for(let s=0;s<Math.min(colorsList.length,segmentCount);s++){
    const c = new THREE.Color(colorsList[s]);
    const vi0 = s*2, vi1 = s*2+1;
    [vi0,vi1].forEach(v=>{
      colAttr.array[v*3+0] = c.r;
      colAttr.array[v*3+1] = c.g;
      colAttr.array[v*3+2] = c.b;
    });
  }
  colAttr.needsUpdate=true;
}

function randomizeEdgeColors(){
  const arr=[];
  for(let i=0;i<segmentCount;i++){
    arr.push('#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,'0'));
  }
  applyEdgeColorList(arr);
}

function setEdgeScale(scaleFactor){
  const pos = lineGeom.attributes.position.array;
  for(let i=0;i<pos.length;i+=3){
    pos[i]   = originalPositions[i]*scaleFactor;
    pos[i+1] = originalPositions[i+1]*scaleFactor;
    pos[i+2] = originalPositions[i+2]*scaleFactor;
  }
  lineGeom.attributes.position.needsUpdate=true;
  lineGeom.computeBoundingSphere();
}

// HSL -> HEX helper
function hslToHex(h,s,l){
  s/=100;l/=100;
  const k=n=>(n+h/30)%12;
  const a=s*Math.min(l,1-l);
  const f=n=>l-a*Math.max(Math.min(k(n)-3,9-k(n),1),-1);
  const toHex=x=>Math.round(255*x).toString(16).padStart(2,'0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

// ----- Animation -----
function animate(){
  requestAnimationFrame(animate);
  lineSegments.rotation.y+=0.003;
  controls.update();
  renderer.render(scene,camera);
}
animate();

// ----- Responsive -----
window.addEventListener('resize',()=>{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});

// ----- UI -----
const globalColorInput=document.getElementById('globalColor');
const applyGlobalBtn=document.getElementById('applyGlobal');
const scaleRange=document.getElementById('scaleRange');
const scaleVal=document.getElementById('scaleVal');
const randomizeBtn=document.getElementById('randomize');
const resetBtn=document.getElementById('reset');
const colorListTA=document.getElementById('colorList');
const applyListBtn=document.getElementById('applyList');
const autoFillBtn=document.getElementById('autoFill');

applyGlobalBtn.addEventListener('click',()=>applyGlobalColor(globalColorInput.value));
scaleRange.addEventListener('input',e=>{
  const v=parseFloat(e.target.value);
  scaleVal.textContent=v.toFixed(2);
  setEdgeScale(v);
});
randomizeBtn.addEventListener('click',()=>randomizeEdgeColors());
resetBtn.addEventListener('click',()=>{
  applyGlobalColor(globalColorInput.value);
  setEdgeScale(1);
  scaleRange.value=1;
  scaleVal.textContent='1.00';
  colorListTA.value='';
});
applyListBtn.addEventListener('click',()=>{
  const text=colorListTA.value.trim();
  if(!text) return;
  const tokens=text.split(/[\s,]+/).map(s=>s.trim()).filter(Boolean);
  const norm=tokens.map(t=>{
    if(/^#?[0-9a-fA-F]{6}$/.test(t)) return t.startsWith('#')?t:'#'+t;
    if(/^#?[0-9a-fA-F]{3}$/.test(t)){
      let s=t.startsWith('#')?t.slice(1):t;
      s=s.split('').map(ch=>ch+ch).join('');
      return '#'+s;
    }
    return null;
  }).filter(Boolean);
  if(norm.length===0){alert('No valid hex colors found');return;}
  applyEdgeColorList(norm);
});
autoFillBtn.addEventListener('click',()=>{
  const sample=[];
  for(let i=0;i<segmentCount;i++){
    const hue=(i/segmentCount)*360;
    sample.push(hslToHex(hue,75,50));
  }
  colorListTA.value=sample.join(',');
  applyEdgeColorList(sample);
});

// Initialize defaults
applyGlobalColor(globalColorInput.value);
setEdgeScale(1);
