/**
 *
 * 游戏UI
 *
 */
class GameUIView extends BaseView{
	public constructor() {
    	  super();
	}
	
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
        
        this._score = new egret.TextField;
        this._score.width = 200;
        this._score.textAlign = "center";
        this._score.size = 70;
        this._score.bold = true;
        this._score.text = "0";
        this.addChild(this._score);
        this._score.name = "_score";
        this._score.x = this._bg.width / 2 - 100;
        this._score.y = 40;
    }

    /**
     * 设置得分
     */ 
    public setScore(value: number) {
        this._score.text = value.toString();
    }
}
