/**
 *
 * 敌人
 *
 */
class Enemy extends Hero {
    public constructor() {
        super();
        this._className = "Enemy";
    }

	/**
     * 初始化
     */
    public init(id: number, side: Side) {
        super.init(id, side);
        this.scaleX = -1;
    }
}
