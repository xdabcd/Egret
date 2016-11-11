/**
 *
 * 引导
 *
 */
class TutorialHand extends egret.DisplayObjectContainer {
    private callBack: Function;
    private bg: egret.Sprite;
    private btn: egret.Sprite;
    private sprite: egret.Bitmap;
    private hand: egret.Bitmap;

    public constructor() {
        super();

        this.bg = new egret.Sprite()
        this.addChild(this.bg);
        this.bg.touchEnabled = true;

        this.btn = new egret.Sprite;
        this.addChild(this.btn);
        this.btn.touchEnabled = true;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hide, this);

        this.addChild(this.sprite = DisplayUtils.createBitmap("help_click_light_png"));
        AnchorUtils.setAnchor(this.sprite, 0.5);

        this.addChild(this.hand = DisplayUtils.createBitmap("hand_png"));

        this.play();
    }

    private play() {
        var s = this.sprite;
        egret.Tween.removeTweens(s);
        egret.Tween.removeTweens(this.hand);
        if (s.scaleX < 1) {
            let duration = (1 - s.scaleX) * 5000;
            this.hand.x = this.sprite.x - 5;
            this.hand.y = this.sprite.y - 5;
            egret.Tween.get(s).to({ scaleX: 1, scaleY: 1 }, duration).call(this.play, this);
            egret.Tween.get(this.hand).to({ scaleX: 1, scaleY: 1, x: this.sprite.x, y: this.sprite.y }, duration);
        } else {
            let duration = (s.scaleX - 0.9) * 5000;
            this.hand.x = this.sprite.x;
            this.hand.y = this.sprite.y;
            egret.Tween.get(s).to({ scaleX: 0.9, scaleY: 0.9 }, duration).call(this.play, this);
            egret.Tween.get(this.hand).to({ scaleX: 0.9, scaleY: 0.9, x: this.sprite.x - 5, y: this.sprite.y - 5 }, duration);
        }
    }

    public show(pos: egret.Point, callBack: Function) {
        this.callBack = callBack;
        var g1 = this.bg.graphics;
        g1.clear();
        g1.beginFill(0, 0)
        g1.lineStyle(3000, 0x000000, 0.7)
        g1.drawCircle(pos.x, pos.y, 1500 + 45)
        g1.endFill();

        var g2 = this.btn.graphics;
        g2.clear();
        g2.beginFill(0, 0)
        g2.drawCircle(pos.x, pos.y, 45);
        g2.endFill();

        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
        this.hand.x = pos.x;
        this.hand.y = pos.y;

        this.visible = true;
        this.alpha = 0;
        egret.Tween.get(this).to({ alpha: 1 }, 250);
        this.play();
    }

    public hide() {
        egret.Tween.get(this).to({ alpha: 0 }, 250)
            .call(() => {
                this.visible = false;
                if (this.callBack) {
                    this.callBack();
                }
            }, this);
    }
}
