/**
 *
 * 游戏界面
 *
 */
class GameScene extends BaseScene {

    /** 状态 */
    private _state: GameState;
    /** 方块容器 */
    private _blockCon: egret.DisplayObjectContainer;
    /** 空白容器 */
    private _blankCon: egret.DisplayObjectContainer;
    /** 方块列表 */
    private _blocks: Array<Array<Block>>;
    /** 空白方块列表 */
    private _blankList: Array<Block>;
    /** 下一批要补充的方块 */
    private _nextBlocks: Array<number>;
    /** 当前选中方块 */
    private _curBlock: Block;
    /** 检查列表 */
    private _checkList: Array<Block>;
    /** 消除列表 */
    private _removeList: Array<Array<Block>>;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        this.initBlocks();
    }

    /**
     * 初始化方块
     */
    private initBlocks() {
        this.setState(GameState.Init);
        this._blocks = [];
        this._blankList = [];
        this._removeList = [];
        this._blankCon = new egret.DisplayObjectContainer;
        this._blankCon.name = "空白容器";
        this._blankCon.x = StageUtils.stageW / 2;
        this._blankCon.y = StageUtils.stageH / 2;
        this._blankCon.width = this.b_w * (this.hor - 1) + this.blockSize * 2;
        this._blankCon.height = this.b_h * (this.ver - 1) + this.b_h / 2 + this.blockSize * Math.sqrt(3);
        AnchorUtils.setAnchor(this._blankCon, 0.5);
        this.addChild(this._blankCon);

        this._blockCon = new egret.DisplayObjectContainer;
        this._blockCon.name = "方块容器";
        this._blockCon.x = StageUtils.stageW / 2;
        this._blockCon.y = StageUtils.stageH / 2;
        this._blockCon.width = this.b_w * (this.hor - 1) + this.blockSize * 2;
        this._blockCon.height = this.b_h * (this.ver - 1) + this.b_h / 2 + this.blockSize * Math.sqrt(3);
        AnchorUtils.setAnchor(this._blockCon, 0.5);
        this.addChild(this._blockCon);

        var delay = (x, y) => {
            return y * 200 + x * 50;
        }

        for (let x: number = 0; x < this.hor; x++) {
            this._blocks.push([]);
            for (let y: number = 0; y < this.ver; y++) {
                TimerManager.doTimer(delay(x, y), 1, () => {
                    this.addBlank(x, y);
                }, this);
            }
        }

        /** 补充方块 */
        TimerManager.doTimer(delay(this.hor, this.ver) + 200, 1, () => {
            this._nextBlocks = this.getNextBlocks();
            this.addBlocks();
        }, this);
    }

    /**
     * 补充方块
     */
    private addBlocks() {
        this.setState(GameState.Add);
        this._blankList.sort(SortUtils.random);
        var list = this._nextBlocks;
        var del_blocks = [];
        for (let i: number = 0; i < list.length; i++) {
            TimerManager.doTimer(i * 100, 1, () => {
                let value = list[i];
                let blank = this._blankList.pop();
                del_blocks.push(blank);
                this.addBlock(blank, value);
            }, this);
        }
        TimerManager.doTimer(list.length * 100, 1, () => {
            for (let i: number = 0; i < del_blocks.length; i++) {
                this.removeBlank(del_blocks[i])
            }
            this._nextBlocks = this.getNextBlocks();

        }, 1);
    }

    /**
     * 添加方块
     */
    private addBlock(block: Block, value: number) {
        var b: Block = ObjectPool.pop("Block");
        b.init(value);
        b.x = block.x;
        b.y = block.y;
        this.pushToList(b, block.pos.x, block.pos.y);
        b.show(500);
        b.setOnTap(() => this.tapBlock(b));
    }

    /**
     * 移除方块
     */
    private removeBlock(block: Block) {
        DisplayUtils.removeFromParent(block);
        ObjectPool.push(block);
    }

    /**
     * 添加空白方块
     */
    private addBlank(x: number, y: number) {
        let blank: Block = ObjectPool.pop("Block");
        blank.init(0);
        let t_x = this.b_w * x;
        let t_y = this.b_h / 2 * (2 * y + 1 - x % 2);
        blank.x = t_x;
        blank.y = t_y + this.b_h;
        egret.Tween.get(blank).to({ x: t_x, y: t_y }, 1000, egret.Ease.elasticOut);
        this._blankList.push(blank);
        this.pushToList(blank, x, y);
        blank.setOnTap(() => this.tapBlank(blank));
    }

    /**
     * 移除空白方块
     */
    private removeBlank(blank: Block) {
        DisplayUtils.removeFromParent(blank);
        ObjectPool.push(blank);
    }

    /**
     * 点击方块
     */
    private tapBlock(block: Block) {
        if (this._state != GameState.Idle) return;
        if (this._curBlock) {
            this._curBlock.unSelect();
        }
        this._curBlock = block;
        block.select();
    }

    /**
     * 点击空白
     */
    private tapBlank(blank: Block) {
        if (this._state != GameState.Idle) return;
        if (!this._curBlock) return;
        var cur = this._curBlock;
        this._curBlock = null;
        cur.unSelect();
        var path: Array<Block> = this.getPath(cur, blank);
        if (path.length > 0) {
            var duration: number = 100;
            for (let i: number = 0; i < path.length; i++) {
                let blank = path[i];
                TimerManager.doTimer(duration * i, 1, () => {
                    egret.Tween.get(cur).to({ x: blank.x, y: blank.y }, duration);
                }, this);
                TimerManager.doTimer(duration * i + duration / 2, 1, () => {
                    blank.setColor(cur.color);
                }, this);
                let c = blank.color;
                TimerManager.doTimer(duration * i + duration, 1, () => {
                    blank.setColor(c);
                    if (i == 0) {
                        this.addBlank(cur.pos.x, cur.pos.y);
                    } else if (i == path.length - 1) {
                        this.pushToList(cur, blank.pos.x, blank.pos.y);
                        this.removeBlank(blank);
                        this.setState(GameState.Idle);
                    }
                }, this);
            }
        } else {
            let c = blank.color;
            blank.setColor(0x000000);
            TimerManager.doTimer(500, 1, () => {
                blank.setColor(c);
                this.setState(GameState.Idle);
            }, this);
        }
    }

    /**
     * 获取路径
     */
    private getPath(start: Block, end: Block): Array<Block> {
        var blocks = this._blocks;
        var maze: Array<Array<number>> = [];
        for (let x: number = 0; x < this.hor; x++) {
            let list = [];
            maze.push(list);
            for (let y: number = 0; y < this.ver; y++) {
                if (blocks[x][y].value > 0) {
                    list.push(1);
                } else {
                    list.push(0);
                }
            }
        }
        var point = MazeUtils.findPath(maze, new Point(start.pos.x, start.pos.y),
            new Point(end.pos.x, end.pos.y));
        var arr: Array<Block> = [];
        while (point != null && point.parent != null) {
            arr.push(blocks[point.X][point.Y]);
            point = point.parent;
        }
        arr.reverse();
        return arr;
    }

    /**
     * 放入列表
     */
    private pushToList(block: Block, x: number, y: number) {
        block.pos = new egret.Point(x, y);
        this._blocks[x][y] = block;
        block.name = "方块（" + x + ", " + y + "）";
        if (block.value > 0) {
            this._blockCon.addChild(block);
            this._checkList = [];
            this.check(block);
            if(this._checkList.length >= 4){
                this._removeList.push(this._checkList);
            }
        } else {
            this._blankCon.addChild(block);
        }
    }

    /**
     * 移除
     */
    private remove(arr: Array<Block>) {
        this.setState(GameState.Remove);

        var t = 0;
        for (let i: number = 0; i < arr.length; i++) {
            let block = arr[i];
            if (i == 0) {
                this.removeBlock(block);
            }
            let duration = this.toRemove(block, arr[0]);
            if (duration > t) {
                t = duration;
            }
        }
        TimerManager.doTimer(t, 1, () => {
            this.addBlock(arr[0], arr[0].value * 4);
            this.setState(GameState.Idle);
        }, this);
    }

    /**
     * 移动消除
     */
    private toRemove(block: Block, target: Block): number {
        var path = this.getPath(block, target);
        var duration = path.length * 100;
        for (let i: number = 0; i < path.length; i++) {
            let b = path[i];
            TimerManager.doTimer(duration * i, 1, () => {
                egret.Tween.get(b).to({ x: b.x, y: b.y }, duration);
            }, this);

            TimerManager.doTimer(duration * i + duration, 1, () => {
                if (i == 0) {
                    this.addBlank(b.pos.x, b.pos.y);
                } else if (i == path.length - 1) {
                    this.removeBlock(block);
                }
            }, this);
        }
        return duration;
    }

    /**
     * 检查消除
     */
    private checkRemove() {
        if (this._state != GameState.Idle) return;
        if (this._removeList.length > 0) {
            var arr = this._removeList.shift();
            this.remove(arr);
        }
    }

    /**
     * 检查是否可消除
     */
    private check(block: Block) {
        if (this._checkList.indexOf(block) >= 0) {
            return;
        }
        this._checkList.push(block);
        var blocks = this._blocks;
        var x = block.pos.x;
        var y = block.pos.y;
        var value = block.value;
        for (let i: number = -1; i <= 1; i++) {
            for (let j: number = -1; j <= 1; j++) {
                if (x + i < 0 || x + i >= this.hor || y + j < 0 || y + j >= this.ver) {
                    continue;
                }
                let b = blocks[x + i][y + j];
                if (b.value == value && (i != 0 || j != 0)) {
                    var flag = false;
                    if (x % 2 == 0) {
                        if (i == 0 || j >= 0) {
                            flag = true;
                        }
                    } else {
                        if (i == 0 || j <= 0) {
                            flag = true;
                        }
                    }
                    if (flag) {
                        this.check(b);
                    }
                }
            }
        }

    }

    /**
     * 获取下一批方块
     */
    private getNextBlocks(): Array<number> {
        var arr = [];
        var blankCnt = this._blankList.length;
        var cnt = 0;
        switch (Math.floor(blankCnt / 10)) {
            case 0:
                cnt = 3;
                break;
            case 1:
                cnt = 4;
                break;
            case 2:
                cnt = 5;
                break;
            case 3:
                cnt = 6;
            case 4:
                cnt = 11;
                break;
        }
        for (let i: number = 0; i < cnt; i++) {
            arr.push(Math.pow(2, RandomUtils.limitInteger(0, 3)));
        }
        return arr;
    }

    /**
     * 设置状态
     */
    private setState(state: GameState) {
        this._state = state;
        if (state == GameState.Idle) {
            this.checkRemove();
        }
    }

    /** 横向个数 */
    public get hor(): number {
        return DataManager.HOR_SIZE;
    }

    /** 纵向个数 */
    public get ver(): number {
        return DataManager.VER_SIZE;
    }

    /** 宽 */
    public get b_w(): number {
        return this.blockSize * 1.5 + this.blockGap / (Math.sqrt(3) / 2);
    }

    /** 宽 */
    public get b_h(): number {
        return this.blockSize * Math.sqrt(3) + this.blockGap;
    }

    /** 方块半径 */
    public get blockSize(): number {
        return DataManager.BLOCK_SIZE;
    }

    /** 方块间距 */
    public get blockGap(): number {
        return DataManager.BLOCK_GAP;
    }
}

/**
 * 游戏状态
 */
enum GameState {
    /** 闲置（待操作） */
    Idle,
    /** 初始化 */
    Init,
    /** 补充方块 */
    Add,
    /** 消除方块 */
    Remove,
    /** 方块移动 */
    Move
}