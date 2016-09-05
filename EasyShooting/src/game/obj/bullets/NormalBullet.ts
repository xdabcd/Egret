/**
 *
 * 普通子弹 
 *
 */
class NormalBullet extends Bullet {
    public constructor() {
        super();
        this._className = "NormalBullet";
    }

    /**
     * 初始化
     */
    public init(id: number, creater: Unit, rotation: number) {
        super.init(id, creater, rotation);
    }

    /**
     * 更新
     */
    public update(t: number) {
        super.update(t);
        var s: number = GameScene.convertPhy(this._data.speed);
        var r: number = this.rotation / 180 * Math.PI;
        this._body.velocity = [s * Math.cos(r), s * Math.sin(r)];
    }

    /**
     * 击中处理
     */
    public hit(unit: Unit) {
        super.hit(unit);
        this.remove();
    }
}
