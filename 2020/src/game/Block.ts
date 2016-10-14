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
    private _sprite: egret.Sprite;
    /** 数字 */
    private _text: egret.TextField;
    /** 位置 */
    private _pos: egret.Point;

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
        if (this._sprite) {
            this._sprite.scaleX = this._sprite.scaleY = 1;
        }
    }

    /**
     * 设置方块
     */
    private setBlock() {
        if (!this._sprite) {
            this._sprite = new egret.Sprite;
            this._sprite.name = "方块";
            this.addChild(this._sprite);
            this._sprite.touchEnabled = true;
            this._sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        }
        var sprite: egret.Sprite = this._sprite;
        var size = this.size;
        DrawUtils.drawRoundHexagon(sprite, size, size / 3, this.color);
        sprite.x = size;
        sprite.y = size * Math.sqrt(3) / 2;

        if (!this._text) {
            this._text = new egret.TextField;
            this._text.name = "数字";
            this._sprite.addChild(this._text);
            this._text.size = 40;
            this._text.width = this.width;
            this._text.height = 40;
            this._text.textAlign = "center";
            AnchorUtils.setAnchor(this._text, 0.5);
        }
        if (this._value > 0) {
            this._text.text = this._value.toString();
        }
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
        this._sprite.scaleX = this._sprite.scaleY = 0.2;
        egret.Tween.get(this._sprite).to({ scaleX: 1, scaleY: 1 }, duration, egret.Ease.elasticOut);
  }

    /**
     * 选中
     */
    public select() {
        // if (!this._selectEffect) return;
        // var se = this._selectEffect;
        // egret.Tween.removeTweens(se);
        // se.visible = true;
        // se.scaleX = se.scaleY = 1;
        // se.alpha = 0.6;
        // egret.Tween.get(se).to({ scaleX: 2.5, scaleY: 2.5, alpha: 0.1 }, 400, egret.Ease.sineIn)
        //     .call(() => {
        //         se.visible = false;
        //     });
    }

    /**
     * 消除
     */
    public remove(duration: number) {
        var self = this;
        egret.Tween.get(this._sprite).to({ scaleX: 0.2, scaleY: 0.2 }, duration)
            .call(() => {
                DisplayUtils.removeFromParent(self);
                ObjectPool.push(self);
            });;
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
     * 半径
     */
    public get size(): number {
        return DataManager.BLOCK_SIZE;
    }

    /**
     * 颜色
     */
    public get color(): number {
        return DataManager.getColor(this._value);
    }
}
