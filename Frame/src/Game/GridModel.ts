/**
 * 
 * 棋盘
 * 
 */
class GridModel extends BaseModel {
	private _tileList: Array<Array<TileData>>;
	private _hor: number;
	private _ver: number;
	private _state: GridState;
	private _selectArr: Array<TileData>;
	private _addEffectArr: Array<TileEffect>;

	/**
	 * 开始
	 */
	public start() {
		this.setState(GridState.Start);
		this._hor = GameData.hor;
		this._ver = GameData.ver;
		this._selectArr = [];
		this.initTileList();
	}

	/**
	 * 触摸格子
	 */
	public touchTile(pos: Vector2) {
		var tileData = this.getTile(pos.x, pos.y);
		var length = this._selectArr.length;
		if (this.isState(GridState.Idle)) {
			this._selectArr = [tileData];
			this.select(tileData);
			this.setState(GridState.Select);
		} else if (this.isState(GridState.Select) && length) {
			if (tileData.type == this._selectArr[0].type) {
				var idx = this._selectArr.indexOf(tileData);
				var end = this._selectArr[length - 1];
				if (idx < 0 && tileData.pos.borderUpon(end.pos)) {
					this._selectArr.push(tileData);
					this.select(tileData);
				} else if (idx == length - 2) {
					ArrayUtils.remove(this._selectArr, end);
					this.unselect(end)
				}
			}
		}
	}

	/**
	 * 触摸结束
	 */
	public touchEnd() {
		if (this._selectArr.length >= 3) {
			this.remove();
		} else {
			/** 取消 */
			for (let i = 0; i < this._selectArr.length; i++) {
				this.unselect(this._selectArr[i]);
			}
			this.setState(GridState.Idle);
		}
		this._selectArr = [];
	}

	/**
	 * 消除
	 */
	private remove() {
		this.setState(GridState.Remove);
		var removeTime = 0;
		this._addEffectArr = [];
		for (let i = 0; i < this._selectArr.length; i++) {
			let tileData = this._selectArr[i];
			let x = tileData.pos.x;
			let y = tileData.pos.y;
			removeTime = this.delTile(x, y);
		}
		if (this._selectArr.length > 6) {
			this._addEffectArr.push(RandomUtils.limitInteger(1, 5));
		}
		TimerManager.doTimer(removeTime, 1, () => {
			this.repair();
		}, this);
	}

	/**
	 * 修复
	 */
	private repair(): void {
		var removeArr: Array<Array<number>> = [];
		var moveList: Array<MoveInfo> = [];
		for (let x: number = 0; x < this._hor; x++) {
			let temp = [];
			removeArr.push(temp);
			for (let y: number = 0; y < this._ver; y++) {
				if (this._tileList[x][y] == null) {
					temp.push(y);
				}
			}
		}

		for (let x: number = 0; x < removeArr.length; x++) {
			let tmpArr: Array<number> = removeArr[x];
			tmpArr.sort(SortUtils.sortNum);

			for (let i: number = 0; i < tmpArr.length; i++) {
				let tileData = this.addTile(x, i - tmpArr.length);
				moveList.push(this.moveTile(tileData, new Vector2(x, i)));
			}

			for (let y: number = 0; y < this._ver; y++) {
				if (y < tmpArr[0]) {
					moveList.push(this.moveTile(this.getTile(x, y), new Vector2(x, y + tmpArr.length)));
				} else {
					tmpArr.shift();
					if (tmpArr.length == 0) break;
				}
			}
		}

		var moveTime: number = this.getMaxMoveDuration(moveList);
		TimerManager.doTimer(moveTime, 1, () => {
			this.updateMovePosition(moveList);
			this.addEffect();
			this.setState(GridState.Idle);
		}, this);
	}

	/**
	 * 添加效果
	 */
	private addEffect() {
		for (let i = 0; i < this._addEffectArr.length; i++) {
			this.changeRandomTileEffect(TileEffect.NONE, this._addEffectArr[i]);
		}
		this._addEffectArr = [];
	}

	/**
	 * 执行效果
	 */
	private doEffect(tileData: TileData) {
		var x = tileData.pos.x;
		var y = tileData.pos.y;
		var hor = this._hor;
		var ver = this._ver;
		switch (tileData.effect) {
			case TileEffect.HOR:
				for (let i = 0; i < hor; i++) {
					this.delTile(i, y);
				}
				break;
			case TileEffect.VER:
				for (let i = 0; i < ver; i++) {
					this.delTile(x, i);
				}
				break;
			case TileEffect.AREA:
				let minX = Math.max(0, x - 1);
				let maxX = Math.min(hor, x + 2);
				let minY = Math.max(0, y - 1);
				let maxY = Math.min(ver, y + 2);
				for (let i = minX; i < maxX; i++) {
					for (let j = minY; j < maxY; j++) {
						this.delTile(i, j);
					}
				}
				break;
			case TileEffect.TYPE:
				for (let i = 0; i < hor; i++) {
					for (let j = 0; j < hor; j++) {
						var td = this.getTile(i, j);
						if (td && td.type == tileData.type)
							this.delTile(i, j);
					}
				}
				break;
		}
	}

	/**
	 * 初始化格子列表
	 */
	private initTileList(): void {
		this._tileList = [];
		for (var x: number = 0; x < this._hor; x++) {
			var temp = [];
			this._tileList.push(temp);
			for (var y: number = 0; y < this._ver; y++) {
				temp.push(this.addTile(x, y));
			}
		}
	}

	/**
	 * 添加格子
	 */
	private addTile(x: number, y: number): TileData {
		var tileData = new TileData();
		tileData.pos = new Vector2(x, y);
		tileData.type = this.randomType();
		this.creatTile(tileData);
		return tileData;
	}

	/**
	 * 删除格子
	 */
	private delTile(x: number, y: number): number {
		var duration = 300;
		var tileData = this.getTile(x, y);
		if (tileData) {
			this._tileList[x][y] = null;
			this.removeTile(tileData, duration);
			if (tileData.effect != TileEffect.NONE) {
				this.doEffect(tileData);
			}
		}
		return duration;
	}

	/**
	 * 创建格子
	 */
	private creatTile(tileData: TileData): void {
		this.applyFunc(GridCmd.TILE_CREATE, tileData);
	}

	/**
	 * 移除格子
	 */
	private removeTile(tileData: TileData, duration: number): void {
		this.applyFunc(GridCmd.TILE_REMOVE, tileData, duration);
	}

	/**
	 * 选择格子
	 */
	private select(tileData: TileData) {
		this.applyFunc(GridCmd.TILE_SELECT, tileData);

		switch (tileData.effect) {
			case TileEffect.CONVERT:
				let x = tileData.pos.x;
				let y = tileData.pos.y;
				let hor = this._hor;
				let ver = this._ver;
				let type = tileData.type;
				let minX = Math.max(0, x - 1);
				let maxX = Math.min(hor, x + 2);
				let minY = Math.max(0, y - 1);
				let maxY = Math.min(ver, y + 2);
				for (let i = minX; i < maxX; i++) {
					for (let j = minY; j < maxY; j++) {
						if (this.convertTileType(i, j, type)) {
							tileData.converArr.push(new Vector2(i, j));
						}
					}
				}
				break;
		}
	}

	/**
	 * 取消选择格子
	 */
	private unselect(tileData: TileData) {
		this.applyFunc(GridCmd.TILE_UNSELECT, tileData);

		switch (tileData.effect) {
			case TileEffect.CONVERT:
				if (tileData.converArr.length) {
					for (let i = 0; i < tileData.converArr.length; i++) {
						let pos = tileData.converArr[i];
						this.recoveryTileType(pos.x, pos.y);
					}
					tileData.converArr = [];
				}
				break;
		}
	}

	/**
	 * 转化格子的类型
	 */
	private convertTileType(x: number, y: number, type: number): boolean {
		var tileData = this.getTile(x, y);
		if (tileData && tileData.effect == TileEffect.NONE && tileData.type != type) {
			tileData.changeType(type);
			//TODO

			this.applyFunc(GridCmd.TILE_CHANGE_TYPE, tileData);
			return true;
		}
		return false;
	}

	/**
	 * 恢复格子的类型
	 */
	private recoveryTileType(x: number, y: number) {
		var tileData = this.getTile(x, y);
		if (tileData && tileData.effect == TileEffect.NONE && tileData.preType) {
			tileData.changeType(tileData.preType);
			this.applyFunc(GridCmd.TILE_CHANGE_TYPE, tileData);
		}
	}

	/**
	 * 转化随机格子效果
	 */
	private changeRandomTileEffect(effect: TileEffect, targetEffect: TileEffect): void {
		var tileData: TileData = this.getRandomTile();
		while (tileData.effect != effect) {
			tileData = this.getRandomTile();
		}

		tileData.effect = targetEffect;
		this.applyFunc(GridCmd.TILE_CHANGE_EFFECT, tileData);
	}

	/**
	 * 获得随机格子
	 */
	private getRandomTile(): TileData {
		var xRand = RandomUtils.limitInteger(0, this._hor - 1);
		var yRand = RandomUtils.limitInteger(0, this._ver - 1);
		return this._tileList[xRand][yRand];
	}

	/**
	 * 移动格子
	 */
	private moveTile(tileData: TileData, target: Vector2): MoveInfo {
		var duration = this.cacuMoveTime(tileData.pos, target);
		var moveInfo = new MoveInfo(tileData, target, duration);
		this.applyFunc(GridCmd.TILE_MOVE, moveInfo);
		return moveInfo;
	}

	/**
	 * 移动花费的最长时间
	 */
	private getMaxMoveDuration(moveList: Array<MoveInfo>): number {
		var duration = 0;
		for (var i: number = 0; i < moveList.length; i++) {
			duration = Math.max(duration, moveList[i].duration);
		}

		return duration;
	}

	/**
	 * 计算移动时间
	 */
	private cacuMoveTime(src: Vector2, target: Vector2) {
		return Math.abs(src.y - target.y) * 200;
	}

	/**
	* 更新移动后的位置
	*/
	private updateMovePosition(moveList: Array<MoveInfo>): void {
		var moveTileList: Array<TileData> = [];
		for (var i: number = 0; i < moveList.length; i++) {
			moveTileList.push(moveList[i].tileData.clone());
		}

		for (var i: number = 0; i < moveList.length; i++) {
			var moveInfo: MoveInfo = moveList[i];
			moveTileList[i].prePos = moveInfo.tileData.pos.clone();
			moveTileList[i].pos = moveInfo.target.clone();
			this._tileList[moveInfo.target.x][moveInfo.target.y] = moveTileList[i];
		}
	}

	/**
	 * 获取格子数据
	 */
	private getTile(x: number, y: number): TileData {
		return this._tileList[x][y];
	}

	/**
	 * 随机类型
	 */
	private randomType(): number {
		return RandomUtils.limitInteger(1, 4);
	}

	/**
	 * 设置状态
	 */
	private setState(state: GridState) {
		this._state = state;
	}

	/**
	 * 确定状态
	 */
	private isState(state: GridState): boolean {
		return this._state == state;
	}
}

/**
 * 棋盘状态
 */
enum GridState {
	Start,
	Idle,
	Select,
	Remove,
	REPAIR
}