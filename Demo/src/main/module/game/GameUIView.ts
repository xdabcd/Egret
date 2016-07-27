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
    
    public initUI(): void {
        super.initUI();
        
        this.bg = App.DisplayUtils.createBitmap("statusbar_jpg");
        this.bg.width = this.width;
        this.bg.height = GameManager.Bottom_H;
        AnchorUtil.setAnchorY(this.bg, 1);
        this.bg.name = "bg";
        this.addChild(this.bg);
        
        this.jumpBtn = this.createBtn("btn_jump_png", 120, -this.bg.height / 2, this.jumpBtnUp, this.jumpBtnDown, this);
        this.jumpBtn.name = "jumpBtn";
        this.addChild(this.jumpBtn);           
        
        this.shootBtn = this.createBtn("btn_shoot_png", this.width - 120, -this.bg.height / 2, this.shootBtnUp, this.shootBtnDown, this);
        this.shootBtn.name = "shootBtn";
        this.addChild(this.shootBtn);
        
        //键盘控制
        App.KeyboardUtils.addKeyUp(this.onKeyUp,this);
        App.KeyboardUtils.addKeyDown(this.onKeyDown,this);
    }

    public initData(): void {
        super.initData();
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
            default:
                break;
        }
    }
    
    private onKeyUp(keyCode: number): void {
        switch(keyCode) {
            case Keyboard.W:
                this.jumpBtnUp();
                break;
            case Keyboard.D:
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
        bitmap.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(): void {
            downFunc.call(thisObj);
        },this);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_END,function(): void {
            upFunc.call(thisObj);
        },this);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,function(): void {
            upFunc.call(thisObj);
        },this);
        
        bitmap.x = $x;
        bitmap.y = $y;
        return bitmap;
    }
}
