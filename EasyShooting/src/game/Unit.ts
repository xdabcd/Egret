/**
 *
 * 单位
 *
 */
class Unit extends egret.DisplayObjectContainer{
    protected _data: UnitData;
    
    public get points(): Array<Array<number>>{
        return this._data.points;
    }
}
