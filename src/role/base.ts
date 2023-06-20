const roles: RoleFunctionMap = {
    harvester: (data: CreepData): ICreepStatus => ({
        prepare: creep => {
            if (!data.sourceId) {
                console.log("HarvesterConfig.sourceId is undefined");
                return false;
            }
            let source: Source | null;
            if (creep.memory.data.sourceId) source = Game.getObjectById<Source>(creep.memory.data.sourceId)
            else source = Game.getObjectById<Source>(data.sourceId)
            if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                return false;
            }
            //arrive at source
            return true;

        },
        source: creep => {
            if (!data.sourceId) {
                console.log("HarvesterConfig.sourceId is undefined");
                return false;
            }
            let source: Source | null;
            source = Game.getObjectById<Source>(data.sourceId)
            if (!source) {
                console.log("HarvesterConfig.sourceId is undefined");
                return false;
            }
            if(!creep.memory.isInit){
                creep.room.memory.sources[data.sourceId].push(creep.id);
                creep.memory.isInit = true;
            }
            if(creep.harvest(source) == ERR_NOT_IN_RANGE){
                creep.moveTo(source);
                return false;
            }
            if (creep.store.getFreeCapacity() > 0) return false;
            //Harvest complete and start to go to targetContainer
            return true;
        },
        target: creep => {
            //For now, let assume target is the closest container/spawn
            let target: StructureContainer | StructureStorage | StructureSpawn | null;
            if (creep.memory.data.targetId) {
                target = Game.getObjectById<StructureContainer | StructureStorage | StructureSpawn>(creep.memory.data.targetId);
                //if target is full, get another container
                if (target?.store.getFreeCapacity<RESOURCE_ENERGY>() == 0) {
                    //get another container that is not full
                    target = creep.pos.findClosestByPath<StructureContainer>(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });
                    creep.memory.data.targetId = target?.id;
                }
            }
            else {
                //get closest container
                target = creep.pos.findClosestByPath<StructureContainer>(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                creep.memory.data.targetId = target?.id;
            }


            if (!target) {
                console.log("HarvesterConfig.targetId is undefined");
                //All structures are full, direclty continue to the next stage
                return true;
            }
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                return false;
            }
            //arrive at target
            return true;
        },
    }),
    upgrader: (data: CreepData): ICreepStatus => ({
        prepare: creep => {
            return true;
        },
        source: creep => {
            //get closest container
            let source: StructureContainer | null;
            //if (creep.memory.data.sourceId) source = Game.getObjectById<StructureContainer>(creep.memory.data.sourceId)
            source = creep.pos.findClosestByPath<StructureContainer>(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (!source) {
                console.log("UpgraderConfig.sourceId is undefined");
                return false;
            }
            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            if(creep.store.getFreeCapacity() > 0) return false;
            return true;
        },
        target: creep => {
            //get controller
            let target: StructureController | undefined;
            //if (creep.memory.data.targetId) target = Game.getObjectById<StructureController>(creep.memory.data.targetId)
            target = creep.room.controller;
            if (!target) {
                console.log("UpgraderConfig.targetId is undefined");
                return false;
            }
            if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            if (creep.store.getUsedCapacity() > 0) return false;
            //user up all source and start to get source again
            return true;
        
        },
    }),
    builder: (data: CreepData): ICreepStatus => ({
        prepare: creep => {
            return true;
        },
        source: creep => {
            //get closest container
            let source: StructureContainer | null;
            //if (creep.memory.data.sourceId) source = Game.getObjectById<StructureContainer>(creep.memory.data.sourceId)

            source = creep.pos.findClosestByPath<StructureContainer>(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (!source) {
                console.log("BuilderConfig.sourceId is undefined");
                return false;
            }
            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            return true;
        },
        target: creep => {
            //get cloest construction site
            let target: ConstructionSite | null;
            if (creep.memory.data.targetId) target = Game.getObjectById<ConstructionSite>(creep.memory.data.targetId)

            target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
            if (!target) {
                console.log("BuilderConfig.targetId is undefined");
                return false;
            }
            if (creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }

            return true;
        },
    }),
    claimer: (data: CreepData): ICreepStatus => ({
        prepare: creep => {
            return true;
        },
        source: creep => {
            return true;
        },
        target: creep => {
            return true;
        },
    }),
    soldier: (data: CreepData): ICreepStatus => ({
        prepare: creep => {
            return true;
        },
        source: creep => {
            return true;
        },
        target: creep => {

            return true;
        },
    }),

}

export default roles;