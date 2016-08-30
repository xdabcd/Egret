/**
 *
 * 子弹 
 *
 */
class Bullet extends Unit {

    /** 子弹信息 */
    protected _data: BulletData;

    /** 图片 */
    private _img: egret.Bitmap;

    /**
     * 初始化
     */
    public init(id: number) {
        this._data = GameDataManager.GetBulletData(id);
        this.width = this._data.width;
        this.height = this._data.height;
        this.setImg(this._data.img);
    }

    /**
     * 更新
     */
    public update(t: number) {
        
    }
    
    /**
	 * 设置图片
	 */
    private setImg(img: string) {
        if(this._img == null) {
            this._img = new egret.Bitmap;
            this.addChild(this._img);
        }
        this._img.texture = RES.getRes(img);
    }
}
