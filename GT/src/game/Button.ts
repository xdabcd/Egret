/**
 *
 * 按钮
 *
 */
class Button extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        AnchorUtils.setAnchor(this, 0.5);
    }

    /** 框 */
    private _sprite: egret.Sprite;
    /** 选中框 */
    private _select: egret.Sprite;
    /** 文字 */
    private _text: egret.TextField;

    /**
     * 初始化
     */
    public init(text: string, width: number, height: number) {
        this._sprite = DrawUtils.drawRect(width, height, 0xffffff, 0xaaaaaa, 0.5);
        this.addChild(this._sprite);

        this._select = DrawUtils.drawRect(width, height, 0xffffff, 0xaaaaaa, 1);
        this.addChild(this._select);
        this._select.visible = false;

        this._text = new egret.TextField;
        this._text.width = width;
        this._text.y = height / 2 - 17;
        this._text.textAlign = "center";
        this._text.text = text;
        this.addChild(this._text);

        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touch, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.unTouch, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.unTouch, this);
    }

    /**
     * 触摸
     */
    private touch(){
        this._select.visible = true;
    }

    /**
     * 取消触摸
     */
    private unTouch(){
        this._select.visible = false;
    }
}
