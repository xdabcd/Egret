/**
 *
 * 游戏UI
 *
 */
class GameUIView extends BaseView{
	public constructor(scene: GameScene) {
    	  super();
    	  this._scene = scene;
	}
	
	/** 游戏场景 */
	private _scene: GameScene;
	/** 背景 */
    private _bg: egret.Bitmap;
    /** 跳跃 */
    private _jumpBtn: egret.Bitmap;
    /** 射击 */
    private _shootBtn: egret.Bitmap;
    /** 闪避 */
    private _dodgeBtn: egret.Bitmap;
    /** 得分 */
    private _score: egret.TextField;
    
    /**
     * 初始化
     */ 
    protected init(): void {
        this._bg = DisplayUtils.createBitmap("bottom_png");
        this.addChild(this._bg);
        this._bg.name = "_bg";
        
        this._jumpBtn = DisplayUtils.createBitmap("btn_jump_png");
        AnchorUtils.setAnchor(this._jumpBtn, 0.5);
        this.addChild(this._jumpBtn);
        this._jumpBtn.name = "_jumpBtn";

        this._dodgeBtn = DisplayUtils.createBitmap("btn_dodge_png");
        AnchorUtils.setAnchor(this._dodgeBtn,0.5);
        this.addChild(this._dodgeBtn);
        this._dodgeBtn.name = "_dodgeBtn";
        
        this._shootBtn = DisplayUtils.createBitmap("btn_shoot_png");
        AnchorUtils.setAnchor(this._shootBtn,0.5);
        this.addChild(this._shootBtn);
        this._shootBtn.name = "_shootBtn";
        
        this._jumpBtn.x = 180;
        this._jumpBtn.y = this._bg.height / 2;
        this._dodgeBtn.x = this._bg.width - 370;
        this._dodgeBtn.y = this._bg.height / 2;
        this._shootBtn.x = this._bg.width - 180;
        this._shootBtn.y = this._bg.height / 2;
    }
    
    
    
    
    
    
    
    public initUI(): void {
        this._bg = DisplayUtils.createBitmap("bottom_png");
        AnchorUtils.setAnchorY(this._bg,1);
        this._bg.name = "_bg";
        this.addChild(this._bg);

        this._jumpBtn = this.createBtn("btn_jump_png",this._bg.width / 8,-this._bg.height / 2,0,this._bg.width / 3,this.jumpBtnUp,this.jumpBtnDown,this);
        this._jumpBtn.name = "_jumpBtn";
        this.addChild(this._jumpBtn);

        this._dodgeBtn = this.createBtn("btn_dodge_png",this._bg.width * 6 / 8,-this._bg.height / 2,this._bg.width * 4 / 6,this._bg.width * 5 / 6,this.dodgeBtnUp,this.dodgeBtnDown,this);
        this._dodgeBtn.name = "_dodgeBtn";
        this.addChild(this._dodgeBtn);

        this._shootBtn = this.createBtn("btn_shoot_png",this._bg.width * 7 / 8,-this._bg.height / 2,this._bg.width * 5 / 6,this._bg.width,this.shootBtnUp,this.shootBtnDown,this);
        this._shootBtn.name = "_shootBtn";
        this.addChild(this._shootBtn);

        this._score = new egret.TextField;
        this._score.width = 200;
        this._score.x = this._bg.width / 2 - 100;
        this._score.y = -100;
        this._score.textAlign = "center";
        this._score.size = 70;
        this._score.bold = true;
        this._score.text = "0";
        this.addChild(this._score);

        //键盘控制
        KeyboardUtils.addKeyUp(this.onKeyUp,this);
        KeyboardUtils.addKeyDown(this.onKeyDown,this);
    }

    public AddScore(value: number) {
        this._score.text = (parseInt(this._score.text) + value).toString();
    }

    private jumpBtnDown() {
        this._jumpBtn.scaleX = this._jumpBtn.scaleY = 0.9;
//        App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.Jump,true);

    }

    private jumpBtnUp() {
        this._jumpBtn.scaleX = this._jumpBtn.scaleY = 1;
//        App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.Jump,false);
    }

    private dodgeBtnDown() {
        this._dodgeBtn.scaleX = this._dodgeBtn.scaleY = 0.9;
//        App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.Dodge);
    }

    private dodgeBtnUp() {
        this._dodgeBtn.scaleX = this._dodgeBtn.scaleY = 1;
    }

    private shootBtnDown() {
        this._shootBtn.scaleX = this._shootBtn.scaleY = 0.9;
//        App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.Shoot);
    }

    private shootBtnUp() {
        this._shootBtn.scaleX = this._shootBtn.scaleY = 1;
    }

    private onKeyDown(keyCode: number): void {
        switch(keyCode) {
            case Keyboard.W:
                this.jumpBtnDown();
                break;
            case Keyboard.I:
                this.shootBtnDown();
                break;
            case Keyboard.U:
                this.dodgeBtnDown();
                break;
            case Keyboard.SPACE:
                TimerManager.setTimeScale(0.1);
                break;
            case Keyboard.J:
                TimerManager.setTimeScale(1);
                break;
            default:
                break;
        }
    }

    private onKeyUp(keyCode: number): void {
        switch(keyCode) {
            case Keyboard.W:
                this.jumpBtnUp();
                break;
            case Keyboard.I:
                this.shootBtnUp();
                break;
            case Keyboard.U:
                this.dodgeBtnUp();
                break;
            default:
                break;
        }
    }

    private createBtn(img: string,$x: number,$y: number,start: number,end: number,upFunc: Function,downFunc: Function,thisObj: any): egret.Bitmap {
        var bitmap: egret.Bitmap = DisplayUtils.createBitmap(img);
        bitmap.touchEnabled = true;
        AnchorUtils.setAnchor(bitmap,0.5);

        var touch = new egret.Sprite;
        touch.width = end - start;
        touch.height = StageUtils.stageH;
        touch.x = (start + end) / 2;
        touch.y = -touch.height / 2;
        touch.touchEnabled = true;
        AnchorUtils.setAnchor(touch,0.5);
        var sh = new egret.Shape();
        sh.graphics.beginFill(0xffffff,0);
        sh.graphics.drawRect(0,0,touch.width,touch.height);
        sh.graphics.endFill();
        touch.addChild(sh);
        this.addChild(touch);
        bitmap.touchEnabled = false;

        touch.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(): void {
            downFunc.call(thisObj);
        },this);
        touch.addEventListener(egret.TouchEvent.TOUCH_END,function(): void {
            upFunc.call(thisObj);
        },this);
        touch.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,function(): void {
            upFunc.call(thisObj);
        },this);

        bitmap.x = $x;
        bitmap.y = $y;
        return bitmap;
    }
}
