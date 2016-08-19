class GameOverView extends BaseSpriteView {
    public constructor($controller: BaseController, $parent: BaseSpriteLayer) {
        super($controller, $parent);
    }

    public initUI() {
        super.initUI();
        const stage = App.StageUtils.getStage();
        
        this.width = stage.stageWidth;
        this.height = stage.stageHeight;

        let bgImg = new eui.Image("pop_bg_png");
        bgImg.width = this.width;
        bgImg.height = this.height;
        bgImg.alpha = 0.6;
        this.addChild(bgImg);

        const overBg = new egret.Bitmap(RES.getRes("over_png"));
        overBg.x = this.width * 0.5;
        overBg.y = this.height * 0.5;
        AnchorUtil.setAnchor(overBg, 0.5);
        overBg.height = this.height * 0.6;
        this.addChild(overBg);

        const restartBtn = new egret.Shape();
        restartBtn.width = overBg.width * 0.4;
        restartBtn.height = overBg.height * 0.2;
        AnchorUtil.setAnchor(restartBtn, 0.5);
        restartBtn.x = this.width * 0.5;
        restartBtn.y = this.height * 0.7;
        restartBtn.graphics.beginFill(0xffffff, 0);
        restartBtn.graphics.drawRect(0, 0, restartBtn.width, restartBtn.height);
        restartBtn.graphics.endFill();
        restartBtn.touchEnabled = true;
        restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {this.restart()}, this);
        this.addChild(restartBtn);
    }

    public initData() {
        super.initData();
    }

    private resetGame() {
        App.ViewManager.closeAll();
        
        //析构GameController
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.Destructor);
        App.ControllerManager.unregister(ControllerConst.Game);

        //清理对象池
        ObjectPool.clear();

        //重新生成并注册GameController
        App.ControllerManager.register(ControllerConst.Game, new GameController());
    }

    public restart() {
        this.resetGame()
        App.SceneManager.runScene(SceneConst.Game);
    }

    public returnToHome() {
        this.resetGame()
        App.SceneManager.runScene(SceneConst.Main);
    }

    public destroy() {
        super.destroy();
        delete this;
    }
}