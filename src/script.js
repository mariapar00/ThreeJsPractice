import * as THREE from "three";
// y-axis is up, x-axis is right, and z-axis is towards the viewer.
// I choose my metric system

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
mesh.position.x = 0.7; // Move the cube to the right
mesh.position.y = -0.6; // Move the cube down
mesh.position.z = 1; // Move the cube towards the viewer
// Faster way:
mesh.position.set(0.7, -0.6, 1); // Set the position using set(x, y, z)

// Add mesh to scene
scene.add(mesh);

// console.log(mesh.position.length()); // 1.140175425099138
// mesh.position.normalize(); // Normalize the position vector to have a length of 1
// console.log(mesh.position.length()); // 1

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

// Distance between camera and cube
const distance = camera.position.distanceTo(mesh.position);
console.log(distance); // 2.345207879911715

// Renderer
// Create renderer ----- WebGLRenderer(parameters)
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

// Render the scene from the perspective of the camera
renderer.render(scene, camera);

// I can define the positions anywhere in the code,
// but I need to render the scene after defining the positions,
// otherwise I won't see the changes.
// Rendering is like taking a picture of the scene from the perspective of the camera.
