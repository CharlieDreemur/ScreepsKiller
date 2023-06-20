import { assignPrototype } from "../utils";
import SpawnExtention from "./spawnExtention";
export default function(){
    assignPrototype(Spawn, SpawnExtention)
}