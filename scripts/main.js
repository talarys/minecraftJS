import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { World } from './world'
import { renderer } from './renderer'

// Camera Setup
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
)
camera.position.set(-32, 16, -32)
camera.lookAt(0, 0, 0)

// Stats
const stats = new Stats()
document.body.append(stats.dom)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(16, 0, 16)

// Scene Setup
const scene = new THREE.Scene()
const world = new World()
world.generate()
scene.add(world)

// Lights
const light1 = new THREE.DirectionalLight()
light1.position.set(1, 1, 1)
scene.add(light1)

const light2 = new THREE.DirectionalLight()
light1.position.set(-1, 1, -0.5)
scene.add(light2)

const ambient = new THREE.AmbientLight()
ambient.intensity = 0.1
scene.add(ambient)

// AutoResize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    stats.update()
    renderer.render(scene, camera)
}

animate()
