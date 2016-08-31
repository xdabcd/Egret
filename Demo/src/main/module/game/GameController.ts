/**
 *
 * @author 
 *
 */
class GameController extends BaseController {

    private gameView: GameView;
    private gameUIView: GameUIView;
    private gamePauseView: GamePauseView;
    private gameOverView: GameOverView;
    
    public constructor() {
        super();

        //初始化数据
        GameManager.Init();
        
        //初始化UI
        this.gameView = new GameView(this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Game, this.gameView);
        this.gameUIView = new GameUIView(this, LayerManager.Game_UI);
        App.ViewManager.register(ViewConst.GameUI, this.gameUIView);
        this.gamePauseView = new GamePauseView(this, LayerManager.UI_Pop);
        App.ViewManager.register(ViewConst.GamePop, this.gamePauseView);
        this.gameOverView = new GameOverView(this, LayerManager.UI_Pop);
        App.ViewManager.register(ViewConst.GameOver, this.gameOverView);
        
        this.registerFunc(GameConst.Jump, this.gameView.Jump, this.gameView);
        this.registerFunc(GameConst.Shoot, this.gameView.Shoot, this.gameView);
        this.registerFunc(GameConst.Dodge, this.gameView.Dodge, this.gameView);
        this.registerFunc(GameConst.CeateBullet, this.gameView.CreateBullet, this.gameView);
        this.registerFunc(GameConst.RemoveBullet, this.gameView.RemoveBullet, this.gameView);
        this.registerFunc(GameConst.RemoveItem,this.gameView.RemoveItem,this.gameView); 
        this.registerFunc(GameConst.RemoveStone,this.gameView.RemoveStone,this.gameView);
        this.registerFunc(GameConst.HeroDie,this.gameView.SetHeroDie,this.gameView);
        this.registerFunc(GameConst.BossDie,this.gameView.SetBossDie,this.gameView);
        this.registerFunc(GameConst.AddScore,this.gameUIView.AddScore,this.gameUIView);
        this.registerFunc(GameConst.Pause, this.gamePauseView.Pause, this.gamePauseView);
        this.registerFunc(GameConst.Resume, this.gamePauseView.Resume, this.gamePauseView);
        this.registerFunc(GameConst.Destructor, this.destructor, this);
    }

    public destructor() {
        this.gameView.DestoryBoss();
        App.ViewManager.destroy(ViewConst.Game);
        App.ViewManager.destroy(ViewConst.GameUI);
        App.ViewManager.destroy(ViewConst.GamePop);
        App.ViewManager.destroy(ViewConst.GameOver);
    }
    
    /**
     * 获取范围离英雄最近的敌人或道具
     */ 
    public GetNearestInArea(hero: Hero, area: Array<number>): any{
        var unitArr = this.gameView.GetDanger(hero.side);
        var itemArr = this.gameView.GetItems();
        
        var l = 2000;
        var min = area[0];
        var max = area[1];
        var obj: any;
        for(var i = 0; i < unitArr.length; i++){
            var unit = unitArr[i];
            if(unit.y >= min && unit.y <= max){
                if(Math.abs(unit.y - hero.y) < l){
                    l = Math.abs(unit.y - hero.y);
                    obj = unit;
                }
            }
        }
        for(var i = 0;i < itemArr.length;i++) {
            var item = itemArr[i];
            if(item.y >= min && item.y <= max) {
                if(Math.abs(item.y - hero.y) < l) {
                    l = Math.abs(item.y - hero.y);
                    obj = item;
                }
            }
        }
        return obj;
    }
    
    /**
     * 获取安全区域
     */ 
    public GetSafeArea(hero: Hero): Array<number>{        
        var dangerArr = [this.gameView.min_y,this.gameView.max_y];
        var safeArr = [];
        if(!hero.HaveItem()){
            var bullets: Array<Bullet> = this.gameView.GetDangerBullets(hero.side);
            for(var i = 0;i < bullets.length;i++) {
                var bullet = bullets[i];
                var dangerArea = bullet.GetDangerArea(hero.x,0.6);
                for(var j = 0;j < dangerArea.length;j++) {
                    dangerArr.push(dangerArea[j]);
                }
            }
            dangerArr.sort(SortUtils.sortNum);
        }
        var l = hero.height * 1.5;
        for(var i = 0;i < dangerArr.length; i++){
            if(i < dangerArr.length - 1){
                var p1 = dangerArr[i];
                var p2 = dangerArr[i + 1];
                if(p2 - p1 > l){
                    safeArr.push([p1, p2]);
                }
            }
        }
        return safeArr;
    }
    
     /**
      * 检测英雄是否即将受攻击
      */ 
     public checkDanger(hero: Hero, range: number): boolean{
        var arr: Array<Bullet> = this.gameView.GetDangerBullets(hero.side);
        var rect1 = hero.rect;
        rect1.x -= range;
        var rect2 = hero.rect;
        rect2.x += range;
        var rect: Rect;
        for(var i = 0; i < arr.length; i++){
            var bullet = arr[i];
            if(bullet.scaleX > 0){
                 rect = rect1;  
            }else{
                rect = rect2;
            }
            if(rect.intersectTo(bullet.rect)){
                return true;
            }
        }
        
        return false;
     }
    
    /**
     * 检测是否击中子弹
     */ 
    public CheckHitBullet(bullet: Bullet): Array<Bullet>{
        var bullets = [];
        var arr: Array<Bullet> = this.gameView.GetDangerBullets(bullet.side);

        for(let i = 0;i < arr.length;i++) {
            let b: Bullet = arr[i];
            if(this.hitTest(bullet.rect,b.rect)) {
                bullets.push(b);
            }
        }     
        return bullets;
    }
    
    /**
     * 检测子弹是否击中单位
     */ 
    public CheckHitUnit(bullet: Bullet): Array<Unit>{
        var hitUnits = [];
        var arr: Array<Unit> = this.gameView.GetDanger(bullet.side);

        for(let i = 0;i < arr.length;i++) {
            let unit: Unit = arr[i];
            if(unit != null && this.hitTest(bullet.rect, unit.rect)) {
                hitUnits.push(unit);
            }
        }        
        return hitUnits;
    }
    
    /**
     * 检查是否击中道具
     */ 
    public CheckHitItem(obj: BaseGameObject): Array<Item> {
        var hitItems = [];
        var items = this.gameView.GetItems();
        for(let i = 0;i < items.length;i++) {
            let item: Item = items[i];
            if(this.hitTest(obj.rect,item.rect)) {
                hitItems.push(item);
            }
        }
        return hitItems;
    }
    
    /**
     * 检查是否击中石头
     */
    public CheckHitStone(obj: BaseGameObject): Array<Stone> {
        var hitStones = [];
        var stones = this.gameView.GetStones();
        for(let i = 0;i < stones.length;i++) {
            let stone: Stone = stones[i];
            if(this.hitTest(obj.rect,stone.rect)) {
                hitStones.push(stone);
            }
        }
        return hitStones;
    }
    
    /**
     * 检测英雄是否超出范围(Y轴)
     */ 
    public CheckHeroOut(hero: Hero): Boolean{
        if(hero.y - hero.anchorOffsetY < this.gameView.min_y){
            hero.y = this.gameView.min_y + hero.anchorOffsetY;
            return true;
        }else if(hero.y - hero.anchorOffsetY + hero.height > this.gameView.max_y){
            hero.y = this.gameView.max_y + hero.anchorOffsetY - hero.height;
            return true;
        }
        return false;
    }
    
    /**
     * 检测是否超出屏幕
     */
    public CheckOutScreen(object: BaseGameObject): Boolean {
        var w = App.StageUtils.getWidth();
        var h = App.StageUtils.getHeight();
        return !this.hitTest(new Rect(object.x, object.y, object.width, object.height, object.rotation), 
            new Rect(w / 2, h / 2, w + 200, h + 200, 0));
    }
    
    /**
     * 碰撞检测
     */ 
    private hitTest(rect1: Rect, rect2: Rect): boolean {
        return rect1.intersectTo(rect2);
    }
    
    /**
     * 获取游戏横向百分比
     */ 
    public GetPerX(per: number){
        return (this.gameView.max_x - this.gameView.min_x) * per + this.gameView.min_x;
    }
    
    /**
     * 获取游戏纵向百分比
     */
    public GetPerY(per: number) {
        return (this.gameView.max_y - this.gameView.min_y) * per + this.gameView.min_y;
    }
}
