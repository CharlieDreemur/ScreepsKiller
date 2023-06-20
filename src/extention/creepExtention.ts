import roles from "../role/base";

export default class CreepExtension extends Creep {
    public run(): void {
        if (this.spawning) {
            console.log("spawning");
            return;
        }
        if (this.ticksToLive && this.ticksToLive <= 2) {
            this.deleteSelfFromRoomMemory();
        }
        if(typeof roles[this.memory.role] != 'function'){
            console.log("roles["+this.memory.role+"] is not a function");
            return;
        }
        const creepConfig: ICreepStatus = roles[this.memory.role](this.memory.data);
        if (!creepConfig) {
            console.log("creepConfig" + this.memory.role + " " + this.id + "is undefined");
            return;
        }
        if (!this.memory.isPrepareStage) {
            if (creepConfig.prepare) this.memory.isPrepareStage = creepConfig.prepare(this)
            // return true directly if no prepare function
            else this.memory.isPrepareStage = true;
        }
        //if not prepare after execute prepare, return, wait for next tick
        if(!this.memory.isPrepareStage) return;
        const working = creepConfig.source ? this.memory.working : true;
        let stateChange = false;
        if (working) {
            if(creepConfig.target&&creepConfig.target(this)) stateChange = true;
        }
        else{
            if(creepConfig.source&&creepConfig.source(this)) stateChange = true;
        }

        if(stateChange){
            this.memory.working = !this.memory.working

        }
    }

    public deleteSelfFromRoomMemory():void  {
        if (this.memory.role) {
            const index = this.room.memory.roomConfig.BotsStat[this.memory.role].indexOf(this.name);
            if (index != -1) {
                this.room.memory.roomConfig.BotsStat[this.memory.role].splice(index, 1);
            }
            if(this.memory.role == 'harvester'){
                let source:Source|null 
                if(this.memory.data.sourceId) source= Game.getObjectById(this.memory.data.sourceId);
                else return;
                if(source){
                    //get this harvest id index in the source[source.id]
                    const index = this.room.memory.sources[source.id].indexOf(this.name);
                    if(index!=-1){
                        this.room.memory.sources[source.id].splice(index,1);
                    }
            

                }
            }
        }
    }
}
