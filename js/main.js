// Import the necessary modules
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.js Scene
const scene = new THREE.Scene();
// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Keep the 3D object on a global variable so we can access it later
let object;

// OrbitControls allow the camera to move around the scene
let controls;

// Set which object to render
let objToRender = 'castle';

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
    `models/${objToRender}/scene.gltf`,
    function (gltf) {
      // If the file is loaded, add it to the scene
      object = gltf.scene;
      scene.add(object);
    },
    function (xhr) {
      // While it is loading, log the progress
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      // If there is an error, log it
      console.error(error);
    }
);

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

// Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dino" ? 25 : 500;

// Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);
const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

// This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "castle") {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true; // Enable auto rotation
}

// Set a flag to control the camera panning
let isPanning = true;

// Function to toggle camera panning
function togglePanning() {
  isPanning = !isPanning;
  controls.autoRotate = isPanning; // Enable or disable auto rotation based on the flag
}

// Update controlCameraPanning function
function controlCameraPanning() {
  if (isPanning && !isDragging) {
    controls.update();
  }
}

// Add event listeners for mouse interactions
let isDragging = false;

document.addEventListener('mousedown', () => {
  isDragging = true;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

document.addEventListener('mousemove', (event) => {
  if (isDragging && !isPanning) {
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    const sensitivity = 0.1; // Adjust sensitivity as needed
    controls.rotateLeft(-movementX * sensitivity);
    controls.rotateUp(-movementY * sensitivity);
  }
});

// Add a button to toggle panning
const togglePanningButton = createButton("Toggle Panning", togglePanning);

// Function to create a button and attach an event listener
function createButton(label, onClick) {
  const button = document.createElement("button");
  button.textContent = label;
  button.classList.add("btn"); // Add 'btn' class for styling
  button.addEventListener("click", onClick);
  document.body.appendChild(button);
  return button;
}

// Function to animate the scene
function animate() {
  requestAnimationFrame(animate);

  // Control camera panning
  controlCameraPanning();

  // Render the scene
  renderer.render(scene, camera);
}

// Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the 3D rendering
animate();

