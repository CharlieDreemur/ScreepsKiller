//Create a creep name based on the role and the current time
export const GetRandomCreepName = function (role: Role): string {
    return role + Game.time;
}
/**
 * 把 obj2 的原型合并到 obj1 的原型上
 * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性
 * @param obj1 要挂载到的对象
 * @param obj2 要进行挂载的对象
 */
export const assignPrototype = function (obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
    Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
        if (key.includes('Getter')) {
            Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true
            })
        }
        else obj1.prototype[key] = obj2.prototype[key]
    })
}

/**
 * 生成 pixel
 * 
 * @param cpuLimit 当 bucket 中的 cpu 到多少时才生成 pixel
 */
export function generatePixel(cpuLimit: number = 7000): void {
    if (Game.cpu.bucket >= cpuLimit) Game.cpu.generatePixel()
}


