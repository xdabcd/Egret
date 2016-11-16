/**
 * 
 * 移动数据
 * 
 */
class MoveInfo {
	public tileData: TileData;
	public target: Vector2;
	public duration: number;
	public constructor(tileData: TileData, targetPos: Vector2, duration?: number) {
		this.tileData = tileData.clone();
		this.target = targetPos;
		this.duration = duration;
	}
}