import roles from "../role/base";
import { GetRandomCreepName } from "../utils";
import {CalculateNeedHarvester} from "./utils";
import roleBodys from "../extention/bodyPart";
export default class SpawnExtention extends Spawn {
    //Define a const value
    public static readonly LEAST_ENERGY_TO_SPAWN = 300;
    public run(): void {
        if (this.spawning) return;
        /*
        if(this.store.getUsedCapacity<RESOURCE_ENERGY>()< SpawnExtention.LEAST_ENERGY_TO_SPAWN) {
            console.log("Not enough energy to spawn"+this.store.getCapacity());
            return;
        }
        */
        const creepMemory = SpawnExtention.getBestScreepMemory(this.room);
        //console.log("CreepMemory: " + creepMemory);
        if (creepMemory) {
            this.work(creepMemory);
        }
        else {
            //no need to spawn now
        }

    }
    public work(memory: CreepMemory): ScreepsReturnCode {
        let name = GetRandomCreepName(memory.role);
        let body = roleBodys[memory.role];
        if (!body) return ERR_INVALID_ARGS;
        this.room.memory.roomConfig.BotsStat[memory.role].push(name);
        return super.spawnCreep(body, name, { memory: memory });
    }

    //get the best screep to spawn according to room Memory, return undefined if no need to spawn
    public static getBestScreepMemory(room: Room): CreepMemory | undefined {
        if (!room.memory.roomConfig) return undefined;
        //console.log("harvester: " + room.memory.roomConfig.BotsStat.harvester.length+" "+CalculateNeedHarvester(room, roleBodys.harvester));
        //harvester
        if (room.memory.roomConfig.BotsStat.harvester.length < CalculateNeedHarvester(room, roleBodys.harvester)) {
            //get the source that has the least number of harvester
            let sourceId: string | undefined;
            if(!room.memory.sources){
                console.log("room.memory.sources is undefined");
                return undefined;
            }
            let min_count = 999;
           for(const id in room.memory.sources){
                if(room.memory.sources[id].length<min_count){
                    min_count = room.memory.sources[id].length;
                    sourceId = id;
                }
            }
        
                    
            if (sourceId) {
                return {
                    role: 'harvester',
                    data: {
                        sourceId: sourceId,
                        targetId: undefined,
                    },
                    isPrepareStage: false,
                    working: false,
                }
            }
        }
        if (room.memory.roomConfig.BotsStat.upgrader.length < 2) {
            return {
                role: 'upgrader',
                data: {
                    sourceId: undefined,
                    targetId: undefined,
                },
                isPrepareStage: false,
                working: false,
            }
        }

        if (room.memory.roomConfig.BotsStat.builder.length < 4) {
            return {
                role: 'builder',
                data: {
                    sourceId: undefined,
                    targetId: undefined,
                },
                isPrepareStage: false,
                working: false,
            }
        }

        return undefined;
    }

}