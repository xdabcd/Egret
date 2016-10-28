/**
 *
 * 按钮
 *
 */
class Button extends egret.DisplayObjectContainer {
    protected callBack: Function;
    protected terms: Array<Function>;
    protected sprite: egret.Bitmap;
    protected textLabel: egret.TextField;
    protected imgLabel: egret.Bitmap;
    protected canTouch: boolean;
    protected preanimation: boolean;
    protected tweenSpeed: number;

    public constructor() {
        super();

        this.sprite = new egret.Bitmap;
        AnchorUtils.setAnchor(this.sprite, 0.5);
        this.addChild(this.sprite);

        this.imgLabel = new egret.Bitmap;
        AnchorUtils.setAnchor(this.imgLabel, 0.5);
        this.addChild(this.imgLabel);

        this.textLabel = new egret.TextField;
        this.textLabel.textAlign = "center";
        AnchorUtils.setAnchor(this.textLabel, 0.5);
        this.addChild(this.textLabel);

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.touchEnabled = true;
    }

    /**
     * 初始化
     */
    public init(sprite: string, preanimation: boolean = false) {
        this.sprite.texture = RES.getRes(sprite);
        this.textLabel.text = "";
        this.imgLabel.texture = null;
        this.terms = [];
        this.callBack = null;
        this.canTouch = true;
        this.preanimation = preanimation;
        this.tweenSpeed = 200;
    }

    /**
    * 点击回调
    */
    protected onTap(e) {
        if (!this.canTouch) return;

        for (var i = 0; i < this.terms.length; i++) {
            if (!this.terms[i]) {
                return;
            }
        }

        this.canTouch = false;

        if (this.preanimation) {
            if (this.callBack) {
                this.callBack();
            }
        }

        SoundManager.playEffect("pop_mp3");

        egret.Tween.get(this).to({ scaleX: 1.1, scaleY: 1.1 }, this.tweenSpeed, egret.Ease.quadOut)
            .call(() => {
                if (!this.preanimation) {
                    if (this.callBack) {
                        this.callBack();
                    }
                }
                egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, this.tweenSpeed, egret.Ease.quadOut)
                    .call(() => { this.canTouch = true });
            }, this);
    }

    public addTerm(func: Function) {
        this.terms.push(func);
    }

    public setImageLabel(image: string) {
        this.imgLabel.texture = RES.getRes(image);
    }

    public setTextLabel(text: string, font: string = "Arial") {
        this.textLabel.width = this.width * 0.9;
        this.textLabel.height = 44;
        this.textLabel.size = 44;
        this.textLabel.fontFamily = font;
        this.textLabel.text = text;
    }
    /**
     * 设置点击回调
     */
    public setOnTap(callBack: Function) {
        this.callBack = callBack;
    }

    public setSprite(sprite: string){
        this.sprite.texture = RES.getRes(sprite);
    }
}
