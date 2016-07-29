/**
 *
 * @author 
 *
 */
class GameView extends BaseSpriteView {
    private controller: BaseController;
    
    private hero: Hero;
    private ownBullets: Array<Bullet> = [];
    private enemies: Array<Hero> = [];
    private enemyBullets: Array<Bullet> = [];
    
    public constructor($controller: BaseController,$parent: egret.DisplayObjectContainer) {
        super($controller,$parent);
        this.controller = $controller;
    }
    
    public initUI(): void {
        super.initUI();

        this.width = App.StageUtils.getWidth();
        this.height = App.StageUtils.getHeight();
        
        this.createHero();
        this.createEnemy(AiType.Follow);
    }

    public initData(): void {
        super.initData();
    }
    
    private createHero(){
        this.hero = ObjectPool.pop("Hero",this.controller);
        this.hero.init(1,Side.Own);
        var heroPos = this.getPerPos(0.1,0.3);
        this.hero.x = heroPos.x;
        this.hero.y = heroPos.y;
        this.addChild(this.hero);
    }
    
    private createEnemy(ai: AiType){
        var enemy: Hero = ObjectPool.pop("Hero",this.controller);
        enemy.init(1,Side.Enemy);
        enemy.SetAI(ai);
        var pos = this.getPerPos(0.9, 0.3);
        enemy.x = pos.x;
        enemy.y = pos.y;
        this.addChild(enemy);
        this.enemies.push(enemy);
    }
    
    public CreateBullet(id:number, side:Side, x:number, y:number, moveData: MoveData){
        var bullet: Bullet = ObjectPool.pop("Bullet",this.controller);
        bullet.init(id, side, moveData);
        bullet.x = x;
        bullet.y = y;
        if(side == Side.Own){
            this.ownBullets.push(bullet);
        }else if(side == Side.Enemy){
            this.enemyBullets.push(bullet);
        }
        this.addChild(bullet);
    }
    
    public RemoveBullet(bullet: Bullet) {
        if(bullet.side == Side.Own){
            let index = this.ownBullets.indexOf(bullet);
            this.ownBullets.splice(index, 1);
        }else if(bullet.side = Side.Enemy){
            let index = this.enemyBullets.indexOf(bullet);
            this.enemyBullets.splice(index,1);
        }
        
        bullet.destory();
    }
    
    public Jump(up: Boolean){
        this.hero.IsUp = up;
    }
    
    public Shoot(){
        this.hero.Shoot();
    }
    
    public GetHero(): Hero{
        return this.hero;
    }
    
    public GetEnemies(): Array<Hero>{
        return this.enemies;
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
        return App.StageUtils.getHeight() - GameManager.UI_H;
    }
    
    private getPerPos(perX: number, perY: number): egret.Point{
        var point = new egret.Point;
        point.x = (this.max_x - this.min_x) * perX + this.min_x;
        point.y = (this.max_y - this.min_y) * perY + this.min_y;
        return point;
    }
}
