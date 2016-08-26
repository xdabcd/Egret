/**
 *
 * 英雄
 *
 */
class Hero extends Unit{
    
    /** 英雄信息 */
    protected _data: HeroData;
    /** 图片 */
    private _img: egret.Bitmap;
    
    /**
     * 初始化
     */ 
	public init(id: number){
	    this._data = GameDataManager.GetHeroData(id); 
        this.setImg(this._data.anim);
	}
    
	/**
	 * 
	 */ 
    private setImg(img: string) {
        if(this._img == null) {
            this._img = new egret.Bitmap;
            this.addChild(this._img);
        }
        this._img.texture = RES.getRes(img);
    }
}
