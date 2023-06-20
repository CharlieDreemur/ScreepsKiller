
//Calculate the number of harvester needed according to the number of source
export function CalculateNeedHarvester(room: Room, bodys:BodyPartConstant[]): number {
    const sources_num = Object.keys(room.memory.sources).length;
    //get the work parts of the body
    const work_parts = bodys.filter(body => body == WORK).length;
    //4 work parts = 1 source
    //floor is needed to avoid float
    let harevster_one_source = Math.floor(1/work_parts *4);
    //The number of harvester for each source should not be more than 3
    if(harevster_one_source>3) harevster_one_source = 3;
    return harevster_one_source * sources_num;
}