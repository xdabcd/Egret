/**
 *
 * @author
 *
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=GameScene,p=c.prototype;
    p.onAddToStage = function (event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        AppFacade.getInstance().registerMediator(new GameSceneMediator(this));
    };
    p.init = function (width, height, uiHeight) {
        this.width = width;
        this.height = height;
        this.initGameView(width, height - uiHeight);
        this.initGameUI(width, uiHeight);
        this._gameUI.y = height - uiHeight;
    };
    p.initGameView = function (width, height) {
        this._gameView = new egret.DisplayObjectContainer;
        this._gameView.width = width;
        this._gameView.height = height;
        this._gameView.name = "game_view";
        this.addChild(this._gameView);
    };
    p.initGameUI = function (width, height) {
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
        this._shootBtn = this.createBtn("btn_shoot_png", width - 120, bg.height / 2, this.shootBtnDown, this.shootBtnUp, this);
        this._shootBtn.name = "shootBtn";
        this._gameUI.addChild(this._shootBtn);
        //键盘控制
        KeyboardUtils.addKeyUp(this.onKeyUp, this);
        KeyboardUtils.addKeyDown(this.onKeyDown, this);
    };
    p.jumpBtnDown = function () {
        this._jumpBtn.scaleX = this._jumpBtn.scaleY = 0.9;
        this.sendNotification(GameCommand.JUMP, true);
    };
    p.jumpBtnUp = function () {
        this._jumpBtn.scaleX = this._jumpBtn.scaleY = 1;
        this.sendNotification(GameCommand.JUMP, false);
    };
    p.shootBtnDown = function () {
        this._shootBtn.scaleX = this._shootBtn.scaleY = 0.9;
        this.sendNotification(GameCommand.SHOOT);
    };
    p.shootBtnUp = function () {
        this._shootBtn.scaleX = this._shootBtn.scaleY = 1;
    };
    p.onKeyDown = function (keyCode) {
        switch (keyCode) {
            case Keyboard.W:
                this.jumpBtnDown();
                break;
            case Keyboard.K:
                this.shootBtnDown();
                break;
            default:
                break;
        }
    };
    p.onKeyUp = function (keyCode) {
        switch (keyCode) {
            case Keyboard.W:
                this.jumpBtnUp();
                break;
            case Keyboard.K:
                this.shootBtnUp();
                break;
            default:
                break;
        }
    };
    p.createBtn = function (img, $x, $y, downFunc, upFunc, thisObj) {
        var bitmap = DisplayUtils.createBitmap(img);
        bitmap.touchEnabled = true;
        AnchorUtils.setAnchor(bitmap, 0.5);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            if (downFunc != null) {
                downFunc.call(thisObj);
            }
        }, this);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            if (upFunc != null) {
                upFunc.call(thisObj);
            }
        }, this);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
            if (upFunc != null) {
                upFunc.call(thisObj);
            }
        }, this);
        bitmap.x = $x;
        bitmap.y = $y;
        return bitmap;
    };
    /**
        *发消息
        */
    p.sendNotification = function (name, body, type) {
        AppFacade.getInstance().sendNotification(name, body, type);
    };
    return GameScene;
}(egret.DisplayObjectContainer));
egret.registerClass(GameScene,'GameScene');
