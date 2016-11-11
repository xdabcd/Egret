/**
 *
 * 按钮
 *
 */
class Button extends egret.DisplayObjectContainer {
    private callBack: Function;
    private terms: Array<Function>;
    private bg: egret.Bitmap;
    private sprite: egret.Bitmap;
    private canTouch: boolean;

    public constructor() {
        super();

        this.bg = new egret.Bitmap;
        AnchorUtils.setAnchor(this.bg, 0.5);
        this.addChild(this.bg);

        this.sprite = new egret.Bitmap;
        AnchorUtils.setAnchor(this.sprite, 0.5);
        this.addChild(this.sprite);

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.touchEnabled = true;
    }

    /**
     * 初始化
     */
    public init(bg: string, sprite: string) {
        this.bg.texture = RES.getRes(bg);
        this.sprite.texture = RES.getRes(sprite);
        this.terms = [];
        this.callBack = null;
        this.canTouch = true;
        this.sprite.x = 0;
        this.sprite.y = 0;
    }

    /**
    * 点击回调
    */
    protected onTap(e) {
        SoundManager.playEffect("click_mp3");
        if (!this.canTouch) return;

        for (var i = 0; i < this.terms.length; i++) {
            if (!this.terms[i]) {
                return;
            }
        }

        this.canTouch = false;

        egret.Tween.get(this).to({ scaleX: 0.95, scaleY: 0.95 }, 80, egret.Ease.quadOut)
            .call(() => {
                if (this.callBack) {
                    this.callBack();
                }
                egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 80, egret.Ease.quadOut)
                    .call(() => { this.canTouch = true });
            }, this);
    }

    public addTerm(func: Function) {
        this.terms.push(func);
    }

    /**
     * 设置点击回调
     */
    public setOnTap(callBack: Function) {
        this.callBack = callBack;
    }

    public setSprite(sprite: string) {
        this.sprite.texture = RES.getRes(sprite);
    }

    public setSpriteOffset(x: number, y: number) {
        this.sprite.x = x;
        this.sprite.y = y;
    }
}
