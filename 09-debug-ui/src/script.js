import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

const gui = new GUI();
const debugObject = {};

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
debugObject.color = "#ff0000";
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObject.color });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");

gui.add(mesh, "visible");

gui.add(material, "wireframe");

gui
  .addColor(material, "color") // Will open a color picker but the color in the tweak is not the same
  // as the one in the scene, because the color in the scene is converted to a hexadecimal value,
  // but the color in the tweak is not.
  // To fix this, we can use the onChange method to update the color in the scene
  // when the color in the tweak changes:
  .onChange((value) => {
    // value here is the material.color
    console.log(value.getHexString());
    // but this is still not a solutuon because we need to take the hex code and put it manually
    // in the color picker, so we can use the onChange method to update the color in the scene
  });

// Solution:
gui.addColor(debugObject, "color").onChange((value) => {
  material.color.set(value);
});

// Spin animation
debugObject.spin = () => {
  gsap.to(mesh.rotation, {
    duration: 1,
    y: mesh.rotation.y + Math.PI * 2
  });
};
gui.add(debugObject, "spin").name("Spin");

// Tweak geometry
// Tweaking the segments
debugObject.subdivision = 2;
gui
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    // not onChange because we don't want to update the geometry on every
    // change (lengthy process for the CPU), but only when the user finishes changing the value

    mesh.geometry.dispose(); // dispose the old geometry to free up memory

    mesh.geometry = new THREE.BoxGeometry(
      1, // width
      1, // height
      1, // depth
      debugObject.subdivision, // width segments
      debugObject.subdivision, // height segments
      debugObject.subdivision // depth segments
    );
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
