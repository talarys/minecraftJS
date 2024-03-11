import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise'
import { RNG } from './rng'
import { blocks, resources } from './blocks'

const geometry = new THREE.BoxGeometry(1, 1, 1)

export class World extends THREE.Group {
    size = {
        width: 128,
        height: 32,
    }
    params = {
        seed: 0,
        terrain: {
            scale: 30,
            magnitude: 0.2,
            offset: 0.5,
        },
    }
    data = []
    threshold = 0.5

    generate() {
        const rng = new RNG(this.params.seed)
        this.initialize()
        this.generateResources(rng)
        this.generateTerrain(rng)
        this.generateMeshes()
    }

    initialize() {
        this.data = []
        for (let x = 0; x < this.size.width; x++) {
            const slice = []
            for (let y = 0; y < this.size.height; y++) {
                const row = []
                for (let z = 0; z < this.size.width; z++) {
                    row.push({
                        blockType: 'empty',
                        instanceId: null,
                    })
                }
                slice.push(row)
            }
            this.data.push(slice)
        }
    }

    generateResources(rng) {
        const noiseGenerator = new SimplexNoise(rng)
        for (let resource of resources) {
            for (let x = 0; x < this.size.width; x++) {
                for (let y = 0; y < this.size.height; y++) {
                    for (let z = 0; z < this.size.width; z++) {
                        const value = noiseGenerator.noise3d(
                            x / blocks[resource].scale.x,
                            y / blocks[resource].scale.y,
                            z / blocks[resource].scale.z,
                        )
                        if (value > blocks[resource].scarcity) {
                            this.setBlockType(x, y, z, resource)
                        }
                    }
                }
            }
        }
    }

    generateTerrain(rng) {
        const noiseGenerator = new SimplexNoise(rng)
        for (let x = 0; x < this.size.width; x++) {
            for (let z = 0; z < this.size.width; z++) {
                const value = noiseGenerator.noise(
                    x / this.params.terrain.scale,
                    z / this.params.terrain.scale,
                )

                const scaledNoise =
                    this.params.terrain.offset +
                    this.params.terrain.magnitude * value

                let height = this.size.height * scaledNoise

                height = Math.max(
                    0,
                    Math.min(Math.floor(height), this.size.height - 1),
                )

                for (let y = 0; y < this.size.height; y++) {
                    if (y > height) {
                        this.setBlockType(x, y, z, 'empty')
                    } else if (y === height) {
                        this.setBlockType(x, y, z, 'grass')
                    } else if (this.getBlock(x, y, z).blockType === 'empty') {
                        this.setBlockType(x, y, z, 'dirt')
                    }
                }
            }
        }
    }

    generateMeshes() {
        this.disposeChildren()

        const meshes = {}
        const maxCount = this.size.width * this.size.width * this.size.height

        for (const [key, value] of Object.entries(blocks)) {
            if (key !== 'empty') {
                const mesh = new THREE.InstancedMesh(
                    geometry,
                    value.material,
                    maxCount,
                )
                mesh.name = key
                mesh.count = 0
                meshes[key] = mesh
            }
        }

        const matrix = new THREE.Matrix4()
        for (let x = 0; x < this.size.width; x++) {
            for (let y = 0; y < this.size.height; y++) {
                for (let z = 0; z < this.size.width; z++) {
                    const blockType = this.getBlock(x, y, z).blockType
                    if (blockType === 'empty') continue
                    const mesh = meshes[blockType]
                    const instanceId = mesh.count
                    if (this.isBlockVisible(x, y, z)) {
                        matrix.setPosition(x, y, z)
                        mesh.setMatrixAt(instanceId, matrix)
                        this.setBlockInstanceId(x, y, z, instanceId)
                        mesh.count++
                    }
                }
            }
        }
        this.add(...Object.values(meshes))
    }

    getBlock(x, y, z) {
        if (this.inBounds(x, y, z)) {
            return this.data[x][y][z]
        } else {
            return null
        }
    }

    setBlockType(x, y, z, blockType) {
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].blockType = blockType
        }
    }

    setBlockInstanceId(x, y, z, instanceId) {
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].instanceId = instanceId
        }
    }

    inBounds(x, y, z) {
        if (
            x >= 0 &&
            x < this.size.width &&
            y >= 0 &&
            y < this.size.height &&
            z >= 0 &&
            z < this.size.width
        ) {
            return true
        } else {
            return false
        }
    }

    isBlockVisible(x, y, z) {
        const blocksAroundTarget = [
            [x + 1, y, z],
            [x - 1, y, z],
            [x, y + 1, z],
            // [x, y - 1, z],
            [x, y, z + 1],
            [x, y, z - 1],
        ]

        for (let block of blocksAroundTarget) {
            if ((this.getBlock(...block)?.blockType ?? 'empty') === 'empty') {
                return true
            }
        }
        return false
    }

    disposeChildren() {
        this.traverse((obj) => {
            if (obj.dispose) obj.dispose()
        })
        this.clear()
    }
}
