/**
 *
 * 数据管理器
 *
 */
class DataManager {
	/** 横向方块个数 */
	public static get HOR_SIZE(): number {
		return 5;
	}

	/** 纵向方块个数 */
	public static get VER_SIZE(): number {
		return 8;
	}

	/** 方块横向间距 */
	public static get BLOCK_W(): number {
		return 84;
	}

	/** 方块纵向间距 */
	public static get BLOCK_H(): number {
		return 95;
	}

	/**
	 * 获取道具价格
	 */
	public static getItemPrice(type: number) {
		switch (type) {
			case 1:
				return 25;
			case 2:
				return 40;
			case 3:
				return 75;
			case 4:
				return 150;
		}
	}
}