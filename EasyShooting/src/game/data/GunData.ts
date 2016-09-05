/**
 *
 * 武器信息
 *
 */
class GunData {
    /** 编号 */
    public id: number;
    /** 射击间隔 */
    public interval: number;
    /** 类型 */
    public type: GunType;
    /** 子弹编号 */
    public bulletId: number;
    /** 信息 */
    public info: any;
}

/**
 * 武器类型
 */
enum GunType {
    /** 普通 */
    Normal = 1,
    /** 连射 */
    Running = 2,
    /** 散射 */
    Shot = 3,
    /** 飞去来 */
    Boomerang = 4,
    /** 激光 */
    Laser = 5,
    /** 冰冻 */
    Freez = 6,
    /** 手雷 */
    Grenade = 7,
    /** 声波 */
    Wave = 8
}
