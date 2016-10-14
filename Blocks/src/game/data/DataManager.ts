/**
 *
 * 数据管理器
 *
 */
class DataManager {
	/** 横向方块个数 */
	public static get HOR_SIZE(): number{
		return 7;
	}

	/** 纵向方块个数 */
	public static get VER_SIZE(): number{
		return 7;
	}

	/** 方块大小 */
	public static get BLOCK_SIZE(): number{
		return 70;
	}

	/** 连接线粗细 */
	public static get LINE_SIZE(): number{
		return 10;
	}

	/** 颜色列表 蓝，红，黄，紫 */
	private static COLOR_ARR: Array<number> = [0x7DC9FD, 0xF45658, 0xFDBF3F, 0xB775D9];
	/** 获取颜色 */
	public static getColor(id: number): number{
		return this.COLOR_ARR[id];
	}
}