/**
 *
 * @author 
 *
 */
class Bullet extends BaseGameObject{
    
    protected id: number;
    protected bulletData: BulletData;
    protected speed: number;
    protected img: egret.Bitmap;
    protected moveData: MoveData;
    protected creater: BaseGameObject;
    protected ignoreUnits: Array<Unit>;
    protected ignoreStones: Array<Stone>;
    
    private tail: Tail;
    
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
        } else if(this.side == Side.Middle) {
            this.scaleX = 1;
        }
        this.moveData = moveData;
        this.rotation = moveData.direction * this.scaleX;
        this.bulletData = GameManager.GetBulletData(id);
        this.speed = this.bulletData.speed;
        this.ignoreUnits = [];
        this.ignoreStones = [];
    }
    
    protected setImg(img: string){
        if(this.img == null){
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.texture = RES.getRes(img);
        this.img.x = this.bulletData.width / 2;
        this.img.y = this.bulletData.height / 2;
        this.img.anchorOffsetX = this.img.width / 2;
        this.img.anchorOffsetY = this.img.height / 2;
    }
    
    public update(time: number) {
        super.update(time);
        
        if(this.bulletData.trail != null){
            this.drawTrail(this.bulletData.trail);
        }
                
        var t = time / 1000;
        this.x += this.speed * t * Math.cos(this.rotation / 180 * Math.PI) * this.scaleX;
        this.y += this.speed * t * Math.sin(this.rotation / 180 * Math.PI) * this.scaleX;     
        
        if(this.priority == 1){
            var hitBullets = this.gameController.CheckHitBullet(this);

            if(hitBullets.length > 0){
                this.remove();
                for(var i = 0;i < hitBullets.length;i++) {
                    var b = hitBullets[i];
                    if(b.priority == 1){
                        b.remove();
                    }
                }
            }
        }
        
        var hitUnits: Array<Unit> = this.gameController.CheckHitUnit(this);
        var outScreen: Boolean = this.gameController.CheckOutScreen(this);
        if(hitUnits.length > 0){
            this.hitUnit(hitUnits);
        }
        
        if(outScreen){
            this.outScreen();
        }
        
    }  
    
    protected hitUnit(units: Array<Unit>){
        for(var i = 0; i < units.length; i++){
            var unit: Unit = units[i];
            if(!this.checkIgnoreUnit(unit)){
                unit.Hurt(this.damage);
                this.doEffect(unit);
            }
        }
    }
    
    protected outScreen(){
        this.remove();
    }
    
    protected remove(){
        App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.RemoveBullet,this);
    }
    
    protected drawTrail(color: number){
        if(this.tail == null){
            this.tail = ObjectPool.pop("Tail");
            this.tail.init(Math.sqrt(this.height) * 3.5, color);
            this.creater.parent.addChild(this.tail);
            this.parent.swapChildren(this.tail, this);
        }
        this.tail.addPoint(this.x, this.y);
    }
    
    private clearTail(){
        this.tail.clear();
        this.tail = null;
    }
    
    public destory(): void {
        super.destory();
        if(this.tail != null){
            this.clearTail();
        }
    }

    private checkIgnoreUnit(unit: Unit): Boolean{
        return this.ignoreUnits.indexOf(unit) >= 0;
    }
    
    protected get priority(): number{
        return this.bulletData.priority;
    }
    
    protected get damage(): number{
        return this.bulletData.damage;
    }
    
    protected doEffect(unit: Unit){
    }
    
    public GetDangerArea(targetX: number, time: number): Array<number>{ 
        var arr = [];
        var s = (targetX - this.x) / Math.cos(this.rotation) - this.width / 2;
        var t = s / this.speed;
        if(t >= 0 && t < time){
            var targetY = this.y + (targetX - this.x) * Math.tan(this.rotation * Math.PI / 180);
            var min = targetY - this.height / 2 / Math.abs(Math.cos(this.rotation));
            var max = targetY + this.height / 2 / Math.abs(Math.cos(this.rotation));
            arr = [min, max];
        }
        return arr;
    }
}
