import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

export function createUi(world) {
    const gui = new GUI()

    gui.add(world.size, 'width', 8, 128, 1).name('width')
    gui.add(world.size, 'height', 8, 128, 1).name('height')

    gui.onChange(() => {
        world.generate()
    })
}
