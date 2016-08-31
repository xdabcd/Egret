class GamePauseView extends BaseSpriteView {
    public constructor($controller: BaseController, $parent: egret.DisplayObjectContainer) {
        super($controller, $parent)
        this.width = App.StageUtils.getWidth();
        this.height = App.StageUtils.getHeight();
    }

    private bgImg: eui.Image;
    private resumeBtn: egret.Bitmap;

    public initUI(): void {
        super.initUI();

        this.bgImg = new eui.Image("pop_bg_png");
        this.bgImg.width = this.width;
        this.bgImg.height = this.height;
        this.bgImg.alpha = 0.6;
        this.bgImg.name = "background";

        var pauseUI = new egret.Bitmap(RES.getRes("pause_png"));
        pauseUI.height = this.height * 0.5;
        pauseUI.width = pauseUI.height * 1.893;
        pauseUI.x = this.width / 2;
        pauseUI.y = this.height / 2;
        AnchorUtil.setAnchor(pauseUI, 0.5);

        var resumeBtnTouchArea = new egret.Shape();
        resumeBtnTouchArea.width = pauseUI.width * 0.1465;
        resumeBtnTouchArea.height = pauseUI.height * 0.2137;
        resumeBtnTouchArea.x = pauseUI.width * 0.8774;
        resumeBtnTouchArea.y = pauseUI.height * 0.9333;
        resumeBtnTouchArea.graphics.beginFill(0xfffff, 0);
        resumeBtnTouchArea.graphics.drawRect(0, 0, resumeBtnTouchArea.width, resumeBtnTouchArea.height);
        resumeBtnTouchArea.graphics.endFill();
        resumeBtnTouchArea.touchEnabled = true;
        resumeBtnTouchArea.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Resume, resumeBtnTouchArea);
 
        this.addChild(this.bgImg);
        this.addChild(pauseUI);
        this.addChild(resumeBtnTouchArea);
    }

    public Pause() {
        App.TimerManager.setTimeScale(0);
        App.ViewManager.isShow(ViewConst.GamePop) || App.ViewManager.open(ViewConst.GamePop);
    }

    public Resume() {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Resume, this);
        App.TimerManager.setTimeScale(1);
        App.ViewManager.isShow(ViewConst.GamePop) && App.ViewManager.close(ViewConst.GamePop);
    }

    public initData(): void {
        super.initData()
    }

    private resumeBtnUp() {
        this.scaleX = this.scaleY = 0.9;
        this.Resume();
    }

    private resumeBtnDown() {
        this.scaleX = this.scaleY = 1;
    }

    private createBtn(img: string, $x: number, $y: number, upFunc: Function, downFunc: Function, thisObj: any): egret.Bitmap{
        var bitmap: egret.Bitmap = App.DisplayUtils.createBitmap(img);
        bitmap.touchEnabled = true;
        bitmap.x = $x;
        bitmap.y = $y;
        AnchorUtil.setAnchor(bitmap,0.5);
        
        var touch = new egret.Sprite;
        touch.width = bitmap.width * 2;
        touch.height = bitmap.height * 2;
        touch.x = $x;
        touch.y = $y;
        touch.touchEnabled = true;
        AnchorUtil.setAnchor(touch,0.5);
        var sh = new egret.Shape();
        sh.graphics.beginFill(0xffffff, 1);
        sh.graphics.drawRect(0, 0 ,touch.width,touch.height);
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
        
        return bitmap;
    }

    public destroy() {
        super.destroy();
        delete this;
    }

}