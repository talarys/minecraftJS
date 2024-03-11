import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise'
import { RNG } from './rng'
import { blocks } from './blocks'

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshLambertMaterial()

export class World extends THREE.Group {
    constructor(size = { width: 64, height: 32 }) {
        super()
        this.size = size
        this.data = []
        this.params = {
            terrain: {
                seed: 1043,
                scale: 30,
                magnitude: 0.5,
                offset: 0.2,
            },
        }
    }

    generate() {
        this.initializeTerrain()
        this.generateTerrain()
        this.generateMeshes()
    }

    initializeTerrain() {
        this.data = []
        for (let x = 0; x < this.size.width; x++) {
            const slice = []
            for (let y = 0; y < this.size.width; y++) {
                const row = []
                for (let z = 0; z < this.size.width; z++) {
                    row.push({
                        blockType: 'empty',
                        istanceId: null,
                    })
                }
                slice.push(row)
            }
            this.data.push(slice)
        }
    }

    generateTerrain() {
        const rng = new RNG(this.params.terrain.seed)
        const simplex = new SimplexNoise(rng)
        for (let x = 0; x < this.size.width; x++) {
            for (let y = 0; y < this.size.height; y++) {
                for (let z = 0; z < this.size.width; z++) {
                    const value = simplex.noise(
                        x / this.params.terrain.scale,
                        z / this.params.terrain.scale
                    )

                    const scaledNoise =
            this.params.terrain.offset + this.params.terrain.magnitude * value

                    let height = Math.min(
                        Math.floor(this.size.height * scaledNoise),
                        this.size.height - 1
                    )
                    height = height >= 0 ? height : 0

                    for (let y = 0; y <= this.size.height; y++) {
                        if (y < height) {
                            this.setBlockType(x, y, z, 'dirt')
                        } else if (y === height) {
                            this.setBlockType(x, y, z, 'grass')
                        } else {
                            this.setBlockType(x, y, z, 'empty')
                        }
                    }
                }
            }
        }
    }

    generateMeshes() {
        this.clear()
        const maxCount = this.size.width * this.size.width * this.size.height
        const mesh = new THREE.InstancedMesh(geometry, material, maxCount)
        mesh.count = 0

        const matrix = new THREE.Matrix4()
        for (let x = 0; x < this.size.width; x++) {
            for (let y = 0; y < this.size.height; y++) {
                for (let z = 0; z < this.size.width; z++) {
                    const blockType = this.getBlock(x, y, z).blockType
                    const instanceId = mesh.count

                    if (blockType !== 'empty' && this.isBlockVisible(x, y, z)) {
                        matrix.setPosition(x + 0.5, y + 0.5, z + 0.5)
                        mesh.setMatrixAt(instanceId, matrix)
                        mesh.setColorAt(
                            instanceId,
                            new THREE.Color(blocks[blockType].color)
                        )
                        this.setBlockInstanceId(x, y, z, instanceId)
                        mesh.count++
                    }
                }
            }
        }

        this.add(mesh)
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
}
