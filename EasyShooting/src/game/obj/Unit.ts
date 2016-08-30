/**
 *
 * 单位
 *
 */
class Unit extends egret.DisplayObjectContainer{
    public constructor() {
        super();
        AnchorUtils.setAnchor(this, 0.5);
    }
    
    /** 单位数据 */
    protected _data: UnitData;
    
    /**
     * 初始化
     */
    public init(id: number) {
        
    }
    
    /**
     * 宽
     */ 
    public get w(): number{
        return this._data.width;
    }
    
    /**
     * 高
     */ 
    public get h(): number{
        return this._data.height;
    }
    
    /**
     * 质量
     */ 
    public get mass(): number{
        return this._data.mass || 0;
    }
    
    /** 物理对象 */
    protected _body: p2.Body;

    /** 
     * 物理对象
     */
    public set body(value: p2.Body){
        this._body = value;
    }
    
    /** 
     * 物理对象
     */
    public get body(): p2.Body{
        return this._body;
    }
}
