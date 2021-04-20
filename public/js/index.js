import * as THREE from '/build/three.module.js';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';


// Scena
const scene = new THREE.Scene();

// Camera
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Create a light
const light = new THREE.AmbientLight("white"); // soft white light
scene.add( light );


// Load a glTF resource
const loader = new GLTFLoader();
loader.load(
	'models/world.gltf',
	function ( gltf ) {
		scene.add( gltf.scene );
	}
);


// Event for click
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

const animate = function () {
	requestAnimationFrame(animate);
	renderer.render( scene, camera );
};

animate();