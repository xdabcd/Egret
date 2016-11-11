/**
 *
 * 弹出提示框
 *
 */
class PopHint extends egret.DisplayObjectContainer {
    private callBack: Function;
    private con: egret.DisplayObjectContainer;
    private m: egret.Sprite;
    private bg: egret.Bitmap;
    private text: egret.TextField;

    public constructor() {
        super();

        this.addChild(this.m = new egret.Sprite);
        this.m.alpha = 0;
        this.m.touchEnabled = true;

        this.addChild(this.con = new egret.DisplayObjectContainer);

        StageUtils.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
        this.onResize();

        this.bg = new egret.Bitmap;
        this.con.addChild(this.bg);
        this.bg.touchEnabled = true;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hide, this);

        this.text = new Label;
        this.text.size = 45;
        this.text.textColor = 0xffffd2;
        this.con.addChild(this.text);
    }

    private onResize() {
        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        DrawUtils.drawRect(this.m, w, h, 0xffffff);
        this.con.x = w / 2;
        this.con.y = h / 2;
    }

    public show(bg: string, text: string, callBack: Function, duration: number) {
        SoundManager.playEffect("popup_mp3");
        this.bg.texture = RES.getRes(bg);
        AnchorUtils.setAnchor(this.bg, 0.5);
        this.text.text = text;
        this.callBack = callBack;
        this.visible = true;
        this.con.scaleX = this.con.scaleY = 0;
        egret.Tween.get(this.con).to({ scaleX: 1, scaleY: 1 }, 250, egret.Ease.backOut);
        TimerManager.doTimer(duration, 1, () => {
            if (this.visible) {
                this.hide();
            }
        }, this);
    }

    public hide() {
        egret.Tween.get(this.con).to({ scaleX: 0, scaleY: 0 }, 250, egret.Ease.backIn)
            .call(() => {
                this.visible = false;
                if (this.callBack) {
                    this.callBack();
                }
            }, this);
    }
}
