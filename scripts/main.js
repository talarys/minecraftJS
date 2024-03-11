import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { World } from './world'
import { createUi } from './ui'

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x80a0e0)
document.body.appendChild(renderer.domElement)

// Scene Setup
const scene = new THREE.Scene()
const world = new World()
world.generate()
scene.add(world)

// Camera Setup
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
)
camera.position.set(-35, 75, -35)

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

// Stats
const stats = new Stats()
document.body.append(stats.dom)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.update()

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

    controls.target.set(world.size.width / 2, 0, world.size.width / 2)
    camera.lookAt(world.size.width / 2, 0, world.size.width / 2)
    stats.update()
}

createUi(world)
animate()
