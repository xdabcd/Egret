/**
 *
 * @author 
 *
 */
class LaserBullet extends Bullet{
    /** 0: 准备状态 1: 发射状态 2: 消失状态 */
    private state: number;
    private readyImg: egret.Bitmap;
    private readyTime: number;
    private releaseTime: number;
    private readCd: number;
    
    private createrX: number;
    private createrY: number;
    
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number,creater: Hero,moveData: MoveData): void {
        super.init(id,creater,moveData);
        AnchorUtil.setAnchor(this, 0);
        this.state = 0;
        this.speed = 0;
        var info = this.bulletData.info;
        this.readyTime = info.readyTime;
        this.releaseTime = info.releaseTime;
        this.readCd = this.readyTime;
        this.setReadyImg(info.ready);
        this.setImg(this.bulletData.img);
        this.readyImg.scaleX = this.readyImg.scaleY = 0.5;
        this.createrX = this.creater.x;
        this.createrY = this.creater.y;
        this.alpha = 1;
    }

    private setReadyImg(img){
        if(this.readyImg == null) {
            this.readyImg = new egret.Bitmap;
            this.addChild(this.readyImg);
            AnchorUtil.setAnchor(this.readyImg,0.5);
        }
        this.readyImg.texture = RES.getRes(img);
        this.readyImg.x = this.readyImg.width / 2;
    }
    
    protected setImg(img){
        if(this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
            AnchorUtil.setAnchorY(this.img,0.5);
        }
        this.img.texture = RES.getRes(img);
        this.img.scale9Grid = new egret.Rectangle(100, 0, 200, this.img.height);
        this.img.width = 0;
    }
    
    public update(time: number) {
        super.update(time);
        this.x += this.creater.x - this.createrX;
        this.y += this.creater.y - this.createrY;
        this.createrX = this.creater.x; 
        this.createrY = this.creater.y;
        
        var t = time / 1000;
        switch(this.state) {
            case 0:
                this.readCd -= t;
                if(this.readCd > 0){
                    if(this.readyImg.scaleX == 1) {
                        this.readyImg.scaleX = this.readyImg.scaleY = 0.5;
                    } else {
                        this.readyImg.scaleX = this.readyImg.scaleY = 1;
                    }
                }else{
                    this.state = 1;
                    this.img.scaleY = this.readyImg.scaleX = this.readyImg.scaleY = 0.5;
                    this.img.x = this.readyImg.x + this.readyImg.width * this.readyImg.scaleX * 0.23 - 5;
                    this.creater.ResetGun();
                }
                break;
            case 1:
                this.img.scaleY = this.readyImg.scaleX = this.readyImg.scaleY += (0.5 / this.releaseTime) * t;
                this.img.x = this.readyImg.x + this.readyImg.width * this.readyImg.scaleX * 0.23 - 5;
                this.img.width += (this.bulletData.width / this.releaseTime) * t;
                if(this.img.scaleY >= 1){
                    this.state = 2;
                }
                break;
            case 2:
                this.img.scaleY = this.readyImg.scaleX = this.readyImg.scaleY -= 2 * t;
                this.img.x = this.readyImg.x + this.readyImg.width * this.readyImg.scaleX * 0.23 - 5;
                if(this.img.scaleY <= 0.1){
                    this.remove();
                }
                break;
        }
        
        var hitHeroes: Array<Hero> = this.gameController.CheckHitHero(this);
        var hitItem: Boolean = this.gameController.CheckHitItem(this);
        var outScreen: Boolean = this.gameController.CheckOutScreen(this);

        if(hitHeroes.length > 0) {
            for(var i = 0;i < hitHeroes.length;i++) {
                this.ignoreHeroes.push(hitHeroes[i]);
            }
        }
    }
    
    private sha: egret.Shape;
    public get rect(): egret.Rectangle {
        var width = this.img.width;
        var height = this.img.height * this.img.scaleY;
        var rect: egret.Rectangle;
        if(this.scaleX == 1){
            rect = new egret.Rectangle(this.x + this.img.x, this.y - height / 2, width, height);
        }else{
            rect = new egret.Rectangle(this.x - this.img.x - width, this.y - height / 2, width, height);
        }
        
//        if(this.sha == null){
//            this.sha = new egret.Shape;
//            this.creater.parent.addChild(this.sha);
//        }
//        this.sha.graphics.clear();
//        this.sha.graphics.beginFill(0xff0000);
//        this.sha.graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
//        this.sha.graphics.endFill();
        return rect;
    }
}
