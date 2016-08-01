/**
 *
 * @author 
 *
 */
class Bullet extends BaseGameObject{
    
    private id: number;
    private img: egret.Bitmap;
    private speed: number;
    private moveData: MoveData;
    private damage: number;
    private creater: Hero;
    
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number,creater: Hero, moveData: MoveData): void {
        super.init(creater.side);
        this.id = id;
        this.creater = creater;
        if(this.side == Side.Own) {
            this.scaleX = 1;
        } else if(this.side == Side.Enemy) {
            this.scaleX = -1;
        }
        this.moveData = moveData;
        this.rotation = moveData.direction;
        var bulletData = GameManager.GetBulletData(id);
        this.setImg(bulletData.img);
        this.speed = bulletData.speed;
        this.width = bulletData.width;
        this.height = bulletData.height;
        this.damage = bulletData.damage;
    }
    
    private setImg(img: string){
        if(this.img == null){
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.texture = RES.getRes(img);
    }
    
    public update(time: number) {
        super.update(time);
        var t = time / 1000;
        this.x += this.speed * t * Math.cos(this.rotation / 180 * Math.PI) * this.scaleX;
        this.y += this.speed * t * Math.sin(this.rotation / 180 * Math.PI) * this.scaleX;
//        var bm = new egret.Bitmap(this.img.texture);
//        bm.scaleX = bm.scaleY = this.img.scaleX;
//        bm.scaleX *= this.scaleX;
//        bm.anchorOffsetX = bm.width / 2;
//        bm.anchorOffsetY = bm.height / 2;
//        bm.x = this.x + bm.anchorOffsetX * this.scaleX;
//        bm.y = this.y + bm.anchorOffsetY;
//        this.parent.addChild(bm);
//        egret.Tween.get(bm).to({scaleX: this.scaleX * 0.01, scaleY: 0.01, alpha: 0.01}, 200).call(()=>bm.parent.removeChild(bm), this);
        
        if(this.gameController.CheckHit(this) || this.gameController.CheckOutScreen(this)){
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.RemoveBullet,this);
        }
    }
    
    
    
    public GetDamage(): number{
        return this.damage;
    }
    
    public GetCreater(): Hero{
        return this.creater;
    }
}
