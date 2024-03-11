export const blocks = {
    empty: {},
    grass: { color: 0x559020 },
    dirt: { color: 0x807020 },
    stone: { color: 0x808080, scale: { x: 30, y: 30, z: 30 }, scarcity: 0.5 },
    coal: { color: 0x202020, scale: { x: 20, y: 20, z: 20 }, scarcity: 0.8 },
    iron: { color: 0x806060, scale: { x: 60, y: 60, z: 60 }, scarcity: 0.9 },
}

export const resources = ['stone', 'coal', 'iron']

export default { blocks, resources }
