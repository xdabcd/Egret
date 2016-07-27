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

    private _gameUI: egret.DisplayObjectContainer;


    public initGameUI(width: number,height: number) {
        //            this._gameUI = App.DisplayUtils.createBitmap("statusbar_jpg");
        //            this.bg.width = this.width;
        //            this.bg.height = GameManager.Bottom_H;
        //            AnchorUtil.setAnchorY(this.bg,1);
        //            this.bg.name = "bg";
        //            this.addChild(this.bg);
        //
        //            this.jumpBtn = this.createBtn("btn_jump_png",120,-this.bg.height / 2,this.jumpBtnUp,this.jumpBtnDown,this);
        //            this.jumpBtn.name = "jumpBtn";
        //            this.addChild(this.jumpBtn);
        //
        //            this.shootBtn = this.createBtn("btn_shoot_png",this.width - 120,-this.bg.height / 2,this.shootBtnUp,this.shootBtnDown,this);
        //            this.shootBtn.name = "shootBtn";
        //            this.addChild(this.shootBtn);
        //
        //            //键盘控制
        //            App.KeyboardUtils.addKeyUp(this.onKeyUp,this);
        //            App.KeyboardUtils.addKeyDown(this.onKeyDown,this);
    }
}