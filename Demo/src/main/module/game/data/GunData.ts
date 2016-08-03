/**
 *
 * @author 
 *
 */
class GunData {
	public id: number;
	public bullet: number;
	public bulletX: number;
	public bulletY: number;
	public img: string;
	public interval: number;
	public type : GunType;
	public info: any;
}

enum GunType{
    Normal = 1,
    Running = 2,
    Shot = 3,
    Boomerang = 4,
    Laser = 5
}
