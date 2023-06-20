import SpawnExtention from '../spawn/spawnExtention';


export default class RoomExtention extends Room {
    public run(): void {
        if (this.controller && this.controller.my) {
            //if my room then work
            this.work();
        }
        else {
            //this.runOtherRoom();
        }
    }

    public work(): void {
        //Init Memory
        if (!this.memory.isInit) {
            this.initMemory();
        }
        //Count Screeps every 300 ticks to avoid mistake
        if (Game.time % 300 == 0) {
            this.countScreeps();
        }
        //Run Spawn
        this.memory.spawnsId.forEach(spawnId => {
            const spawn = Game.getObjectById(spawnId) as SpawnExtention;
            //Assign CreepConfig according to the current role
            if (spawn && spawn.my) {
                spawn.run();
            }
        }
        );
        //Run Creeps
        this.find(FIND_MY_CREEPS).forEach(creep => {
            if (creep) creep.run();
        }
        );
    }

    public initMemory(): void {
        this.memory.sources = {};
        this.find(FIND_SOURCES).forEach(source => {
            if (source) {
                this.memory.sources[source.id] = [];
            }
        }
        );
        
        this.memory.spawnsId = this.find(FIND_MY_SPAWNS).map(spawn => spawn.id);
        //Init BotStat
        this.memory.roomConfig = {
            BotsStat: {
                harvester: [],
                upgrader: [],
                builder: [],
                claimer: [],
                soldier: [],
            }
        }
        this.countScreeps();
        this.memory.isInit = true;
    }
    //Count the number of screeps of each role in the room
    public countScreeps(): void {
        this.memory.roomConfig.BotsStat.harvester.length = 0;
        this.memory.roomConfig.BotsStat.upgrader.length = 0;
        this.memory.roomConfig.BotsStat.builder.length = 0;
        this.memory.roomConfig.BotsStat.claimer.length = 0;
        this.memory.roomConfig.BotsStat.soldier.length = 0;
        this.find(FIND_MY_CREEPS).forEach(creep => {
            if (creep) {
                this.memory.roomConfig.BotsStat[creep.memory.role]?.push(creep.name);
            }
        }
        );
        //print the number of screeps of each role in the room
        console.log("harvester: " + this.memory.roomConfig.BotsStat.harvester.length);
        console.log("upgrader: " + this.memory.roomConfig.BotsStat.upgrader.length);
        console.log("builder: " + this.memory.roomConfig.BotsStat.builder.length);
        console.log("claimer: " + this.memory.roomConfig.BotsStat.claimer.length);
        console.log("soldier: " + this.memory.roomConfig.BotsStat.soldier.length);

    }
}