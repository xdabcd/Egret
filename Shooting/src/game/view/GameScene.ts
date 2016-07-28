/**
 *
 * @author 
 *
 */
class GameScene extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event: egret.Event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this)
        AppFacade.getInstance().registerMediator(new GameSceneMediator(this));
    }
    
    public init(width: number, height: number, uiHeight: number){
        this.width = width;
        this.height = height;
        this.initGameView(width, height - uiHeight);
        this.initGameUI(width, uiHeight);
        this._gameUI.y = height - uiHeight; 
    }
    
    
    /**
     * 游戏
     */ 
    private _gameView: egret.DisplayObjectContainer;
    
    private initGameView(width: number, height: number){
        this._gameView = new egret.DisplayObjectContainer;
        this._gameView.width = width;
        this._gameView.height = height;
        this._gameView.name = "game_view";
        this.addChild(this._gameView);
    
    }
    
    /**
     * 创建英雄
     */ 
//    public createGemstoneUI(gemstone: Gemstone): void {
//        var gsUI: GemstoneUI = <GemstoneUI>(ObjectPool.getPool("game.GemstoneUI").borrowObject());  //从对象池创建
//        gsUI.reset();
//        gsUI.position.x = gemstone.position.x;
//        gsUI.position.y = gemstone.position.y;
//        gsUI.setSize(this.gemstoneSize);
//        var tp: Vector2 = this.getTruePosition(gemstone.position);
//        gsUI.x = tp.x;
//        gsUI.y = tp.y;
//        gsUI.type = gemstone.type;
//        gsUI.touchEnabled = true;
//        this.gemstoneGroup.addChild(gsUI);
//        gsUI.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.gemstoneOnTouch,this);
//        gsUI.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gemstoneOnClick,this);
//        gsUI.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.gemstoneOnMove,this);
//    }
    
    /**
     * 游戏UI
     */ 
    private _gameUI: egret.DisplayObjectContainer;
    private _jumpBtn: egret.Bitmap;
    private _shootBtn: egret.Bitmap;
    
    private initGameUI(width: number,height: number) {
        this._gameUI = new egret.DisplayObjectContainer;
        this._gameUI.width = width;
        this._gameUI.height = height;
        this._gameUI.name = "game_ui";
        this.addChild(this._gameUI);
        
        var bg = DisplayUtils.createBitmap("bottom_jpg");
        bg.width = width;
        bg.height = height;
        bg.name = "bg";
        this._gameUI.addChild(bg);
                
        this._jumpBtn = this.createBtn("btn_jump_png", 120, bg.height / 2, this.jumpBtnDown, this.jumpBtnUp, this);
        this._jumpBtn.name = "jumpBtn";
        this._gameUI.addChild(this._jumpBtn);

        this._shootBtn = this.createBtn("btn_shoot_png", width - 120,bg.height / 2, this.shootBtnDown, this.shootBtnUp, this);
        this._shootBtn.name = "shootBtn";
        this._gameUI.addChild(this._shootBtn);

        //键盘控制
        KeyboardUtils.addKeyUp(this.onKeyUp,this);
        KeyboardUtils.addKeyDown(this.onKeyDown,this);
    }
    
    private jumpBtnDown(){
        this._jumpBtn.scaleX = this._jumpBtn.scaleY = 0.9;
        this.sendNotification(GameCommand.JUMP, true);
    }
    
    private jumpBtnUp(){
        this._jumpBtn.scaleX = this._jumpBtn.scaleY = 1;
        this.sendNotification(GameCommand.JUMP, false);
    }
    
    private shootBtnDown(){
        this._shootBtn.scaleX = this._shootBtn.scaleY = 0.9;
        this.sendNotification(GameCommand.SHOOT);
    }
    
    private shootBtnUp() {
        this._shootBtn.scaleX = this._shootBtn.scaleY = 1;
    }
    
    private onKeyDown(keyCode: number) {
        switch(keyCode) {
            case Keyboard.W:
                this.jumpBtnDown();
                break;
            case Keyboard.K:
                this.shootBtnDown();
                break;
            default:
                break;
        }
    }
    
    private onKeyUp(keyCode: number){
        switch(keyCode) {
            case Keyboard.W:
                this.jumpBtnUp();
                break;
            case Keyboard.K:
                this.shootBtnUp();
                break;
            default:
                break;
        }
    }

    private createBtn(img: string,$x: number,$y: number,downFunc: Function,upFunc: Function,thisObj: any): egret.Bitmap {
        var bitmap: egret.Bitmap = DisplayUtils.createBitmap(img);
        bitmap.touchEnabled = true;
        AnchorUtils.setAnchor(bitmap,0.5);
        
        bitmap.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(): void {
            if(downFunc != null) {
                downFunc.call(thisObj);
            }
        },this);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_END,function(): void {
            if(upFunc != null){
                upFunc.call(thisObj);
            }
        },this);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,function(): void {
            if(upFunc != null) {
                upFunc.call(thisObj);
            }
        },this);

        bitmap.x = $x;
        bitmap.y = $y;
        return bitmap;
    }
    
    /**
        *发消息
        */
    private sendNotification(name: string,body?: any,type?: string): void {
        AppFacade.getInstance().sendNotification(name,body,type);
    }
}