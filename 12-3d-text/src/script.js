import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();

// load(url: string, onLoad: function, onProgress: function, onError: function)
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // TextGeometry(text: string, parameters: object)
  const textGeometry = new TextGeometry("Hello Three.js", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 5, // lower to improve performance (less triangles to render in curved areas)
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4 // lower to improve performance (less triangles to render in bevel areas)
  });

  textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -0.5 * (textGeometry.boundingBox.max.x - 0.02),
  //     -0.5 * (textGeometry.boundingBox.max.y - 0.02),
  //     -0.5 * (textGeometry.boundingBox.max.z - 0.03)
  //   );
  // SIMPLER:
  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);

  // Calculate the time it takes to create the donuts,
  // to see the performance impact of creating 100 objects with a geometry and material each
  console.time("donuts");

  // One geometry and one material for 100 meshes (from 13ms to 1.13ms)
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  // we can remove donutMaterial and reuse the same material as the text, since it doesn't have to be different
  //   const donutMaterial = new THREE.MeshMatcapMaterial({
  //     matcap: matcapTexture
  //   });

  // Create 100 donuts
  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);

    // Random position
    // minus 0.5 to center the distribution around the origin (as many positive as negative)
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    // Random rotation
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    // Random scale
    const scale = Math.random();
    donut.scale.set(scale, scale, scale); // same scale for all axes, otherwise it would be a random stretch

    scene.add(donut);
  }
  console.timeEnd("donuts");
});

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
