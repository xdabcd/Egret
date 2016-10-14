/**
 *
 * 方块
 *
 */
class Block extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.width = this.height = this.size;
        this.addTouch();
    }

    /** 触摸回调 */
    private _callBack: Function;
    /** 数据 */
    private _data: BlockData;
    /** 触摸区域 */
    private _touch: egret.Sprite;
    /** 方块 */
    private _sprite: egret.Sprite;
    /** 选中效果 */
    private _selectEffect: egret.Sprite;
    /** 位置 */
    private _pos: egret.Point;

    /**
     * 初始化
     */
    public init(data: BlockData) {
        this._data = data;
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
     * 添加触摸区域
     */
    private addTouch() {
        var size = this.size;
        var s = size * 6 / 7;
        var touch = new egret.Sprite;
        touch.name = "触摸区域";
        DrawUtils.drawRect(touch, s, s, 0xffffff);
        touch.alpha = 0;
        touch.x = size / 2;
        touch.y = size / 2;
        AnchorUtils.setAnchor(touch, 0.5);
        this.addChild(touch);
        touch.touchEnabled = true;
        touch.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        touch.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouch, this);
        this._touch = touch;
    }

    /**
     * 设置方块
     */
    private setBlock() {
        if (!this._sprite) {
            this._sprite = new egret.Sprite;
            this._sprite.name = "方块";
            this.addChild(this._sprite);
        }
        var sprite: egret.Sprite = this._sprite;
        var size = this.size;
        var s = size * 3 / 7;
        switch (this._data.type) {
            case BlockType.Normal:
                DrawUtils.drawRoundRect(sprite, s, s, s / 3, s / 3, this.color);

                if (!this._selectEffect) {
                    this._selectEffect = new egret.Sprite;
                    this._selectEffect.name = "选中效果";
                    this.addChild(this._selectEffect);
                }
                var se = this._selectEffect;
                DrawUtils.drawRoundRect(se, s, s, s / 3, s / 3, this.color);
                se.x = size / 2;
                se.y = size / 2;
                se.visible = false;
                AnchorUtils.setAnchor(se, 0.5);
                break;
            default:
                break;
        }

        sprite.x = size / 2;
        sprite.y = size / 2;
        AnchorUtils.setAnchor(sprite, 0.5);
    }

    /**
     * 触摸回调
     */
    private onTouch() {
        if (this._callBack) {
            this._callBack();
        }
    }

    /**
     * 设置回调
     */
    public setOnTouch(callBack: Function) {
        this._callBack = callBack;
    }

    /**
     * 选中
     */
    public select() {
        if (!this._selectEffect) return;
        var se = this._selectEffect;
        egret.Tween.removeTweens(se);
        se.visible = true;
        se.scaleX = se.scaleY = 1;
        se.alpha = 0.6;
        egret.Tween.get(se).to({ scaleX: 2.5, scaleY: 2.5, alpha: 0.1 }, 400, egret.Ease.sineIn)
            .call(() => {
                se.visible = false;
            });
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
     * 大小
     */
    public get size(): number {
        return DataManager.BLOCK_SIZE;
    }

    /**
     * 颜色
     */
    public get color(): number {
        return DataManager.getColor(this._data.id);
    }
}
