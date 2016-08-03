/**
 *
 * @author
 *
 */
var GameUIView = (function (_super) {
    __extends(GameUIView, _super);
    function GameUIView($controller, $parent) {
        _super.call(this, $controller, $parent);
        this.width = App.StageUtils.getWidth();
        this.y = App.StageUtils.getHeight();
    }
    var d = __define,c=GameUIView,p=c.prototype;
    p.initUI = function () {
        _super.prototype.initUI.call(this);
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
        //键盘控制
        App.KeyboardUtils.addKeyUp(this.onKeyUp, this);
        App.KeyboardUtils.addKeyDown(this.onKeyDown, this);
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
    };
    p.jumpBtnDown = function () {
        this.jumpBtn.scaleX = this.jumpBtn.scaleY = 0.9;
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.Jump, true);
    };
    p.jumpBtnUp = function () {
        this.jumpBtn.scaleX = this.jumpBtn.scaleY = 1;
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.Jump, false);
    };
    p.shootBtnDown = function () {
        this.shootBtn.scaleX = this.shootBtn.scaleY = 0.9;
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.Shoot);
    };
    p.shootBtnUp = function () {
        this.shootBtn.scaleX = this.shootBtn.scaleY = 1;
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
    p.createBtn = function (img, $x, $y, upFunc, downFunc, thisObj) {
        var bitmap = App.DisplayUtils.createBitmap(img);
        bitmap.touchEnabled = true;
        AnchorUtil.setAnchor(bitmap, 0.5);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            downFunc.call(thisObj);
        }, this);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            upFunc.call(thisObj);
        }, this);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, function () {
            upFunc.call(thisObj);
        }, this);
        bitmap.x = $x;
        bitmap.y = $y;
        return bitmap;
    };
    return GameUIView;
}(BaseSpriteView));
egret.registerClass(GameUIView,'GameUIView');
