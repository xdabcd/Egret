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
    /** 位置 */
    private _pos: egret.Point;
    /** 是否选中 */
    private _isSelect: boolean;
    /** 出现效果 */
    private _appear: egret.MovieClip;
    /** 合成效果 */
    private _brust: egret.MovieClip;

    /**
     * 初始化
     */
    public init(value: number) {
        this._value = value;
        this.setBlock();
        this.reset();
    }

    /**
     * 重置
     */
    private reset() {
        if (this) {
            this._sprite.scaleX = this._sprite.scaleY = 1;
            this.alpha = 1;
        }
        this._isSelect = false;
    }

    /**
     * 设置方块
     */
    private setBlock() {
        if (!this._appear) {
            this.addChild(this._appear = EffectManager.getEffect("appear"));
        }

        if (!this._brust) {
            this.addChild(this._brust = EffectManager.getEffect("brust"));
        }

        if (!this._sprite) {
            this._sprite = new egret.Bitmap;
            this._sprite.name = "方块";
            this.addChild(this._sprite);
            this._sprite.touchEnabled = true;
            this._sprite.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        }
        this._appear.visible = false;
        this._brust.visible = false;
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
     * 显示 0:直接出现 1:烟雾出现 2:闪光出现
     */
    public show(duration: number, type: number = 0) {
        var func = (t) => {
            TimerManager.doTimer(t, 1, () => {
                egret.Tween.get(this._sprite).to({ scaleX: 1, scaleY: 1 }, duration - t, egret.Ease.elasticOut);
            }, this);
        }
        this._sprite.scaleX = this._sprite.scaleY = 0;
        if (type == 0) {
            func(0);
            SoundManager.playEffect("upcoming_mp3");
        } else if (type == 1) {
            SoundManager.playEffect("appear_mp3");
            this._appear.visible = true;
            this._appear.gotoAndPlay(0);
            func(120);
        } else if (type == 2) {
            this._brust.visible = true;
            this._brust.gotoAndPlay(0);
            func(0);
        }
    }

    /**
     * 隐藏
     */
    public hide(duration: number) {
        this._sprite.scaleX = this._sprite.scaleY = 1;
        egret.Tween.get(this._sprite).to({ scaleX: 0, scaleY: 0 }, duration, egret.Ease.elasticIn);
    }

    /**
     * 选中
     */
    public select() {
        SoundManager.playEffect("select_mp3");
        var s = this;
        egret.Tween.removeTweens(s);
        this._isSelect = true;
        this.play();
    }

    /**
     * 取消选中
     */
    public unSelect() {
        var s = this._sprite;
        egret.Tween.removeTweens(s);
        s.scaleX = s.scaleY = 1;
    }

    /**
     * 播放选中效果
     */
    private play() {
        if (!this._isSelect) return;
        var s = this._sprite;
        if (s.scaleX < 1) {
            let duration = (1 - s.scaleX) * 3000;
            egret.Tween.get(s).to({ scaleX: 1, scaleY: 1 }, duration).call(this.play, this);
        } else {
            let duration = (s.scaleX - 0.9) * 3000;
            egret.Tween.get(s).to({ scaleX: 0.85, scaleY: 0.85 }, duration).call(this.play, this);
        }
    }

    /**
     * 移向
     */
    public moveTo(x: number, y: number, duration: number, ease = null) {
        egret.Tween.get(this).to({ x: x, y: y }, duration, ease);
    }

    /**
     * 设置图片
     */
    public setSprite() {
        if (this._value == 0) {
            this._sprite.texture = RES.getRes("blank_png");
        } else {
            this._sprite.texture = RES.getRes("cell_" + this._value + "_png");
        }
        AnchorUtils.setAnchor(this._sprite, 0.5);
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
     * 数值
     */
    public get value(): number {
        return this._value;
    }

    public remove() {
        egret.Tween.removeTweens(this);
        egret.Tween.removeTweens(this._sprite);
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}
