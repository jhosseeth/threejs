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
camera.position.z = (window.innerWidth < 500) ? 7 : 4;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);


// Responsive
window.addEventListener('resize', () => {
	camera.position.z = (window.innerWidth < 500) ? 7 : 4;
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
		let domLoader = document.getElementById("loader");
		let domOverCanvas = document.getElementById("overCanvas");
		let percLoaded = xhr.loaded / xhr.total * 100;

		if (percLoaded == 100) {
			// allows the charger to be visible for at least 2 seconds 
			setTimeout(function(){
				domLoader.style.visibility = "hidden"; // hide loader
				domOverCanvas.style.display  = "block"; // show button to orbit model
				document.body.appendChild(renderer.domElement); // show canvas
			}, 2000);
		}
	},
	// called when loading has errors
	error => console.log('An error happened: ', error)
);

const animate = time => {
	time *= 0.0001;

	if (text) text.rotation.z = time * (-1); // Use -1 to change the direction of rotation 
	if (earth) earth.rotation.y = time * (-1);

	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

requestAnimationFrame(animate);


/* ===========================================================
** 						ORBIT CONTROLS
** =========================================================== */
const btn = document.getElementById("toOrbit");
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
controls.enabled = false; // the controls will not respond to user input

// Add event to orbit around the model
btn.addEventListener('click', event => {
	controls.enabled = controls.enabled ? false : true;
	renderer.domElement.className =  controls.enabled ? "grab" : "";
	document.getElementsByClassName("text")[0].innerHTML = controls.enabled ? "Click to stop orbiting" : "Click to orbit"; 
});

// Add grabbing cursor style when an interaction was initiated. 
controls.addEventListener('start', event => {
	renderer.domElement.className = "grabbing";
});

// Add grab cursor style when an interaction has finished.
controls.addEventListener('end', event => {
	renderer.domElement.className = "grab";
});
