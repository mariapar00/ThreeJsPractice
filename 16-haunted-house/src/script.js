import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/examples/jsm/misc/Timer.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
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

// floor
const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg");
const floorColorTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg"
);
// only for color textures:
floorColorTexture.colorSpace = THREE.SRGBColorSpace;

const floorNormalTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg"
);
const floorARMTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg"
);
const floorDisplacementTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg"
);

floorColorTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);
// to make the texture repeat, we need to set the wrapping mode to RepeatWrapping:
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// wall
const wallColorTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg"
);
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

const wallNormalTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg"
);
const wallARMTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg"
);

// roof
const roofColorTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg"
);
roofColorTexture.colorSpace = THREE.SRGBColorSpace;

const roofNormalTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg"
);
const roofARMTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg"
);

roofColorTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
// I only want the roof texture to repeat in the horizontal direction,
// so I set the vertical repeat to 1, and the horizontal repeat to 3
// (since the roof is 3 times wider than it is taller):
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;

// bush
const bushColorTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg"
);
bushColorTexture.colorSpace = THREE.SRGBColorSpace;

const bushNormalTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg"
);
const bushARMTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg"
);

// grave
const graveColorTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg"
);
graveColorTexture.colorSpace = THREE.SRGBColorSpace;

const graveNormalTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg"
);
const graveARMTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg"
);

graveColorTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);

// door
const doorColorTexture = textureLoader.load("./door/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorAlphaTexture = textureLoader.load("./door/alpha.jpg");
const doorNormalTexture = textureLoader.load("./door/normal.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./door/height.jpg");
const doorRoughnessTexture = textureLoader.load("./door/roughness.jpg");
const doorMetalnessTexture = textureLoader.load("./door/metalness.jpg");

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);
// !!! from now on, we will add all the house elements to this group (instead of the scene) !!!

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    normalMap: wallNormalTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture
  })
);
walls.position.y = 1.25; // move it up by half of its height,
// because half of it is burried below the ground (y=0)
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    normalMap: roofNormalTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture
  })
);
roof.position.y = 2.5 + 0.75; // move it up by the height of the walls + half of its own height
roof.rotation.y = Math.PI * 0.25; // rotate it to fit the walls
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100), // add more vertices (segments)
  // to the door geometry to make it possible to displace it with the height map
  // (displacement map)
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    normalMap: doorNormalTexture,
    aoMap: doorAmbientOcclusionTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04
  })
);
door.position.y = 1.1; // move it up by half of its height
door.position.z = 2 + 0.01; // move it in front of the walls (z=0) by half of the walls depth + a little bit to avoid z-fighting
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#89c854",
  map: bushColorTexture,
  normalMap: bushNormalTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
// to hide the stretch of the texture on the top of the bush:
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

/**
 * Graves
 */
const graves = new THREE.Group();
house.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  normalMap: graveNormalTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture
});

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2; // random angle around the house, from 0 to 2PI
  const radius = 3 + Math.random() * 4; // random radius from the house (between 3 and 7)
  const x = Math.cos(angle) * radius; // x = cos(θ) × r —> gives the horizontal position
  const z = Math.sin(angle) * radius; // z = sin(θ) × r —> gives the depth (vertical) position
  // (since the circle is on the xz plane, the z  acts as y here)

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, Math.random() * 0.4, z); // y=0.4 to place it on the ground
  // (half of its height), and add a random value to make it look more natural (some
  // graves are slightly buried, some are slightly above the ground)
  grave.rotation.y = (Math.random() - 0.5) * 0.4; // random rotation around the y-axis
  grave.rotation.x = (Math.random() - 0.5) * 0.4; // random rotation around the x-axis
  grave.rotation.z = (Math.random() - 0.5) * 0.4; // random rotation around the z-axis
  graves.add(grave);
}

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    normalMap: floorNormalTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Tweaks to find the perfect displacement scale and bias values for the floor:
gui.add(floor.material, "displacementScale").min(0).max(1).step(0.001);
gui.add(floor.material, "displacementBias").min(-1).max(1).step(0.001);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#98baee", 0.275);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#98baee", 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.5);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#ff00ff", 6);
const ghost2 = new THREE.PointLight("#00ffff", 6);
const ghost3 = new THREE.PointLight("#ffff00", 6);
scene.add(ghost1, ghost2, ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
roof.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;
walls.receiveShadow = true;

// loop through the graves group
graves.children.forEach((grave) => {
  grave.castShadow = true;
  grave.receiveShadow = true;
});

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.near = 1;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

/**
 * Sky
 */
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

/**
 * Fog
 */
// const fog = new THREE.Fog("#262837", 1, 13);
const fog = new THREE.FogExp2("#262837", 0.1); // more realistic
scene.fog = fog;

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update ghost positions
  const ghost1Angle = elapsedTime * 0.5; // angle = time × speed
  ghost1.position.x = Math.cos(ghost1Angle) * 4; // x = cos(θ) × r
  ghost1.position.z = Math.sin(ghost1Angle) * 4; // z = sin(θ) × r
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45); // y = sin(θ) × sin(θ × 2.34) × sin(θ × 3.45)
  // —> more complex movement by multiplying several sine waves

  const ghost2Angle = -elapsedTime * 0.38; // negative to make it rotate in the opposite direction
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 1.5) *
    Math.sin(ghost2Angle * 2.5);

  const ghost3Angle = elapsedTime * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * 6;
  ghost3.position.z = Math.sin(ghost3Angle) * 6;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 1.2) *
    Math.sin(ghost3Angle * 2.3);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
