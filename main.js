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
    // Lime green color
    const limeGreen = new THREE.Color(0xcdff7c);
    // Complementary color (purple)
    const complementaryColor = new THREE.Color(0x320083);

    // Ambient intensity
    const ambientIntensity = 0.224;

    // Create text material for 'e' with custom shading model
    const textMaterialE = new THREE.ShaderMaterial({
        vertexShader: `
            // Vertex Shader
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            // Fragment Shader
            uniform vec3 color;
            uniform vec3 lightPosition;
            uniform float ambientIntensity;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vec3 ambient = ambientIntensity * color;

                vec3 lightDir = normalize(lightPosition - vPosition);
                float diff = max(dot(vNormal, lightDir), 0.0);
                vec3 diffuse = diff * color;

                vec3 viewDir = normalize(-vPosition);
                vec3 reflectDir = reflect(-lightDir, vNormal);
                float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
                vec3 specular = vec3(0.5) * spec;

                vec3 result = ambient + diffuse + specular;
                gl_FragColor = vec4(result, 1.0);
            }
        `,
        uniforms: {
            color: { value: limeGreen },
            lightPosition: { value: new THREE.Vector3(0, 0, 0) },
            ambientIntensity: { value: ambientIntensity }
        }
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
    const textMeshE = new THREE.Mesh(textGeometryE, textMaterialE);
    textMeshE.position.x = -2; // Position on the left side
    scene.add(textMeshE);

    // Create text material for '4' with custom shading model
    const textMaterial4 = new THREE.ShaderMaterial({
        vertexShader: `
            // Vertex Shader
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            // Fragment Shader
            uniform vec3 color;
            uniform vec3 lightPosition;
            uniform float ambientIntensity;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vec3 ambient = ambientIntensity * color;

                vec3 lightDir = normalize(lightPosition - vPosition);
                float diff = max(dot(vNormal, lightDir), 0.0);
                vec3 diffuse = diff * color;

                vec3 viewDir = normalize(-vPosition);
                vec3 halfDir = normalize(lightDir + viewDir);
                float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0);
                vec3 specular = color * spec;

                vec3 result = ambient + diffuse + specular;
                gl_FragColor = vec4(result, 1.0);
            }
        `,
        uniforms: {
            color: { value: complementaryColor },
            lightPosition: { value: new THREE.Vector3(0, 0, 0) },
            ambientIntensity: { value: ambientIntensity }
        }
    });

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
    const textMesh4 = new THREE.Mesh(textGeometry4, textMaterial4);
    textMesh4.position.x = 2; // Position on the right side
    scene.add(textMesh4);

    // Create a glowing cube at the center
    const glowMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            // Vertex Shader
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            // Fragment Shader
            uniform float time;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0); // Increase the power for more intensity
                vec3 glow = vec3(1.5, 1.5, 1.5) * intensity; // Increase the glow color brightness
                gl_FragColor = vec4(glow, 0.7 + 0.3 * sin(time)); // Adjust alpha for more visibility
            }
        `,
        uniforms: {
            time: { value: 0.0 }
        },
        transparent: true
    });

    const glowGeometry = new THREE.BoxGeometry(1, 1, 1);
    const glowCube = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowCube);

    // Render the scene
    function animate() {
        requestAnimationFrame(animate);
        glowMaterial.uniforms.time.value += 0.05;
        // glowCube.rotation.x += 0.01;
        // glowCube.rotation.y += 0.01;
        textMaterialE.uniforms.lightPosition.value = glowCube.position;
        textMaterial4.uniforms.lightPosition.value = glowCube.position;
        renderer.render(scene, camera);
    }
    animate();
});