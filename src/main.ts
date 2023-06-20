import { errorMapper } from './modules/errorMapper'
import { generatePixel } from './utils'
import CreepExtension from './extention/creepExtention'
import RoomExtension from './extention/roomExtention'
import SpawnExtention from './spawn/spawnExtention'
import { assignPrototype } from './utils'
export const loop = errorMapper(() => {
    assignPrototype(Creep, CreepExtension)
    assignPrototype(Room, RoomExtension)
    assignPrototype(Spawn, SpawnExtention)
    generatePixel();
    for (const room in Game.rooms) {
        Game.rooms[room].run();
    }
    //throw new Error('我是 sayHello 里的报错')
})

