/**
 *
 * 格子
 *
 */
class Grid extends egret.DisplayObjectContainer {
    public constructor() {
        super();
    }

    /** 大小 */
    private _size: number;
    /** 值 */
    private _value: number;
    /** 格子 */
    private _sprite: egret.Sprite;
    /** 选中框 */
    private _select: egret.Sprite;

    /**
     * 初始化
     */
    public init(size: number) {
        this._size = size;

        this._sprite = DrawUtils.drawRect(size, size, 0xffffff, 0xaaaaaa, 1);
        this.addChild(this._sprite);

        this._select = DrawUtils.drawRect(size, size, 0xffffff, 0x4eacf2, 1);
        this.addChild(this._select);
        this._select.visible = false;
    }

    /**
     * 设置选中框
     */
    public setSelect(value: number) {
        this._value = value;
        this.removeChild(this._select);
        if (value == 1) {
            this._select = DrawUtils.drawRect(this._size, this._size, 0xffffff, 0x4eacf2, 1);
        } else if (value == 0) {
            this._select = DrawUtils.drawRect(this._size, this._size, 0xffffff, 0xf19ec2, 1);
        }
        this.addChild(this._select);
    }

    /**
     * 选中
     */
    public select() {
        this._select.visible = true;
    }

    /**
     * 取消选中
     */
    public unSelect() {
        this._select.visible = false;
    }

    /**
     * 是否选中
     */
    public get isSelected(): boolean {
        return this._select.visible;
    }

    /**
     * 值
     */
    public get value(): number {
        return this._value;
    }
}
