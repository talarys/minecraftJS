import * as THREE from 'three'
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshLambertMaterial({ color: 0x00d000 })

export class World extends THREE.Group {
    constructor(size = { width: 64, height: 32 }) {
        super()
        this.size = size
    }

    generate() {
        this.generateTerrain()
        this.generateMeshes()
    }

    generateTerrain() {
        this.data = []
        for (let x = 0; x < this.size.width; x++) {
            const slice = []
            for (let y = 0; y < this.size.width; y++) {
                const row = []
                for (let z = 0; z < this.size.width; z++) {
                    row.push({
                        id: 1,
                        istanceId: null,
                    })
                }
                slice.push(row)
            }
            this.data.push(slice)
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
                    const blockId = this.getBlock(x, y, z).id
                    const instanceId = mesh.count

                    if (blockId !== 0) {
                        matrix.setPosition(x + 0.5, y + 0.5, z + 0.5)
                        mesh.setMatrixAt(instanceId, matrix)
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

    setBlockId(x, y, z, id) {
        if (this.inBounds(x, y, z)) {
            this.data[x][y][z].id = id
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
}
