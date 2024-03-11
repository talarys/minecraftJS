import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { World } from './world'
import { renderer } from './renderer'
import { createUi } from './ui'

const worldSize = { width: 128, height: 32 }

// Camera Setup
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight
)
camera.position.set(-32, 96, -32)
camera.lookAt(worldSize.width / 2, 0, worldSize.width / 2)

// Stats
const stats = new Stats()
document.body.append(stats.dom)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(worldSize.width / 2, 0, worldSize.width / 2)

// Scene Setup
const scene = new THREE.Scene()
const world = new World(worldSize)
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

createUi(world)
animate()
