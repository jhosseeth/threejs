import * as THREE from '/build/three.module.js';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';


// Scena
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");

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

// Responsive
window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});


// Create a light
const light = new THREE.AmbientLight("white"); // soft white light
scene.add( light );


/* Function to dump put the scenegraph to the javscript console
** Get from https://threejsfundamentals.org/threejs/lessons/threejs-load-gltf.html
*/
const dumpObject = (obj, lines = [], isLast = true, prefix = '') => {
	const localPrefix = isLast ? '└─' : '├─';
	lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
	const newPrefix = prefix + (isLast ? '  ' : '│ ');
	const lastNdx = obj.children.length - 1;

	obj.children.forEach((child, ndx) => {
		const isLast = ndx === lastNdx;
		dumpObject(child, lines, isLast, newPrefix);
	});

	return lines;
}


// Load a glTF resource
var text, earth;
const loader = new GLTFLoader();

loader.load(
	'models/world.gltf',
	gltf => {
		const root = gltf.scene;
		scene.add(root);

		// console.log(dumpObject(root).join('\n'));

		text = root.getObjectByName('Text');
		earth = root.getObjectByName('Earth');
	},
	// called while loading is progressing
	xhr => {
		console.log(`${xhr.loaded / xhr.total * 100}% loaded`);
	},
	// called when loading has errors
	error => console.log('An error happened')
);


// Event for click
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const animate = time => {
	time *= 0.0001;

	if (text) text.rotation.z = time;
	if (earth) earth.rotation.y = time;

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

requestAnimationFrame(animate);