import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

const loadTexture = (path) => {
    const texture = textureLoader.load(path)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
}

export const textures = {
    dirt: loadTexture('/textures/dirt.png'),
    grass: loadTexture('/textures/grass.png'),
    grassSide: loadTexture('/textures/grass_side.png'),
    stone: loadTexture('/textures/stone.png'),
    coalOre: loadTexture('/textures/coal_ore.png'),
    ironOre: loadTexture('/textures/iron_ore.png'),
}
export const blocks = {
    empty: {},
    grass: {
        material: [
            // RightLeft TopBot ForBack
            new THREE.MeshLambertMaterial({ map: textures.grassSide }),
            new THREE.MeshLambertMaterial({ map: textures.grassSide }),
            new THREE.MeshLambertMaterial({ map: textures.grass }),
            new THREE.MeshLambertMaterial({ map: textures.dirt }),
            new THREE.MeshLambertMaterial({ map: textures.grassSide }),
            new THREE.MeshLambertMaterial({ map: textures.grassSide }),
        ],
    },
    dirt: {
        material: new THREE.MeshLambertMaterial({ map: textures.dirt }),
    },
    stone: {
        material: new THREE.MeshLambertMaterial({ map: textures.stone }),
        scale: { x: 30, y: 30, z: 30 },
        scarcity: 0.5,
    },
    coalOre: {
        material: new THREE.MeshLambertMaterial({ map: textures.coalOre }),
        scale: { x: 20, y: 20, z: 20 },
        scarcity: 0.8,
    },
    ironOre: {
        material: new THREE.MeshLambertMaterial({ map: textures.ironOre }),
        scale: { x: 60, y: 60, z: 60 },
        scarcity: 0.9,
    },
}

export const resources = ['stone', 'coalOre', 'ironOre']

export default { blocks, resources }
