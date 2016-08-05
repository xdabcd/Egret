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
    private items: Array<Item> = [];
    private itemInterval = 5;
    private itemCd = 0;
    
    public constructor($controller: BaseController,$parent: egret.DisplayObjectContainer) {
        super($controller,$parent);
        this.controller = $controller;
    }
    
    public initUI(): void {
        super.initUI();
        
        var bg = App.DisplayUtils.createBitmap("bg_png");
        this.addChild(bg);
        
        this.width = App.StageUtils.getWidth();
        this.height = App.StageUtils.getHeight();
        
        this.createHero();
        this.createEnemy(AiType.Follow);
        
        App.TimerManager.doFrame(1,0,this.update,this);
    }

    public initData(): void {
        super.initData();
    }
    
    private update(time: number): void {
        var t = time / 1000;
        this.itemCd -= t;
        
        if(this.itemCd <= 0){
            this.createItem(App.RandomUtils.limitInteger(2,8));
            this.itemCd = this.itemInterval;
        }
    }
    
    private createHero(){
        this.hero = ObjectPool.pop("Hero",this.controller);
        this.hero.init(1,Side.Own);
        var heroPos = this.getPerPos(0.18,0.3);
        this.hero.x = heroPos.x;
        this.hero.y = heroPos.y;
        this.addChild(this.hero);
    }
    
    private createEnemy(ai: AiType){
        var enemy: Hero = ObjectPool.pop("Hero",this.controller);
        enemy.init(1,Side.Enemy);
        enemy.SetAI(ai);
        var pos = this.getPerPos(0.82, 0.3);
        enemy.x = pos.x;
        enemy.y = pos.y;
        this.addChild(enemy);
        this.enemies.push(enemy);
    }
    
    public CreateBullet(id:number, type: string, creater: Hero, x:number, y:number, moveData: MoveData){
        var bullet: Bullet = ObjectPool.pop(type,this.controller);
        bullet.init(id,creater, moveData);
        bullet.x = x;
        bullet.y = y;
        if(creater.side == Side.Own){
            this.ownBullets.push(bullet);
        } else if(creater.side == Side.Enemy){
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
    
    private createItem(id: number){
        var item: Item = ObjectPool.pop("Item",this.controller);
        var direction = App.RandomUtils.limitInteger(0,1);
        item.init(id,Side.Middle, direction);
        var pos = this.getPerPos(App.RandomUtils.limit(0.4, 0.6), direction);
        item.x = pos.x;
        item.y = pos.y;
        this.addChild(item);
        this.items.push(item);
    }
    
    public RemoveItem(item: Item) {
        let index = this.items.indexOf(item);
        this.items.splice(index,1);
        item.destory();
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
    
    public GetItems(): Array<Item> {
        return this.items;
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
