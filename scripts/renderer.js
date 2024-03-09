import * as THREE from 'three'

export const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x80a0e0)
document.body.appendChild(renderer.domElement)
