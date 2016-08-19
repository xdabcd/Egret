/**
 *
 * @author 
 *
 */
class SceneEffect extends BaseGameObject {

    private rail: egret.Bitmap;
    private shadows: Array<egret.Bitmap>;
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
        }
        for(var i = 0;i < this.shadows.length;i++) {
            this.shadows[i].x = - i * this.rail.width - this.rail.width / 2;
        }
    }
   

    public update(time: number) {
        super.update(time);
        
        var t = time / 1000;
        var speed = 1800;
        for(var i = 0;i < this.shadows.length;i++) {
            this.shadows[i].x += speed * t;
        }
        
        if(this.shadows[this.shadows.length - 1].x > this.rail.width / 2) {
            this.destory();
            var bx = - this.rail.width / 2;
            var x = this.x + bx * Math.cos(this.rotation / 180 * Math.PI);
            var y = this.y + bx * Math.sin(this.rotation / 180 * Math.PI);
            let moveData = new MoveData(this.rotation);
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.CeateBullet,100,"SceneBullet",this,x,y,moveData);
        }
    }  
   
}
