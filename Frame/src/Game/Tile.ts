/**
 *
 * 格子
 *
 */
class Tile extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.addChild(this._sprite = new egret.Sprite);
        this.addChild(this._selectEffect = new egret.Sprite);
        this.addChild(this._effectSprte = new egret.Sprite);
        this.width = this.height = this.size;
        this.addTouch();
    }

    /** 触摸回调 */
    private _callBack: Function;
    /** 触摸区域 */
    private _touch: egret.Sprite;
    /** 图标 */
    private _sprite: egret.Sprite;
    /** 效果图标 */
    private _effectSprte: egret.Sprite;
    /** 选中效果 */
    private _selectEffect: egret.Sprite;
    /** 位置 */
    private _pos: Vector2;
    /** 类型 */
    private _type: number;
    /** 效果 */
    private _effect: TileEffect;

    /**
     * 重置
     */
    public reset() {
        this._sprite.scaleX = this._sprite.scaleY = 1;
        this._sprite.alpha = 1;
        this._effectSprte.scaleX = this._effectSprte.scaleY = 1;
        this._effectSprte.alpha = 1;
        this._selectEffect.visible = false;
    }

    /**
     * 添加触摸区域
     */
    private addTouch() {
        var size = this.size;
        var s = size * 6 / 7;
        var touch = new egret.Sprite;
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
        var se = this._selectEffect;
        egret.Tween.removeTweens(se);
        se.visible = true;
        se.scaleX = se.scaleY = 1;
        se.alpha = 0.6;
        egret.Tween.get(se).to({ scaleX: 2.5, scaleY: 2.5, alpha: 0.1 }, 400, egret.Ease.sineIn)
            .call(() => {
                se.visible = false;
            });
        var s = this._sprite;
        egret.Tween.get(s).to({ scaleX: 1.5, scaleY: 1.5, alpha: 0.5 }, 200);
    }

	/**
     * 取消选中
     */
    public unselect() {
        var s = this._sprite;
        egret.Tween.get(s).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200);
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
        switch (this._effect) {
            case TileEffect.HOR:
                egret.Tween.get(this._effectSprte).to({ scaleX: 80, scaleY: 3, alpha: 0.6 }, duration / 2)
                    .to({ scaleY: 1, alpha: 0.3 }, duration / 2);
                break;
            case TileEffect.VER:
                egret.Tween.get(this._effectSprte).to({ scaleX: 3, scaleY: 80, alpha: 0.6 }, duration / 2)
                    .to({ scaleX: 1, alpha: 0.3 }, duration / 2);
                break;
            case TileEffect.AREA:
                break;
            case TileEffect.TYPE:
                break;
        }
    }

	/**
	 * 移动
	 */
    public moveTo(targetPos: Vector2, duration: number, callBack: Function = null) {
        egret.Tween.get(this).to({ x: targetPos.x, y: targetPos.y }, duration, egret.Ease.elasticOut)
            .call(() => {
                if (callBack) {
                    callBack();
                }
            });
    }

	/**
	 * 设置类型
	 */
    public set type(value: number) {
        this._type = value;

        var sprite: egret.Sprite = this._sprite;
        var size = this.size;
        var s = size * 3 / 7;
        DrawUtils.drawRoundRect(sprite, s, s, s / 3, s / 3, this.color);

        var se = this._selectEffect;
        DrawUtils.drawRoundRect(se, s, s, s / 3, s / 3, this.color);
        se.x = size / 2;
        se.y = size / 2;
        se.visible = false;
        AnchorUtils.setAnchor(se, 0.5);

        sprite.x = size / 2;
        sprite.y = size / 2;
        AnchorUtils.setAnchor(sprite, 0.5);
    }

    /**
     * 设置效果
     */
    public set effect(value: TileEffect) {
        this._effect = value;
        var e = this._effectSprte;
        var s = this.size;

        switch (this._effect) {
            case TileEffect.NONE:
                e.graphics.clear();
                break;
            case TileEffect.HOR:
                DrawUtils.drawRoundRect(e, s / 4, s / 15, s / 20, s / 20, 0x000000);
                break;
            case TileEffect.VER:
                DrawUtils.drawRoundRect(e, s / 15, s / 4, s / 20, s / 20, 0x000000);
                break;
            case TileEffect.AREA:
                DrawUtils.drawHollowRect(e, s / 6, s / 6, s / 15, 0x000000);
                break;
            case TileEffect.TYPE:
                DrawUtils.drawRoundRect(e, s / 6, s / 6, s / 6, s / 6, 0x000000);
                break;
            case TileEffect.CONVERT:
                DrawUtils.drawMi(e, s / 6, s / 40, 0x000000);
                break;
        }
        e.x = s / 2;
        e.y = s / 2;
        AnchorUtils.setAnchor(e, 0.5);
    }

	/**
	 * 获取位置
	 */
    public get pos(): Vector2 {
        return this._pos;
    }

    /**
	 * 设置位置
	 */
    public set pos(value: Vector2) {
        this._pos = value;
    }

    /**
     * 大小
     */
    public get size(): number {
        return GameData.tileSize;
    }

    /**
     * 颜色
     */
    public get color(): number {
        return GameData.getTileColor(this._type);
    }
}