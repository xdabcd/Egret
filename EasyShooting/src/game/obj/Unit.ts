/**
 *
 * 单位
 *
 */
class Unit extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        AnchorUtils.setAnchor(this, 0.5);
        this._className = "Unit";
    }

    /** 类名 */
    protected _className: string;
    /** 单位数据 */
    protected _data: UnitData;
    /** 阵营 */
    protected _side: Side;

    /**
     * 初始化
     */
    public init(id: number, ...args: any[]) {

    }

    /**
     * 更新
     */
    public update(t: number) {

    }

    /**
     * 移除
     */
    public remove() {

    }

    /**
     * 摧毁
     */
    public destory() {
        ObjectPool.push(this);
        DisplayUtils.removeFromParent(this);
    }

    /**
     * 阵营
     */
    public get side(): Side {
        return this._side;
    }

    /**
     * 宽
     */
    public get w(): number {
        return this._data.width;
    }

    /**
     * 高
     */
    public get h(): number {
        return this._data.height;
    }

    /**
     * 质量
     */
    public get mass(): number {
        return this._data.mass || 0;
    }

    /** 物理对象 */
    protected _body: p2.Body;

    /** 
     * 物理对象
     */
    public set body(value: p2.Body) {
        this._body = value;
    }

    /** 
     * 物理对象
     */
    public get body(): p2.Body {
        return this._body;
    }

    /**
     * 获取类名
     */
    public get className(): string {
        return this._className;
    }
}

/** 阵营 */
enum Side {
    Hero,
    Enemy,
    Middle
}
