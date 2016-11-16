/**
 * 
 * 数据配置
 * 
 */
class GameData {
	/** 横向大小 */
	public static get hor(): number {
		return 7;
	}

	/** 纵向个数 */
	public static get ver(): number {
		return 7;
	}

	/** 格子大小 */
	public static get tileSize(): number {
		return 80;
	}

	/** 
	 * 获取格子颜色 (1: 2: 3: 4: )
	 */
	public static getTileColor(type: number): number {
		var arr = [0x7DC9FD, 0xF45658, 0xFDBF3F, 0xB775D9];
		return arr[type - 1];
	}
}