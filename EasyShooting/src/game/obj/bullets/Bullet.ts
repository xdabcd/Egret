/**
 *
 * 子弹 
 *
 */
class Bullet extends Unit {
    public constructor() {
        super();
        this._className = "Bullet";
    }

    /** 子弹信息 */
    protected _data: BulletData;
    /** 创建者 */
    protected _creater: Unit;

    /** 图片 */
    private _img: egret.Bitmap;
    /** 拖尾效果 */
    private _tail: Tail;

    /**
     * 初始化
     */
    public init(id: number, creater: Unit, rotation: number) {
        this._side = creater.side;
        this._creater = creater;
        this.rotation = rotation;
        this._data = GameDataManager.GetBulletData(id);
        this.width = this.w;
        this.height = this.h;
        this.setImg(this._data.img);
    }

    /**
     * 更新
     */
    public update(t: number) {
        super.update(t);
        this.drawTrail(0xffffff);
    }

    /**
     * 移除
     */
    public remove() {
        GameMessageCenter.handleMessage(GameMessage.RemoveBullet, { bullet: this });
    }

    /**
     * 击中处理
     */
    public hit(unit: Unit) {
        if(unit.className.indexOf("Item") >= 0){
            this.hitItem(unit as Item);            
        }
    }

    /**
     * 击中道具
     */
    private hitItem(item: Item){
        item.getBy(this._creater as Hero);
    }

    /**
	 * 设置图片
	 */
    private setImg(img: string) {
        if (this._img == null) {
            this._img = new egret.Bitmap;
            this.addChild(this._img);
        }
        this._img.texture = RES.getRes(img);
    }

    /**
     * 绘制拖尾
     */
    private drawTrail(color: number) {
        if (!this.parent)
            return;
        if (this._tail == null) {
            this._tail = ObjectPool.pop("Tail");
            this._tail.init(Math.sqrt(this.height) * 3.5, color);
            this.parent.addChild(this._tail);
            this.parent.setChildIndex(this._tail, this.parent.getChildIndex(this) - 1);
        }
        this._tail.addPoint(this.x, this.y);
    }

    /**
     * 清除拖尾
     */
    private clearTail() {
        this._tail.clear();
        this._tail = null;
    }

    /**
     * 摧毁
     */
    public destory() {
        super.destory();
        if (this._tail != null) {
            this.clearTail();
        }
    }

    /**
     * 伤害
     */
    public get damage(): number {
        return this._data.damage;
    }
}
