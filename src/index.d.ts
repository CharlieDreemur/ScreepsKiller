interface Creep {
    run(): void;
}

interface Room {
    run(): void;
    getBestScreepMemory(): CreepMemory | null;
}



interface ICreepStatus {
    // 每次死后都会进行判断，只有返回 true 时才会重新发布孵化任务
    isNeed?: (room: Room, creepName: string, preMemory: CreepMemory) => boolean
    // 准备阶段执行的方法, 返回 true 时代表准备完成
    prepare?: (creep: Creep) => boolean
    // creep 获取工作所需资源时执行的方法
    // 返回 true 则执行 target 阶段，返回其他将继续执行该方法
    source?: (creep: Creep) => boolean
    // creep 工作时执行的方法,
    // 返回 true 则执行 source 阶段，返回其他将继续执行该方法
    target: (creep: Creep) => boolean

}
type Role = 'harvester' | 'upgrader' | 'builder' | 'claimer' | 'soldier'
type BodyPartConfigConstant =
    'harvester' |
    'worker' |
    'soldier'


interface CreepData{
    sourceId?: string;
    targetId?: string;
}

type RoleFunctionMap = {
    [role in Role]: (data: CreepData) => ICreepStatus
};

interface RoomConfig {
    BotsStat: BotsStat;
}

type BotsStat = {
    [role in Role]: string[] //creep name, not creep id
}

interface RoomMemory {
    isInit: boolean; //Whether the room's memory is initialized
    roomConfig: RoomConfig;
    spawnsId: string[];
    sources: SourceData;
}

interface CreepMemory {
    role: Role;
    data: CreepData;
    isInit?: boolean; //Whether the creep's memory is initialized, it will only be invoked once
    isPrepareStage: boolean; //Whether the creep is prepared
    working: boolean; //Whether the creep is working
}

type SourceData = {
    [id: string]: string[] //creep id
}

interface Spawn {
    run(memory: CreepMemory): ScreepsReturnCode;
}