/**
 *
 * 游戏场景
 *
 */
class GameScene extends BaseView{
	
	/** 游戏 */
	private _gameView: GameView;
	/** ui */
	private _uiView: GameUIView;
	
	/** 英雄 */
	private _hero: Hero;
	
	/** 物理世界与真实世界的转换因子 */
	private _factor: number = 30;
	/** 世界 */
	private _world: p2.World;
    /** 重力 */
	private _gravity: number = 30;
	/** 物理碰撞框 */
	private _debugDraw: p2DebugDraw;
	/** 地面 */
	private _landBody: p2.Body;	
	
	/**
	 * 初始化
	 */ 
	protected init(){
    	super.init();
    	
    	GameDataManager.Init();
    	
        this._gameView = new GameView;
        this.addChild(this._gameView);
    	
	    this._uiView = new GameUIView(this);
        this.addChild(this._uiView);
	    
	    this._gameView.x = 0;
	    this._uiView.y = StageUtils.stageH;
	    AnchorUtils.setAnchorY(this._uiView, 1);
	    
        this.initWorld();
        this.initLand(0,StageUtils.stageH - GameDataManager.UI_H);   
        this.showDebugDraw();
        
        this.addHero();
	}
	
	/**
	 * 更新
	 */ 
	protected update(time: number){
	    super.update(time);
	    
        this._world.step(time / 10000);
	    this._debugDraw.drawDebug();
	}
	
	/**
	 * 初始化世界
	 */ 
	private initWorld(){
	    this._world = new p2.World;
	    this._world.sleepMode = p2.World.BODY_SLEEPING;
	    this._world.gravity = [0, this._gravity];
	}
	
	/**
	 * 初始化地面
	 */ 
    private initLand(x: number, y: number): void {
        this._landBody = new p2.Body();
        this._landBody.addShape(new p2.Plane);
        this._landBody.type = p2.Body.STATIC;
        this._landBody.position = [x / this._factor, y / this._factor];
        this._landBody.angle = Math.PI;
        this._world.addBody(this._landBody);
    }
	
	/**
	 * 显示物理碰撞框
	 */ 
    private showDebugDraw(): void {
        var sprite: egret.Sprite = new egret.Sprite();
        this.addChild(sprite);
        this._debugDraw = new p2DebugDraw(this._world,sprite);
    }
    
    /**
     * 添加英雄
     */ 
    private addHero(){
        this._hero = this._gameView.addHero(1);
        var pos: egret.Point = this.getHeroPos(0); 
        this._hero.x = pos.x; 
        this._hero.y = pos.y;
        
        var body: p2.Body = new p2.Body({ mass: 1 });
        body.position = [this._hero.x / this._factor, this._hero.y / this._factor];
        body.fromPolygon(this._hero.points, { optimalDecomp: false });

        this._world.addBody(body);
    }
    
    /**
     * 获取英雄位置
     */ 
    private getHeroPos(idx: number): egret.Point{
        return new egret.Point(StageUtils.stageW * GameDataManager.GetHeroPos(idx), StageUtils.stageH * 0.3);
    }
}
