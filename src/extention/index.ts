import { assignPrototype } from "../utils";
import CreepExtension from "./creepExtention";
import RoomExtension from "./roomExtention";
export default function(){
    assignPrototype(Creep, CreepExtension)
    assignPrototype(Room, RoomExtension)
}