/**
 *
 * @author 
 *
 */
class BulletData {
	public id: number;
	public img: string;
	public speed: number;
	public width: number;
	public height: number;
	public damage: number;
	public type: BulletType;
	public pri: number;
    public trail: number;
	public info: any;
}

enum BulletType{
    Normal = 1,
    Spin = 2,
    Boomerang = 3,
    Laser = 4
}