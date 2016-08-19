/**
 *
 * @author 
 *
 */
class GameView extends BaseSpriteView {
    private controller: BaseController;
    
    private bgContainer: egret.DisplayObjectContainer;
    private hero: Hero;
    private boss: Boss;
    private ownBullets: Array<Bullet> = [];
    private enemies: Array<Hero> = [];
    private enemyBullets: Array<Bullet> = [];
    private items: Array<Item> = [];
    private stones: Array<Stone> = [];
    private sceneEffet: SceneEffect;
    private sceneBullets: Array<Bullet> = [];
    private itemInterval = 5;
    private itemCd = 0;
    private stoneInterval = 6;
    private stoneCd = 0;
    private seInterval = 15;
    private seCd = 0;
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
                if(this.isBossRound){
                    this.createBoss();
                }else{
                    this.createEnemy(AiType.Follow);
                    this.seCd = App.RandomUtils.limit(this.seInterval / 2,this.seInterval);
                }
               
                this.setState(2);
                break;
            case 2:
                this.itemCd -= t;

                if(this.itemCd <= 0) {
                    this.createItem(App.RandomUtils.limitInteger(2, 8));
                    this.itemCd = this.itemInterval;
                }
                
                if(!this.isBossRound){
                    this.stoneCd -= t;
                    if(this.stoneCd <= 0) {
                        this.createStone(App.RandomUtils.limitInteger(1,2));
                        this.stoneCd = this.stoneInterval;
                    }

                    this.seCd -= t;
                    if(this.seCd <= 0) {
                        this.addSceneEffect();
                        this.seCd = this.seInterval;
                    }
                }
               
                break;
            case 3:
                this.transTime -= t;
                if(this.transTime <= 0){
                    this.next();
                }
                break;
            case 4:
                var w = App.StageUtils.getWidth();
                if(this.hero != null && this.hero.GetState() == UnitState.Idle){
                    this.hero.destory();
                    this.hero = null;
                }
                if(this.bgDis > w * 2 / 3){
                    this.clearItems();
                    this.clearStones();
                    this.clearEffect();
                }
                if(this.bgDis > w * 4) {
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
                this.bgContainer.x = (this.bgContainer.x - this.bgSpeed * time) % w;
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
        this.setState(3);
        this.transTime = 0;
    }
    
    private get isBossRound(): boolean{
        return this.round % 3 == 0;
    }
    
    private next(){
        if(!this.isBossRound && this.wave < this.round % 3){
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
    }
    
    private setState(state: number){
        if(this.state == 5){
            return;
        }
        this.state = state;
    }
    
    private addSceneEffect(){
        var se: SceneEffect = ObjectPool.pop("SceneEffect",this.controller);
        var arr = [0, 180, 25, 155, -25, -155];
        se.init(Side.Middle,arr[App.RandomUtils.limitInteger(0,arr.length - 1)]);
        se.x = this.getPerXPos(0.5);
        se.y = this.getPerYPos(0.5);
        this.bgContainer.addChild(se);
        this.sceneEffet = se;
    }
    
    private createHero(){
        this.hero = ObjectPool.pop("Hero",this.controller);
        this.hero.init(1,Side.Own);
        var heroPos = this.getPerPos(-0.1,0.5);
        this.hero.x = heroPos.x;
        this.hero.y = heroPos.y;
        this.hero.SetPosArr(this.getHeroPos(0),this.getHeroPos(1));
        this.addChild(this.hero);
        this.hero.Entrance();
    }
    
    private createEnemy(ai: AiType){
        var enemy: Hero = ObjectPool.pop("Hero",this.controller);
        enemy.init(1,Side.Enemy);
        enemy.SetAI(ai);
        var pos = this.getPerPos(1.1, 0.4);
        enemy.x = pos.x;
        enemy.y = pos.y;
        enemy.SetPosArr(this.getHeroPos(3),this.getHeroPos(2));
        this.addChild(enemy);
        this.enemies.push(enemy);
        enemy.Entrance();
    }
    
    private createBoss() {
        this.boss = ObjectPool.pop("Boss",this.controller);
        this.boss.init(1,Side.Enemy);
        var pos = this.getPerPos(0.8,0.4);
        this.boss.x = pos.x;
        this.boss.y = pos.y;
        this.addChild(this.boss);
    }
    
    public SetBossDie() {
        egret.Tween.get(this.boss).to({ alpha: 0.1 }, 600)
            .call(() => { this.RemoveBoss(); },this);
    }
    
    public RemoveBoss() {
        this.boss.destory();
        this.boss = null;
        App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.AddScore, 5);
        this.trans();
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
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.AddScore, 1);
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
        } else if(creater.side == Side.Middle){
            this.sceneBullets.push(bullet);
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
    
    private clearEffect(){
        if(this.sceneEffet != null){
            this.sceneEffet.destory();
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
    
    public Dodge(){
        if(this.hero != null){
            this.hero.Dodge();
        }
    }
    
    public GetDanger(side: Side): Array<Unit>{
        var arr = [];
        var a = this.hero;
        var b = this.enemies;
        var c = this.boss;
        if(side == Side.Own) {
            for(var i = 0;i < b.length;i++) {
                arr.push(b[i]);
            }
            if(c != null){
                arr.push(c);
            }
        } else if(side == Side.Enemy) {
            if(a != null){
                arr.push(a);
            }
        } else if(side == Side.Middle){
            if(a != null) {
                arr.push(a);
            }
            for(var i = 0;i < b.length;i++) {
                arr.push(b[i]);
            }
            if(c != null) {
                arr.push(c);
            }
        }
        return arr;
    }
    
    public GetDangerBullets(side: Side): Array<Bullet>{
        var arr = [];
        var a = [];
        var b = this.sceneBullets;
        if(side == Side.Own){
            a = this.enemyBullets;
        }else if(side == Side.Enemy){
            a = this.ownBullets;
        }
        for(var i = 0; i < a.length; i++){
            arr.push(a[i]);
        }
        for(var i = 0;i < b.length;i++) {
            arr.push(b[i]);
        }
        return arr;
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
    
    private getHeroPos(idx: number){
        return this.getPerXPos(GameManager.GetHeroPos(idx));
    }
    
    private getPerXPos(perX: number): number{
        return (this.max_x - this.min_x) * perX + this.min_x;
    }
    
    private getPerYPos(perY: number): number {
        return (this.max_y - this.min_y) * perY + this.min_y;
    }
    
    private getPerPos(perX: number, perY: number): egret.Point{
        return new egret.Point(this.getPerXPos(perX), this.getPerYPos(perY));
    }
}
