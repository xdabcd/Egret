/**
 *
 * @author 
 *
 */
class GameView extends BaseSpriteView {
    private controller: BaseController;
    
    private hero: Hero;
    
    public constructor($controller: BaseController,$parent: egret.DisplayObjectContainer) {
        super($controller,$parent);
        this.controller = $controller;
    }
    
    public initUI(): void {
        super.initUI();

        this.hero = ObjectPool.pop("Hero", this.controller);
        this.hero.init(1);
        var heroPos = this.getPerPos(0.1, 0.3);
        this.hero.x = heroPos.x;
        this.hero.y = heroPos.y;
        this.addChild(this.hero);
    }

    public initData(): void {
        super.initData();
    }
    
    public SetHeroUp(up: Boolean){
        this.hero.IsUp = up;
    }
    
    public get min_x(): number{
        return 0;
    }
    
    public get max_x(): number{
        return App.StageUtils.getWidth();
    }
    
    public get min_y(): number{
        return 0;
    }
    
    public get max_y(): number{
        return App.StageUtils.getHeight() - GameManager.Bottom_H;
    }
    
    private getPerPos(perX: number, perY: number): egret.Point{
        var point = new egret.Point;
        point.x = (this.max_x - this.min_x) * perX + this.min_x;
        point.y = (this.max_y - this.min_y) * perY + this.min_y;
        return point;
    }
}
