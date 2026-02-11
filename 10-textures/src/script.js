import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Textures
 */
// Texture
/*
const image = new Image();
const texture = new THREE.Texture(image);
// Textures used as map and matcap are supposed to be encoded in sRGB.
// In the latest versions of Three.js we need to specify it by setting
// their colorSpace to THREE.SRGBColorSpace:
texture.colorSpace = THREE.SRGBColorSpace;
image.onload = () => {
  texture.needsUpdate = true;
};
image.src = "/textures/minecraft.png";
*/

// Texture loader
const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = () => {
//   console.log("Loading started");
// };

// loadingManager.onLoad = () => {
//   console.log("Loading finished");
// };

// loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
//   console.log(
//     `Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`
//   );
// };

// loadingManager.onError = () => {
//   console.log("Loading error");
// };

const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("/textures/checkerboard-8x8.png");
// Textures used as map and matcap are supposed to be encoded in sRGB.
// In the latest versions of Three.js we need to specify it by setting
// their colorSpace to THREE.SRGBColorSpace:
colorTexture.colorSpace = THREE.SRGBColorSpace;

const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const heightTexture = textureLoader.load("/textures/door/height.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;
// // colorTexture.offset.x = 0.5;
// colorTexture.rotation = Math.PI / 4;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

// Minification filter
colorTexture.minFilter = THREE.NearestFilter; // This will make the texture look sharper
// when it gets smaller than its original size
colorTexture.generateMipmaps = false; // This will disable mipmaps generation,
// which is not  necessary when using NearestFilter as minFilter

// Magnification filter
colorTexture.magFilter = THREE.NearestFilter; // This will make the texture look sharper
// when it gets bigger than its original size

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
