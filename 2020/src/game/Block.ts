/**
 *
 * 方块
 *
 */
class Block extends egret.DisplayObjectContainer {
    public constructor() {
        super();
    }

    /** 触摸回调 */
    private _callBack: Function;
    /** 数值 */
    private _value: number;
    /** 方块 */
    private _sprite: egret.Bitmap;
    /** 数字 */
    private _text: egret.TextField;
    /** 位置 */
    private _pos: egret.Point;
    /** 是否选中 */
    private _isSelect: boolean;

    /**
     * 初始化
     */
    public init(value: number) {
        this._value = value;
        this.reset();
        this.setBlock();
    }

    /**
     * 重置
     */
    private reset() {
        if (this) {
            this.scaleX = this.scaleY = 1;
        }
        this.alpha = 1;
        this._isSelect = false;
    }

    /**
     * 设置方块
     */
    private setBlock() {
        if (!this._sprite) {
            this._sprite = new egret.Bitmap;
            this._sprite.name = "方块";
            this.addChild(this._sprite);
            this._sprite.touchEnabled = true;
            this._sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        }

        if (!this._text) {
            this._text = new egret.TextField;
            this._text.name = "数字";
            this._text.fontFamily = "Cookies";
            this._text.size = 45;
            this._text.textAlign = "center";
            this.addChild(this._text);
        }

        this.setSprite();
    }

    /**
     * 点击回调
     */
    private onTap() {
        if (this._callBack) {
            this._callBack();
        }
    }

    /**
     * 设置回调
     */
    public setOnTap(callBack: Function) {
        this._callBack = callBack;
    }

    /**
     * 显示
     */
    public show(duration: number) {
        this.scaleX = this.scaleY = 0.2;
        egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, duration, egret.Ease.elasticOut);
    }

    /**
     * 隐藏
     */
    public hide(duration: number) {
        this.scaleX = this.scaleY = 1;
        egret.Tween.get(this).to({ scaleX: 0.2, scaleY: 0.2 }, duration, egret.Ease.elasticIn);
    }

    /**
     * 选中
     */
    public select() {
        var s = this;
        egret.Tween.removeTweens(s);
        this._isSelect = true;
        this.play();

    }

    /**
     * 取消选中
     */
    public unSelect() {
        var s = this;
        egret.Tween.removeTweens(s);
        s.scaleX = s.scaleY = 1;
    }

    /**
     * 播放选中效果
     */
    private play() {
        if (!this._isSelect) return;
        var s = this;
        if (s.scaleX < 1) {
            let duration = (1 - s.scaleX) * 2000;
            egret.Tween.get(s).to({ scaleX: 1, scaleY: 1 }, duration).call(this.play, this);
        } else {
            let duration = (s.scaleX - 0.9) * 2000;
            egret.Tween.get(s).to({ scaleX: 0.85, scaleY: 0.85 }, duration).call(this.play, this);
        }
    }

    /**
     * 设置图片
     */
    public setSprite() {
        if (this._value == -1) {
            this._sprite.texture = RES.getRes("blank_png");
            this._text.text = "";
        } else {
            this._sprite.texture = RES.getRes("button_" + this._value + "_png");
            this._text.text = Math.pow(2, this._value).toString();
        }
        AnchorUtils.setAnchor(this._sprite, 0.5);
        AnchorUtils.setAnchor(this._text, 0.5);
    }

    /**
     * 位置
     */
    public get pos(): egret.Point {
        return this._pos;
    }

    /**
     * 位置
     */
    public set pos(value) {
        this._pos = value;
    }

    /**
     * 颜色
     */
    public get color(): number {
        return DataManager.getColor(this._value);
    }

    /**
     * 数值
     */
    public get value(): number {
        return this._value;
    }
}
