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
    /** 前一个位置 */
    public prePos: Vector2;
    /** 效果 */
    public effect: number = TileEffect.NONE;

    public clone(): TileData {
        var data = new TileData();
        data.pos = this.pos.clone();
        data.type = this.type;
        data.prePos = this.prePos;
        data.effect = this.effect;
        return data;
    }
}

enum TileEffect {
    NONE = 0,
    HOR = 1,
    VER = 2
}