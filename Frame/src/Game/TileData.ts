/**
 * 
 * 格子数据
 * 
 */
class TileData {
    /** 位置 */
    public pos: Vector2;
    /** 类型 */
    public type: number;
    /** 之前的位置 */
    public prePos: Vector2;
    /** 之前的类型 */
    public preType: number;
    /** 效果 */
    public effect: number = TileEffect.NONE;
    /** 转换列表 */
    public converArr: Array<Vector2> = [];

    public changeType(type: number) {
        this.preType = this.type;
        this.type = type;
    }

    public clone(): TileData {
        var data = new TileData();
        data.pos = this.pos.clone();
        data.type = this.type;
        data.prePos = this.prePos;
        data.preType = this.preType;
        data.effect = this.effect;
        return data;
    }
}

enum TileEffect {
    NONE = 0,
    HOR = 1,
    VER = 2,
    AREA = 3,
    TYPE = 4,
    CONVERT = 5
}