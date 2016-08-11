/**
 *
 * @author 
 *
 */
class SceneEffect extends BaseGameObject {

    private rail: egret.Bitmap;
    private shadows: Array<egret.Bitmap>;
    private bullet: egret.Bitmap;
    private ignoreHeroes: Array<Hero>;
    
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(side: Side,direction: number): void {
        super.init(side);
        this.rotation = direction;
    
        AnchorUtil.setAnchor(this, 0);
        
        this.ignoreHeroes = [];
        this.initRail();
        this.initBullets();
    }

    private initRail(){
        if(this.rail == null){
            this.rail = App.DisplayUtils.createBitmap("se_rail_png");
            AnchorUtil.setAnchor(this.rail,0.5);
            this.addChild(this.rail);
        }
        this.rail.visible = true;
    }
    
    private initBullets(){
        if(this.shadows == null){
            this.shadows = [];
            for(var i = 0; i < 5; i++){
                var shadow = App.DisplayUtils.createBitmap("se_shadow_png");
                AnchorUtil.setAnchor(shadow, 0.5);
                this.addChild(shadow);
                this.shadows.push(shadow);
            }
            this.bullet = App.DisplayUtils.createBitmap("se_bullet_png");
            AnchorUtil.setAnchor(this.bullet,0.5);
            this.addChild(this.bullet);
        }
        for(var i = 0;i < this.shadows.length;i++) {
            this.shadows[i].x = - i * this.rail.width - this.rail.width / 2;
        }
        this.bullet.x = - (this.shadows.length) * this.rail.width - this.rail.width / 2;
    }
   

    public update(time: number) {
        super.update(time);
        
        var t = time / 1000;
        var speed = 1800;
        for(var i = 0;i < this.shadows.length;i++) {
            this.shadows[i].x += speed * t;
        }
        this.bullet.x += speed * t;
        
        if(this.shadows[this.shadows.length - 1].x > this.rail.width / 2) {
            this.rail.visible = false;
        }
        var hitHeroes = this.gameController.CheckHitHeroByRect(this.rect);
        if(hitHeroes.length > 0){
            for(var i = 0; i < hitHeroes.length; i++){
                var hero = hitHeroes[i];
                if(this.ignoreHeroes.indexOf(hero) < 0){
                    this.ignoreHeroes.push(hero);
                    hero.Hurt(10);
                }
            }        
        }
        
        if(this.bullet.x > this.rail.width / 2) {
            this.destory();
        }
    }
    
    public get rect(): egret.Rectangle {
        var x = this.x + this.bullet.x;
        var y = this.y + this.bullet.y;
        var width = this.bullet.width;
        var height = this.bullet.height;
        return new egret.Rectangle(x - width / 2, y - height / 2, width, height);
    }
}
