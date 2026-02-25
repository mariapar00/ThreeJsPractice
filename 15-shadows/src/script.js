import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");
bakedShadow.colorSpace = THREE.SRGBColorSpace;
simpleShadow.colorSpace = THREE.SRGBColorSpace;

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

directionalLight.castShadow = true;

// Shadow map size
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// Near and far
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

// Amplitude of the shadow
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;

directionalLight.shadow.radius = 10; // blur the shadow

// must be added after changing the camera properties
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// hide the helper by default
directionalLightCameraHelper.visible = false;
gui
  .add(directionalLightCameraHelper, "visible")
  .name("show directional light shadow camera");
scene.add(directionalLightCameraHelper);

// Spotlight
const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
spotLight.position.set(0, 2, 2);
spotLight.castShadow = true;
scene.add(spotLight);
scene.add(spotLight.target);

// Shadow map size
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

// Near and far
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

// Amplitude of the shadow
spotLight.shadow.camera.fov = 30; // doesn't work with newer versions of Three.js,
// use the angle parameter of the spotlight instead

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
gui.add(spotLightCameraHelper, "visible").name("show spotlight shadow camera");
scene.add(spotLightCameraHelper);

// Point light
const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// Shadow map size
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

// Near and far
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
gui
  .add(pointLightCameraHelper, "visible")
  .name("show point light shadow camera");
scene.add(pointLightCameraHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
  // new THREE.MeshBasicMaterial({ map: bakedShadow })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

plane.receiveShadow = true;

scene.add(sphere, plane);

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: "#000000",
    alphaMap: simpleShadow, // white is visible, black is invisible
    transparent: true // to make the black part of the texture invisible
  })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01; // move it down right on the plane,
// but a bit above the plane to avoid z-fighting (flickering)
scene.add(sphereShadow);

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
camera.position.z = 2;
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

// Shadows must be enabled on the renderer
renderer.shadowMap.enabled = false; // deactivate
// renderer.shadowMap.type = THREE.BasicShadowMap; // default
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// radius doesn't work with this shadow map type,
// so we need to use a bigger map size to get softer shadows

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update the sphere
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.z = Math.sin(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)); // bounce

  // Update the shadow
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.7; // the higher the sphere,
  // the lighter the shadow

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
