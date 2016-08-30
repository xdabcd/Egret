/**
 *
 * 英雄
 *
 */
class Hero extends Unit{
    
    /** 英雄信息 */
    protected _data: HeroData;
    /** 武器信息 */
    protected _gunData: GunData;
    /** 射击CD */
    protected _shootCd: number;
    
    /** 图片 */
    private _img: egret.Bitmap;
    
    /**
     * 初始化
     */ 
	public init(id: number){
	    this._data = GameDataManager.GetHeroData(id); 
	    this.width = this._data.width;
	    this.height = this._data.height;
        this.setImg(this._data.anim);
        this.setGun(this._data.gunId);
	}
    
    /**
     * 更新
     */ 	
    public update(t: number){
        if(this._shootCd > 0){
            this._shootCd -= t;
        }
    }
    
    /**
     * 射击
     */ 
    public shoot(){
        if(this._shootCd <= 0){
            var bulletId: number = this._gunData.bulletId;
            var self = this;
            var createFunc = (rotation) => {
                let x = this.x + this._data.shootPos[0] * this.scaleX;
                let y = this.y + this._data.shootPos[1];
                var data = {
                    id: bulletId,
                    creater: self,
                    pos: new egret.Point(x, y),
                    rotation: rotation
                }
                GameMessageCenter.handleMessage(GameMessage.CreateBullet, data);
            }
            switch(this._gunData.type){
                case GunType.Normal:
                    createFunc(0);
                    this.resetShootCd();
                    break;
            }
        }
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
        this._img.anchorOffsetX = 40;
    }

    /**
     * 设置枪
     */
    private setGun(id: number) {
        this._gunData = GameDataManager.GetGunData(id);
        this.resetShootCd();
    }
    
    /**
     * 重置射击CD
     */ 
    private resetShootCd(){
        this._shootCd = this._gunData.interval;
    }
}
