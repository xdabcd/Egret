/**
 * 
 * 棋盘控制器
 * 
 */
class GridController extends BaseController {
	public constructor(scene: Grid) {
		super(scene);
		this._model = new GridModel(this);
		ControllerManager.instance.register(ControllerID.Grid, this);

		/** V->M */
		this.registerFunc(GameCmd.GAME_START, this.start, this);
		this.registerFunc(GridCmd.TOUCH_TILE, this.touchTile, this);
		this.registerFunc(GridCmd.TOUCH_END, this.touchEnd, this);

		/** M->V */
		this.registerFunc(GridCmd.TILE_CREATE, this.createTile, this);
		this.registerFunc(GridCmd.TILE_REMOVE, this.removeTile, this);
		this.registerFunc(GridCmd.TILE_SELECT, this.selectTile, this);
		this.registerFunc(GridCmd.TILE_UNSELECT, this.unselectTile, this);
		this.registerFunc(GridCmd.TILE_MOVE, this.moveTile, this);
		this.registerFunc(GridCmd.TILE_CHANGE_EFFECT, this.changeTileEffect, this);
		this.registerFunc(GridCmd.TILE_CHANGE_TYPE, this.changeTileType, this);
	}

	/**
	 * 开始
	 */
	private start() {
		this.model.start();
	}

	/**
	 * 点击格子
	 */
	private touchTile(pos: Vector2) {
		this.model.touchTile(pos);
	}

	/**
	 * 触摸结束
	 */
	private touchEnd() {
		this.model.touchEnd();
	}

	/**
	 * 创建格子
	 */
	private createTile(tileData: TileData) {
		this.scene.createTile(tileData);
	}

	/**
	 * 移除格子
	 */
	private removeTile(tileData: TileData, duration: number) {
		this.scene.removeTile(tileData, duration);
	}

	/**
	 * 选中格子
	 */
	private selectTile(tileData: TileData) {
		this.scene.selectTile(tileData);
	}

	/**
	 * 取消选中格子
	 */
	private unselectTile(tileData: TileData) {
		this.scene.unselectTile(tileData);
	}

	/**
	 * 移动格子
	 */
	private moveTile(moveInfo: MoveInfo) {
		this.scene.moveTile(moveInfo);
	}

	/**
	 * 转换格子效果
	 */
	private changeTileEffect(tileData: TileData) {
		this.scene.changeTileEffect(tileData);
	}

	/**
	 * 转换格子类型
	 */
	private changeTileType(tileData: TileData) {
		this.scene.changeTileType(tileData);
	}

	/**
	 * 数据
	 */
	private get model(): GridModel {
		return this._model as GridModel;
	}

	/**
	 * 界面
	 */
	private get scene(): Grid {
		return this._scene as Grid;
	}
}