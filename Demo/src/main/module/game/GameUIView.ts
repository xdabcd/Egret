/**
 *
 * @author 
 *
 */
class GameUIView extends BaseSpriteView {
    public constructor($controller: BaseController,$parent: egret.DisplayObjectContainer) {
        super($controller,$parent);
        this.width = App.StageUtils.getWidth();
        this.y = App.StageUtils.getHeight();
    }
    
    private bg: egret.Bitmap;
    private jumpBtn: egret.Bitmap;
    private shootBtn: egret.Bitmap;
    private score: egret.TextField;
    
    public initUI(): void {
        super.initUI();
        
        this.bg = App.DisplayUtils.createBitmap("bottom_png");
        AnchorUtil.setAnchorY(this.bg, 1);
        this.bg.name = "bg";
        this.addChild(this.bg);
        
        this.jumpBtn = this.createBtn("btn_jump_png", 180, -this.bg.height / 2, this.jumpBtnUp, this.jumpBtnDown, this);
        this.jumpBtn.name = "jumpBtn";
        this.addChild(this.jumpBtn);           
        
        this.shootBtn = this.createBtn("btn_shoot_png", this.width - 180, -this.bg.height / 2, this.shootBtnUp, this.shootBtnDown, this);
        this.shootBtn.name = "shootBtn";
        this.addChild(this.shootBtn);
        
        this.score = new egret.TextField;
        this.score.width = 200;
        this.score.x = this.bg.width / 2 - 100;
        this.score.y = -100;
        this.score.textAlign = "center";
        this.score.size = 70;
        this.score.bold = true;
        this.score.text = "0";
        this.addChild(this.score);
        
        //键盘控制
        App.KeyboardUtils.addKeyUp(this.onKeyUp,this);
        App.KeyboardUtils.addKeyDown(this.onKeyDown,this);
    }

    public initData(): void {
        super.initData();
    }
    
    public AddScore(){
        this.score.text = (parseInt(this.score.text) + 1).toString();
    }
    
    private jumpBtnDown(){
        this.jumpBtn.scaleX = this.jumpBtn.scaleY = 0.9;
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.Jump, true);

    }
    
    private jumpBtnUp(){
        this.jumpBtn.scaleX = this.jumpBtn.scaleY = 1;
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.Jump, false);
    }
    
    private shootBtnDown(){
        this.shootBtn.scaleX = this.shootBtn.scaleY = 0.9;
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.Shoot);
    }
    
    private shootBtnUp(){
        this.shootBtn.scaleX = this.shootBtn.scaleY = 1;
    }
    
    private onKeyDown(keyCode: number): void {
        switch(keyCode) {
            case Keyboard.W:
                this.jumpBtnDown();
                break;
            case Keyboard.K:
                this.shootBtnDown();
                break;
            case Keyboard.SPACE:
                App.TimerManager.setTimeScale(0.02);
                break;
            case Keyboard.J:
                App.TimerManager.setTimeScale(1);
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
            case Keyboard.K:
                this.shootBtnUp();
                break;
            default:
                break;
        }
    }
    
    private createBtn(img: string, $x: number, $y: number, upFunc: Function, downFunc: Function, thisObj: any): egret.Bitmap{
        var bitmap: egret.Bitmap = App.DisplayUtils.createBitmap(img);
        bitmap.touchEnabled = true;
        AnchorUtil.setAnchor(bitmap,0.5);
        
        var touch = new egret.Sprite;
        touch.width = bitmap.width * 10;
        touch.height = App.StageUtils.getHeight();
        touch.x = $x;
        touch.y = -touch.height / 2;
        touch.touchEnabled = true;
        AnchorUtil.setAnchor(touch,0.5);
        var sh = new egret.Shape();
        sh.graphics.beginFill(0xffffff, 0);
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
