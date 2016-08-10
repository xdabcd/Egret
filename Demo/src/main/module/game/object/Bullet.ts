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
    protected creater: Hero;
    protected ignoreHeroes: Array<Hero>;
    protected ignoreStones: Array<Stone>;
    
    private sh: egret.Shape;
    private mg: egret.Graphics;
    private mPoints: any[] = [];
    
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
        this.rotation = moveData.direction * this.scaleX;
        this.bulletData = GameManager.GetBulletData(id);
        this.speed = this.bulletData.speed;
        this.ignoreHeroes = [];
        this.ignoreStones = [];
        
        if(this.sh == null){
            this.sh  = new egret.Shape();
            this.creater.parent.addChild(this.sh);
            this.mg = this.sh.graphics;
        }
    }
    
    protected setImg(img: string){
        if(this.img == null){
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.rotation = 0;
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
        
        var hitHeroes: Array<Hero> = this.gameController.CheckHitHero(this);
        var hitItems: Array<Item> = this.gameController.CheckHitItem(this);
        var outScreen: Boolean = this.gameController.CheckOutScreen(this);
        var hitStones: Array<Stone> = this.gameController.CheckHitStone(this);
        if(hitHeroes.length > 0){
            this.hitHero(hitHeroes);
        }
        if(hitItems.length > 0){
            this.hitItems(hitItems);
        }
        if(outScreen){
            this.outScreen();
        }
        if(this.hitStones.length > 0){
            this.hitStones(hitStones);
        }
    }  
    
    protected hitHero(heroes: Array<Hero>){
        for(var i = 0; i < heroes.length; i++){
            var hero = heroes[i];
            if(!this.checkIgnoreHero(hero)){
                hero.Hurt(this.damage);
                this.doEffect(hero);
            }
        }
    }
    
    protected hitItems(items: Array<Item>) {
        for(var i = 0;i < items.length;i++) {
            var item = items[i];
            item.ToHero(this.creater);
        }
    }
    
    protected hitStones(stones: Array<Stone>) {
        for(var i = 0;i < stones.length;i++) {
            var stone = stones[i];
            if(!this.checkIgnoreStone(stone)){
                if(this.priority == 1) {
                    this.remove();
                }
                var direction = App.MathUtils.getAngle(App.MathUtils.getRadian2(this.x,this.y,stone.x,stone.y));
                stone.Hit(Math.sqrt(this.damage) * 50,direction);
                this.ignoreStones.push(stone);
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
        var mPenSize = Math.sqrt(this.height) * 3.5;
        var obj = { sx: this.x,sy: this.y,size: mPenSize };
        this.mPoints.push(obj);
        if(this.mPoints.length == 0) return;
        this.mg.clear();
        var _count: number = this.mPoints.length;

        for(var i: number = 0;i < _count;i++) {
            var pt = this.mPoints[i];
            pt.size -= 2;
            if(pt.size < 0) {
                this.mPoints.splice(i,1);
                i--;
                _count = this.mPoints.length;
            }
        }
        _count = this.mPoints.length;

        var alpha = 0.1;
        for(i = 1;i < _count;i++) {
            var p = this.mPoints[i];
            var count = 5;
            var sx = this.mPoints[i - 1].sx;
            var sy = this.mPoints[i - 1].sy;
            var sx1 = p.sx;
            var sy1 = p.sy;
            var size = this.mPoints[i - 1].size;
            var size1 = p.size;
            for(var j = 0;j < count;j++) {
                this.mg.lineStyle(size + (size1 - size) / count * j,color,alpha);
                this.mg.moveTo(sx + (sx1 - sx) / count * j,sy + (sy1 - sy) / count * j);
                this.mg.lineTo(sx + (sx1 - sx) / count * (j + 1),sy + (sy1 - sy) / count * (j + 1));
                alpha += 0.002;
            }
        }
    }
    
    private clearMg(){
        this.mg.clear();
        this.mPoints = [];
    }
    
    public destory(): void {
        super.destory();
        this.clearMg();
    }

    private checkIgnoreHero(hero: Hero): Boolean{
        return this.ignoreHeroes.indexOf(hero) >= 0;
    }
    
    private checkIgnoreStone(stone: Stone): Boolean {
        return this.ignoreStones.indexOf(stone) >= 0;
    }
    
    protected get priority(): number{
        return this.bulletData.priority;
    }
    
    protected get damage(): number{
        return this.bulletData.damage;
    }
    
    protected doEffect(hero: Hero){
    }
}
