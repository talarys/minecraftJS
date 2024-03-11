import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { blocks, resources } from './blocks'

export function createUi(world) {
    const gui = new GUI()

    const terrainFolder = gui.addFolder('World Terrain')
    terrainFolder.add(world.size, 'width', 1, 128, 1).name('Width')
    terrainFolder.add(world.size, 'height', 1, 128, 1).name('Height')
    terrainFolder.add(world.params, 'seed', 0, 100000, 100).name('Seed')
    terrainFolder.add(world.params.terrain, 'scale', 10, 100).name('Scale')
    terrainFolder.add(world.params.terrain, 'magnitude', 0, 1).name('Magnitude')
    terrainFolder.add(world.params.terrain, 'offset', 0, 1).name('Offset')

    const resourcesFolder = gui.addFolder('Resources')
    for (let resource of resources) {
        const resourceFolder = resourcesFolder.addFolder(resource)
        resourceFolder.add(blocks[resource], 'scarcity', 0, 1).name('Scarcity')
        resourceFolder.add(blocks[resource].scale, 'x', 10, 100).name('X Scale')
        resourceFolder.add(blocks[resource].scale, 'y', 10, 100).name('Y Scale')
        resourceFolder.add(blocks[resource].scale, 'z', 10, 100).name('Z Scale')
    }

    gui.onChange(() => {
        world.generate()
    })
}
