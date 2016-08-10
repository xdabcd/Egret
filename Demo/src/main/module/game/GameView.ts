/**
 *
 * @author 
 *
 */
class GameView extends BaseSpriteView {
    private controller: BaseController;
    
    private bgContainer: egret.DisplayObjectContainer;
    private hero: Hero;
    private ownBullets: Array<Bullet> = [];
    private enemies: Array<Hero> = [];
    private enemyBullets: Array<Bullet> = [];
    private items: Array<Item> = [];
    private stones: Array<Stone> = [];
    private itemInterval = 5;
    private itemCd = 0;
    private stoneInterval = 6;
    private stoneCd = 0;
    /** 0: init 1: ready 2: fight 3: trans 4: move 5: end*/
    private state: number;
    private bgSpeed: number;
    private bgDis: number;
    private round: number;
    private wave: number;
    private transTime: number;
    
    private roundText: egret.TextField;
    private over: egret.TextField;
    
    public constructor($controller: BaseController,$parent: egret.DisplayObjectContainer) {
        super($controller,$parent);
        this.controller = $controller;
    }
    
    public initUI(): void {
        super.initUI();
        
        this.bgContainer = new egret.DisplayObjectContainer;
        this.addChild(this.bgContainer);
        var bg = App.DisplayUtils.createBitmap("bg_png");
        this.bgContainer.addChild(bg);
        var bg1 = App.DisplayUtils.createBitmap("bg_png");
        bg1.x = bg.width;
        this.bgContainer.addChild(bg1);
        
        this.width = App.StageUtils.getWidth();
        this.height = App.StageUtils.getHeight();  
        
        this.roundText = new egret.TextField;
        this.roundText.width = 400;
        this.roundText.anchorOffsetX = 200;
        this.roundText.anchorOffsetY = 40;
        this.roundText.x = this.width / 2;
        this.roundText.y = this.height / 2 - 100;
        this.roundText.textAlign = "center";
        this.roundText.size = 80;
        this.roundText.bold = true;
        this.addChild(this.roundText);  
        this.roundText.visible = false;
        
        this.setState(0);
        this.round = 1;
        this.wave = 1;
        
        App.TimerManager.doFrame(1,0,this.update,this);
    }

    public initData(): void {
        super.initData();
    }
    
    private update(time: number): void {
        var t = time / 1000;
        
        switch(this.state){
            case 0:
                this.roundText.text = "ROUND " + this.round;
                this.roundText.scaleX = this.roundText.scaleY = 0.1;
                this.roundText.visible = true;
                this.roundText.alpha = 1;
                egret.Tween.get(this.roundText).to({scaleX: 1, scaleY: 1}, 400, egret.Ease.elasticOut)
                    .wait(500)
                    .to({alpha : 0.1}, 300).call(()=>{this.roundText.visible = false});
                this.createHero();
                this.setState(1);
                break;
            case 1:
                this.createEnemy(AiType.Follow);
                this.setState(2);
                break;
            case 2:
                this.itemCd -= t;

                if(this.itemCd <= 0) {
                    this.createItem(App.RandomUtils.limitInteger(2,8));
                    this.itemCd = this.itemInterval;
                }
                
                this.stoneCd -= t;
                if(this.stoneCd <= 0){
                    this.createStone(App.RandomUtils.limitInteger(1, 2));
                    this.stoneCd = this.stoneInterval;
                }
                break;
            case 3:
                this.transTime -= t;
                if(this.transTime <= 0){
                    this.next();
                }
                break;
            case 4:
                if(this.hero != null && this.hero.GetState() == HeroState.Idle){
                    this.hero.destory();
                    this.hero = null;
                }
                if(this.bgDis > this.bgContainer.width / 3){
                    this.clearItems();
                    this.clearStones();
                }
                if(this.bgDis > this.bgContainer.width * 4) {
                    if(this.bgSpeed <= 0.6){
                        this.bgSpeed = 0.6;
                        if(this.bgContainer.x >= -30){
                            this.setState(0);
                        }
                    }else{
                        this.bgSpeed -= t;
                    }
                }else if(this.bgSpeed < 6){
                    this.bgSpeed += t;
                }
                this.bgContainer.x = (this.bgContainer.x - this.bgSpeed * time) % (this.bgContainer.width / 2);
                this.bgDis += this.bgSpeed * time;
                break;
            case 5:
                break;
        }
    }
    
    private gameOver(){
        if(this.over == null){
            this.over = new egret.TextField;
            this.over.width = 600;
            this.over.anchorOffsetX = 300;
            this.over.anchorOffsetY = 40;
            this.over.x = this.width / 2;
            this.over.y = this.height / 2 - 100;
            this.over.textAlign = "center";
            this.over.size = 80;
            this.over.bold = true;
            this.over.text = "GAME OVER!";
            this.addChild(this.over);        
        } 
        this.setState(5);
        this.over.scaleX = this.roundText.scaleY = 0.1;
        this.over.visible = true;
        this.over.alpha = 1;
        egret.Tween.get(this.over).to({ scaleX: 1,scaleY: 1 },400,egret.Ease.elasticOut);
    }

    private trans(){
        this.state = 3; 
        this.transTime = 1;
    }
    
    private next(){
        if(this.wave < this.round){
            this.setState(2);
            this.createEnemy(AiType.Follow);
            this.wave += 1;
        }else{
            var targetPos = this.getPerPos(1.2,0.5);
            this.hero.Move(targetPos);
            this.setState(4);
            this.round += 1;
            this.wave = 1;
            this.bgSpeed = 0;
            this.bgDis = 0;
        }
//        App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.AddScore);
//        egret.setTimeout(() => { this.createEnemy(AiType.Follow);}, this, 1000);
    }
    
    private setState(state: number){
        if(this.state == 5){
            return;
        }
        this.state = state;
    }
    
    private createHero(){
        this.hero = ObjectPool.pop("Hero",this.controller);
        this.hero.init(1,Side.Own);
        var heroPos = this.getPerPos(-0.1,0.5);
        this.hero.x = heroPos.x;
        this.hero.y = heroPos.y;
        this.addChild(this.hero);
        var targetPos = this.getPerPos(0.2,0.5);
        this.hero.Move(targetPos);
    }
    
    private createEnemy(ai: AiType){
        var enemy: Hero = ObjectPool.pop("Hero",this.controller);
        enemy.init(1,Side.Enemy);
        enemy.SetAI(ai);
        var pos = this.getPerPos(1.1, 0.4);
        enemy.x = pos.x;
        enemy.y = pos.y;
        this.addChild(enemy);
        this.enemies.push(enemy);
        var targetPos = this.getPerPos(0.8,0.4);
        enemy.Move(targetPos);
    }
    
    public SetHeroDie(hero: Hero){
        var targetX: number;
        var targetY = this.getPerPos(0, 1.2).y;
        if(hero.side == Side.Own){
            targetX = hero.x - 200;
        }else{
            targetX = hero.x + 200;
        }
        egret.Tween.get(hero).to({ x: targetX,y: targetY,rotation:targetY-hero.y },targetY-hero.y)
            .call(()=>{this.RemoveHero(hero);},this);
    }
    
    public RemoveHero(hero: Hero) {
        hero.destory();
        if(hero.side == Side.Own) {
            this.gameOver();
        } else if(hero.side = Side.Enemy) {
            let index = this.enemies.indexOf(hero);
            this.enemies.splice(index,1);
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.AddScore,this);
            if(this.enemies.length == 0){
                this.trans();
            }
        }
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
        if(direction == 0) {
            item.y -= 50;
        } else {
            item.y += 50;
        }
        this.bgContainer.addChild(item);
        this.items.push(item);
    }
    
    public RemoveItem(item: Item) {
        let index = this.items.indexOf(item);
        this.items.splice(index,1);
        item.destory();
    }
    
    private createStone(id: number) {
        var stone: Stone = ObjectPool.pop("Stone",this.controller);
        var direction = App.RandomUtils.limitInteger(0,1);
        stone.init(id,Side.Middle,direction);
        var pos = this.getPerPos(App.RandomUtils.limit(0.4,0.6),direction);
        stone.x = pos.x;
        stone.y = pos.y;
        if(direction == 0){
            stone.y -= 100;
        }else{
            stone.y += 100;
        }
        this.bgContainer.addChild(stone);
        this.stones.push(stone);
    }

    private clearItems(){
        if(this.items.length > 0){
            for(var i = 0; i < this.items.length; i++){
                this.items[i].destory();
            }
            this.items = [];
        }
    }
    
    private clearStones() {
        if(this.stones.length > 0) {
            for(var i = 0;i < this.stones.length;i++) {
                this.stones[i].destory();
            }
            this.stones = [];
        }
    }
    
    public RemoveStone(stone: Stone) {
        let index = this.stones.indexOf(stone);
        this.stones.splice(index,1);
        stone.destory();
    }
    
    public Jump(up: Boolean){
        if(this.hero != null){
            this.hero.IsUp = up;
        }
    }
    
    public Shoot(){
        if(this.hero != null){
            this.hero.Shoot();
        }
    }
    
    public GetHero(): Hero{
        return this.hero;
    }
    
    public GetOwnBullets(): Array<Bullet>{
        return this.ownBullets;
    }
    
    public GetEnemies(): Array<Hero>{
        return this.enemies;
    }
    
    public GetEnemyBullets(): Array<Bullet> {
        return this.enemyBullets;
    }
    
    public GetItems(): Array<Item> {
        return this.items;
    }
    
    public GetStones(): Array<Stone> {
        return this.stones;
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
