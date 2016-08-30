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
}

/**
 * 武器类型
 */ 
enum GunType{
    Normal = 1,
    Running = 2,
    Shot = 3,
    Boomerang = 4,
    Laser = 5,
    Freez = 6,
    Grenade = 7,
    Wave = 8
}
