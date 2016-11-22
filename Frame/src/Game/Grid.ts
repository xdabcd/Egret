/**
 * 
 * 棋盘
 * 
 */
class Grid extends BaseScene {
	private _size: number = 560;
	private _tileCon: egret.DisplayObjectContainer;

	public constructor() {
        super();
        this._controller = new GridController(this);
    }

    /**
     * 初始化
     */
    protected init() {
		super.init();
        this.addChild(this._tileCon = new egret.DisplayObjectContainer);

		this.width = this.height = this._size;
		AnchorUtils.setAnchor(this, 0.5);

        StageUtils.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        StageUtils.stage.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
    }

	/**
	 * 创建格子
	 */
	public createTile(tileData: TileData) {
		var pos = tileData.pos;
		var tile = ObjectPool.pop("Tile") as Tile;
		tile.reset();
		tile.pos = pos.clone();
		var tp: Vector2 = this.getTruePosition(pos.x, pos.y);
		tile.x = tp.x;
		tile.y = tp.y;
		tile.type = tileData.type;
		tile.effect = tileData.effect;
		tile.touchEnabled = true;
		this._tileCon.addChild(tile);
		tile.setOnTouch(() => { this.tileOnTouch(tile.pos); });
	}

	/**
	 * 移除格子
	 */
	public removeTile(tileData: TileData, duration: number) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			tile.remove(duration);
		}
	}

	/**
	 * 选中格子
	 */
	public selectTile(tileData: TileData) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			tile.select();
		}
	}

	/**
	 * 取消选中格子
	 */
	public unselectTile(tileData: TileData) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			tile.unselect();
		}
	}

	/**
	 * 移动格子
	 */
	public moveTile(moveInfo: MoveInfo) {
		var tileData = moveInfo.tileData;
		var target = moveInfo.target;
		var duration = moveInfo.duration;
		var tile = this.findTile(tileData.pos);
		if (tile) {
			var targetPos = this.getTruePosition(target.x, target.y);
			tile.moveTo(targetPos, duration, () => {
				tile.pos = target.clone();
			});
		}
	}

	/**
	 * 改变格子效果
	 */
	public changeTileEffect(tileData: TileData) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			tile.effect = tileData.effect;
		}
	}

	/**
	 * 改变格子效果
	 */
	public changeTileType(tileData: TileData) {
		var tile = this.findTile(tileData.pos);
		if (tile) {
			tile.type = tileData.type;
		}
	}

	/**
	 * 格子触摸回调
	 */
	private tileOnTouch(pos: Vector2) {
		this.applyFunc(GridCmd.TOUCH_TILE, pos);
	}

	/**
     * 触摸结束回调
     */
    private onEnd(event: egret.Event) {
		this.applyFunc(GridCmd.TOUCH_END);
    }

	/**
	 * 找到对应位置的格子
	 */
	private findTile(pos): Tile {
		for (let i = 0; i < this._tileCon.numChildren; i++) {
			var tile = this._tileCon.getChildAt(i) as Tile;
			if (tile.pos.equalTo(pos)) {
				return tile;
			}
		}
		return;
	}

	/**
	 * 获取格子的真实位置
	 */
	private getTruePosition(x: number, y: number) {
		var x: number = x * this._size / this.hor;
		var y: number = y * this._size / this.ver;
		return new Vector2(x, y);
	}

	private get hor(): number {
		return GameData.hor;
	}

	private get ver(): number {
		return GameData.ver;
	}
}