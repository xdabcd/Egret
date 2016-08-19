class MainView extends BaseSpriteView {

    public constructor($controller: BaseController, $parent: BaseSpriteLayer) {
        super($controller, $parent);
    }

    public initUI() {
        super.initUI();

        let stage = App.StageUtils.getStage();

        this.width = stage.width;
        this.height = stage.height;

        const bg = App.DisplayUtils.createBitmap("home_png");
        bg.width = stage.width;
        bg.height = stage.height;
        this.addChild(bg);

        const enterBtn = new egret.Shape();
        enterBtn.x = this.width * 0.5;
        enterBtn.y = this.height * 0.9;
        enterBtn.width = this.width * 0.3;
        enterBtn.height = this.height * 0.15;
        enterBtn.graphics.beginFill(0xffffff, 0);
        enterBtn.graphics.drawRect(0, 0, enterBtn.width, enterBtn.height);
        enterBtn.graphics.endFill();
        AnchorUtil.setAnchor(enterBtn, 0.5);
        enterBtn.touchEnabled = true;
        enterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            App.ControllerManager.applyFunc(ControllerConst.Main, MainFuncConst.ENTER_GAME);
        }, this);
        this.addChild(enterBtn);
    }

    public initData() {
        super.initData();
    }
}