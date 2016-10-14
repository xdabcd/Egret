/**
 *
 * 数据管理器
 *
 */
class DataManager {
	/** 横向方块个数 */
	public static get HOR_SIZE(): number{
		return 5;
	}

	/** 纵向方块个数 */
	public static get VER_SIZE(): number{
		return 8;
	}

	/** 方块半径 */
	public static get BLOCK_SIZE(): number{
		return 40;
	}

	/** 方块半径 */
	public static get BLOCK_GAP(): number{
		return 5;
	}

	/** 颜色列表 0:灰 1:黄 2:蓝 4:紫 8:红 16:绿 32:棕 64:青 128:深蓝*/
	private static COLOR_DIC = {
		0: 0xD7D7D7, 1: 0xFFC107, 2: 0x2196F3, 4: 0x9C27B0, 8: 0xF44336, 16:0x4CAF50, 
		32: 0x795548, 64: 0xCDDC39, 128: 0x3F51B5 
	};

	/** 获取颜色 */
	public static getColor(value: number): number{
		return this.COLOR_DIC[value];
	}
}