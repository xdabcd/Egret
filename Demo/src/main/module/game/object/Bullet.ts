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
    
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number,side: Side, moveData: MoveData): void {
        super.init(side);
        this.id = id;
        this.moveData = moveData;
        var bulletData = GameManager.GetBulletData(id);
        this.setImg(bulletData.img);
        this.speed = bulletData.speed;
        this.width = bulletData.width;
        this.height = bulletData.height;
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
        
        this.x += this.speed * t;
        if(this.gameController.CheckOutScreen(this)){
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.RemoveBullet,this);
        }
    }
}
