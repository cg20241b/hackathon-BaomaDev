// Import Three.js
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load a font and create text meshes
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            // Vertex Shader
            varying vec3 vUv; 
            void main() {
                vUv = position; 
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            // Fragment Shader
            varying vec3 vUv;
            void main() {
                gl_FragColor = vec4(vUv * 0.5 + 0.5, 1.0);
            }
        `
    });

    // Create text geometry for 'e'
    const textGeometryE = new TextGeometry('e', {
        font: font,
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });
    const textMeshE = new THREE.Mesh(textGeometryE, textMaterial);
    textMeshE.position.x = -2; // Position on the left side
    scene.add(textMeshE);

    // Create text geometry for '4'
    const textGeometry4 = new TextGeometry('4', {
        font: font,
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });
    const textMesh4 = new THREE.Mesh(textGeometry4, textMaterial);
    textMesh4.position.x = 2; // Position on the right side
    scene.add(textMesh4);

    // Render the scene
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
});