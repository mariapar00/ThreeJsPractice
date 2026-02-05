import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
// Create geometry ----- BoxGeometry(width, height, depth)
const geometry = new THREE.BoxGeometry(1, 1, 1);
// Create material ----- MeshBasicMaterial(parameters)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// Create mesh ----- Mesh(geometry, material)
const mesh = new THREE.Mesh(geometry, material);

// Add mesh to scene
scene.add(mesh);

// Camera
//Create the sizes
const sizes = {
  width: 800,
  height: 600
};
// Create camera ----- PerspectiveCamera(fov, aspect, near, far)
// fov: field of view (in degrees)
// aspect: aspect ratio (width / height)
// near: near clipping plane
// far: far clipping plane
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// Move camera so that it is not inside the cube
// By default, the camera is at (0, 0, 0) and looking down the negative z-axis.
// Move the camera back along the z-axis to see the cube
camera.position.z = 3;

// Add camera to scene
scene.add(camera);

// Renderer
// Create renderer ----- WebGLRenderer(parameters)
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// Render the scene from the perspective of the camera
renderer.render(scene, camera);
