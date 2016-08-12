/**
 *
 * @author 
 *
 */
class Stone extends BaseGameObject{
    
    private id: number;
    private stoneData: StoneData;
    private direction: number;
    private img: egret.Bitmap;
    private speedX: number;
    private speedY: number;
    private ax: number;
    private ay: number;
    /** 0: 初始 1: 击中 2: 漂浮*/
    private state: number;
    
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number,side: Side, direction: number): void {
        super.init(side);
        this.id = id;
        this.direction = direction;
        
        this.stoneData = GameManager.GetStoneData(id);
        if(this.direction == 0){
            this.speedY = this.stoneData.speed;
        }else{
            this.speedY = -this.stoneData.speed;
        }
        this.speedX = 0;
        this.setImg(this.stoneData.img);
        this.width = this.stoneData.width;
        this.height = this.stoneData.height;
        
        this.state = 0;
    }
    
    protected setImg(img: string) {
        if(this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.texture = RES.getRes(img);
        this.img.x = this.stoneData.width / 2;
        this.img.y = this.stoneData.height / 2;
        this.img.anchorOffsetX = this.img.width / 2;
        this.img.anchorOffsetY = this.img.height / 2;
    }
    
    public update(time: number) {
        super.update(time);

        var t = time / 1000;
        switch(this.state){
            case 0:
                this.rotation += this.speedY * t / 2; 
                break;
            case 1:
                this.speedX -= this.ax * t;
                this.speedY -= this.ay * t;
                var n = 2;
                if(this.ax > 0 && this.speedX <= this.ax / n || this.ax < 0 && this.speedX >= this.ax / n){
                    this.speedX = this.ax / n;
                    this.speedY = this.ay / n;
                }
                break;
        }
        this.y += this.speedY * t;
        this.x += this.speedX * t;
        
//        var a = t * 100;
//        if(this.sp)
//        if(this.speedY > this.iniSpeedY){
//            this.speedY = Math.max(this.iniSpeedY, this.speedY - a);
//        }else if(this.speedY < this.iniSpeedY){
//            this.speedY = Math.min(this.iniSpeedY, this.speedY + a);
//        }
//        if(this.speedX > 0){
//            this.speedX = Math.max(0, this.speedX - a);
//        }else if(this.speedX < 0){
//            this.speedX = Math.min(0, this.speedX + a);  
//        }        
        
        if(this.gameController.CheckOutScreen(this)) {
            this.remove();
        }
    }
    
    public Hit(speed: number, direction: number){
        this.speedX += speed * Math.cos(direction / 180 * Math.PI);
        this.speedY += speed * Math.sin(direction / 180 * Math.PI);
        this.state = 1;
        var a = this.stoneData.speed;
        var r = Math.atan(this.speedX / this.speedY);
        this.ax = Math.abs(a * Math.sin(r));
        this.ay = Math.abs(a * Math.cos(r));
        
        if(this.speedX < 0){
            this.ax *= -1;
        }
        if(this.speedY < 0){
            this.ay *= -1;
        }
    }
    
    private remove() {
        App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.RemoveStone,this);
    }
}
