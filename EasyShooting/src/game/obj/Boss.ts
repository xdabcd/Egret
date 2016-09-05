/**
 *
 * Boss
 *
 */
class Boss extends Unit {
    public constructor() {
        super();
        this._className = "Hero";
    }

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
    public init(id: number, side: Side) {
        this._side = side;
        this._data = GameDataManager.GetHeroData(id);
        this.width = this.w;
        this.height = this.h;
        this.setImg(this._data.anim);
        this.resetGun();
    }

    /**
     * 更新
     */
    public update(t: number) {
        super.update(t);
        if (this._shootCd > 0) {
            this._shootCd -= t;
        }
    }

    /**
     * 移除
     */
    public remove() {
    }

    /**
     * 射击
     */
    public shoot() {
        if (this._shootCd <= 0) {
            var bulletId: number = this._gunData.bulletId;
            var self = this;
            var createFunc = (type, rotation) => {
                let x = this.x + this._data.shootPos[0] * this.scaleX;
                let y = this.y + this._data.shootPos[1];
                var data = {
                    id: bulletId,
                    creater: self,
                    pos: new egret.Point(x, y),
                    type: type,
                    rotation: rotation
                }
                GameMessageCenter.handleMessage(GameMessage.CreateBullet, data);
            }
            switch (this._gunData.type) {
                case GunType.Normal:
                    createFunc("NormalBullet", 0);
                    this.resetShootCd();
                    break;
                case GunType.Running:
                    var info: any = this._gunData.info;
                    var count: number = info.count;
                    var interval: number = info.interval * 1000;
                    TimerManager.doTimer(interval, count, () => createFunc("NormalBullet", 0), this);
                    this.resetGun();
                    break;
                case GunType.Shot:
                    var info: any = this._gunData.info;
                    var count: number = info.count;
                    var angle: number = info.angle;
                    var ini_angle = -(count - 1) / 2 * angle;
                    for (let i = 0; i < count; i++) {
                        createFunc("NormalBullet", ini_angle + i * angle);
                    }
                    this.resetGun();
                    break;
                default:
                    break;
            }
        }
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
        this._img.anchorOffsetX = 20;
    }

    /**
     * 设置枪
     */
    private setGun(id: number) {
        this._gunData = GameDataManager.GetGunData(id);
        this.resetShootCd();
    }

    /**
     * 重置枪
     */
    private resetGun() {
        this.setGun(this._data.gunId);
    }

    /**
     * 重置射击CD
     */
    private resetShootCd() {
        this._shootCd = this._gunData.interval;
    }
}
