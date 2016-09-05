/**
 *
 * 游戏
 *
 */
class GameView extends BaseView{
    public constructor() {
        super();
    }
    
    /** 背景层 */
    private _bgLayer: egret.DisplayObjectContainer;
    /** 背景 */
    private _bg: egret.Bitmap;
    
    /**
     * 初始化
     */ 
    protected init(){
        super.init();
        
        this._bgLayer = new egret.DisplayObjectContainer;
        this.addChild(this._bgLayer);
        this._bgLayer.name = "_bgLayer";
        
        this._bg = DisplayUtils.createBitmap("bg_1_png");
        this._bgLayer.addChild(this._bg);
        this._bg.name = "_bg";
    }
    
    /**
     * 添加英雄
     */ 
    public addHero(hero: Hero){
        this.addChild(hero);
    }
    
    /**
     * 添加敌人
     */
    public addEnemy(enemy: Enemy){
        this.addChild(enemy);
    }

    /**
     * 添加子弹
     */
    public addBullet(bullet: Bullet) {
        this.addChild(bullet);
    }

    /**
     * 添加道具
     */
    public addItem(item: Item){
        this.addChild(item);
    }
}
