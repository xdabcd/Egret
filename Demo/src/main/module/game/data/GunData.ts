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
	public times : number;
	public type : GunType;
	public info: any;
}

enum GunType{
    Narmal = 1,
    Running = 2,
    Shot = 3
}
