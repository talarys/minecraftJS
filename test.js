import { MathUtils } from 'three'

const RNG = (seed) => {
    const random = () => MathUtils.seededRandom(seed)
    return { random }
}

for (let x = 0; x < 10000; x++) {
    console.log(RNG(x).random())
}
