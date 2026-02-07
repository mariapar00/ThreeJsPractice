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

// Mesh scale
mesh.scale.x = 2; // Scale the cube in the x-axis by a factor of 2
mesh.scale.y = 0.5; // Scale the cube in the y-axis by a factor of 0.5
mesh.scale.z = 0.5; // Scale the cube in the z-axis by a factor of 0.5
// Faster way:
mesh.scale.set(2, 0.5, 0.5); // Set the scale using set(x, y, z)

// Rotation
mesh.rotation.reorder("YXZ"); // Change the rotation order to YXZ
mesh.rotation.y = 3;

// Add mesh to scene
//scene.add(mesh);

// Group
// Create a group ----- Group()
const group = new THREE.Group();
scene.add(group);

// Create three cubes and add them to the group
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube1.position.x = -2; // Move the first cube to the left
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
group.add(cube2); // The second cube is at the origin (0, 0, 0)

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 2; // Move the third cube to the right
group.add(cube3);

// Move the entire group up
group.position.y = 1;

// Axes helper
// Create an axes helper ----- AxesHelper(size)
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

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

//camera.lookAt(mesh.position); // Make the camera look at the cube

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
