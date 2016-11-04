/**
 *
 * 游戏界面
 *
 */
class GameScene extends BaseScene {
    /** 背景 */
    private _bg: egret.Bitmap;
    /** UI */
    private _ui: GameUI;
    /** 状态 */
    private _state: GameState;
    /** 返回闲置所需时间 */
    private _idleTime = 200;
    /** 单步位移时间 */
    private _perMoveTime = 100;
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
    /** 移动标志 */
    private _moveFlag: boolean;
    /** 当前道具 */
    private _curItem: number;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        this.reset();
        this.initBlocks();
    }

    /**
     * 初始化方块
     */
    private initBlocks() {
        this.setState(GameState.Init);

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
     * 重置
     */
    private reset() {
        this._blocks = [];
        this._blankList = [];
        this._removeList = [];
        this._moveFlag = false;
        this._curItem = 0;
        var w = StageUtils.stageW;
        var h = StageUtils.stageH;
        if (!this._bg) {
            this.addChild(this._bg = DisplayUtils.createBitmap("bg_png"));
            this._bg.width = w;
            this._bg.height = h;
        }
        if (!this._blankCon) {
            this._blankCon = new egret.DisplayObjectContainer;
            this._blankCon.name = "空白容器";
            this._blankCon.x = w / 2;
            this._blankCon.y = h / 2 + 80;
            this._blankCon.width = this.hor * DataManager.BLOCK_W;
            this._blankCon.height = (this.ver + 0.5) * DataManager.BLOCK_H;
            this.addChild(this._blankCon);
        }
        if (!this._blockCon) {
            this._blockCon = new egret.DisplayObjectContainer;
            this._blockCon.name = "方块容器";
            this._blockCon.x = w / 2;
            this._blockCon.y = h / 2 + 80;
            this._blockCon.width = this.hor * DataManager.BLOCK_W;
            this._blockCon.height = (this.ver + 0.5) * DataManager.BLOCK_H;
            this.addChild(this._blockCon);
        }
        if (!this._ui) {
            this._ui = new GameUI();
            this.addChild(this._ui);
        }
    }

    /**
     * 重新开始
     */
    public restart() {
        if (this._state != GameState.Idle && this._state != GameState.End) return;
        this._ui.clearBlocks();
        var delay = (x, y) => {
            return (this.ver - y) * 200 + (this.hor - x) * 50 + 300;
        }
        for (let x: number = 0; x < this.hor; x++) {
            for (let y: number = 0; y < this.ver; y++) {
                TimerManager.doTimer(delay(x, y), 1, () => {
                    let block = this._blocks[x][y];
                    egret.Tween.get(block).to({ alpha: 0.3 }, 100).call(() => {
                        if (block.value >= 0) {
                            this.removeBlock(block);
                        } else {
                            this.removeBlank(block);
                        }
                    })
                }, this);
            }
        }
        TimerManager.doTimer(delay(0, 0) + 500, 1, this.init, this);
    }

    /**
     * 使用道具
     */
    public useItem(idx: number) {
        if (this._state != GameState.Idle) return;
        this.setState(GameState.Item);
        this._curItem = idx;
        if (idx == 2 || idx == 4) {
            this._ui.showHint("选择一个六边形");
        } else {
            this.itemEffect();
        }
    }

    /**
     * 道具效果
     */
    private itemEffect(block: Block = null) {
        switch (this._curItem) {
            case 1:
                this._ui.removeBlocks(-1);
                TimerManager.doTimer(500, 1, () => {
                    this._nextBlocks = this.getNextBlocks();
                    this._ui.setBlocks(this._nextBlocks);
                }, this);
                TimerManager.doTimer(1000, 1, () => {
                    this.setState(GameState.Idle);
                }, this);
                break;
            case 2:
                this._ui.hideHint();
                this.delBlock(block, 600);
                TimerManager.doTimer(1000, 1, () => this.setState(GameState.Idle), this);
                break;
            case 3:
                var arr = [];
                this._blocks.forEach(bs => {
                    bs.forEach(b => {
                        if (b.value >= 0) {
                            arr.push(b);
                        }
                    });
                });
                arr.sort(SortUtils.random);
                var duration = 600;
                var t = 0;
                for (let i = 0; i < 5; i++) {
                    if (arr.length > 0) {
                        let b = arr.pop();
                        TimerManager.doTimer(t, 1, () => {
                            this.delBlock(b, duration);
                        }, this);
                        t += this._perMoveTime;
                    }
                }
                TimerManager.doTimer(t + duration + 200, 1, () => {
                    this.setState(GameState.Idle);
                }, this);
                break;
            case 4:
                this._ui.hideHint();
                var duration = 600;
                var t = 0;
                this._blocks.forEach(bs => {
                    bs.forEach(b => {
                        if (b.value == block.value) {
                            TimerManager.doTimer(t, 1, () => {
                                this.delBlock(b, duration);
                            }, this);
                            t += this._perMoveTime;
                        }
                    });
                });
                TimerManager.doTimer(t + duration + 200, 1, () => {
                    this.setState(GameState.Idle);
                }, this);
                break;
        }
    }

    /**
     * 补充方块
     */
    private addBlocks() {
        this.setState(GameState.Add);
        this._ui.removeBlocks();
        this._blankList.sort(SortUtils.random);
        var list = this._nextBlocks;
        var del_blocks: Array<Block> = [];
        for (let i: number = 0; i < list.length; i++) {
            TimerManager.doTimer(i * this._perMoveTime, 1, () => {
                let value = list[i];
                let blank = this._blankList.pop();
                del_blocks.push(blank);
                this.addBlock(blank.pos.x, blank.pos.y, value);
            }, this);
        }
        TimerManager.doTimer(list.length * this._perMoveTime, 1, () => {
            for (let i: number = 0; i < del_blocks.length; i++) {
                this.removeBlank(del_blocks[i]);
            }
            this._nextBlocks = this.getNextBlocks();
            this._ui.setBlocks(this._nextBlocks);
            TimerManager.doTimer(this._idleTime, 1, () => {
                this.setState(GameState.Idle);
            }, this);
        }, this);
    }

    /**
     * 添加方块
     */
    private addBlock(x: number, y: number, value: number) {
        var b: Block = ObjectPool.pop("Block");
        b.init(value);
        var postion = this.getPosition(x, y);
        b.x = postion.x;
        b.y = postion.y;
        this.pushToList(b, x, y);
        b.show(600);
        b.setOnTap(() => this.tapBlock(b));
    }

    /**
     * 移除方块
     */
    private removeBlock(block: Block) {
        egret.Tween.removeTweens(block);
        DisplayUtils.removeFromParent(block);
        ObjectPool.push(block);
    }

    /**
     * 添加空白方块
     */
    private addBlank(x: number, y: number) {
        let blank: Block = ObjectPool.pop("Block");
        blank.init(-1);
        var position = this.getPosition(x, y);
        blank.x = position.x;
        blank.y = position.y + DataManager.BLOCK_H;
        egret.Tween.get(blank).to({ x: position.x, y: position.y }, 1000, egret.Ease.elasticOut);
        this._blankList.push(blank);
        this.pushToList(blank, x, y);
        blank.setOnTap(() => this.tapBlank(blank));
    }

    /**
     * 移除空白方块
     */
    private removeBlank(blank: Block) {
        egret.Tween.removeTweens(blank);
        DisplayUtils.removeFromParent(blank);
        ObjectPool.push(blank);
    }

    /**
     * 删除方块
     */
    private delBlock(block: Block, duration: number) {
        block.hide(duration);
        TimerManager.doTimer(duration + 100, 1, () => {
            this.removeBlock(block);
            this.addBlank(block.pos.x, block.pos.y);
        }, this);
    }

    /**
     * 点击方块
     */
    private tapBlock(block: Block) {
        if (this._state == GameState.Item) {
            if (this._curItem == 2 || this._curItem == 4) {
                this.itemEffect(block);
            }
            return;
        }
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
        var path: Array<egret.Point> = this.getPath(cur.pos, blank.pos);
        if (path.length > 0) {
            var duration: number = this._perMoveTime;
            for (let i: number = 0; i < path.length; i++) {
                let blank = this._blocks[path[i].x][path[i].y];
                TimerManager.doTimer(duration * i, 1, () => {
                    egret.Tween.get(cur).to({ x: blank.x, y: blank.y }, duration);
                }, this);
                let c = blank.color;
            }
            TimerManager.doTimer(duration, 1, () => {
                this.addBlank(cur.pos.x, cur.pos.y);
            }, this);
            TimerManager.doTimer(duration * path.length, 1, () => {
                this.pushToList(cur, blank.pos.x, blank.pos.y);
                ArrayUtils.remove(this._blankList, blank);
                this.removeBlank(blank);
                this._moveFlag = true;
                TimerManager.doTimer(this._idleTime, 1, () => {
                    this.setState(GameState.Idle);
                }, this);
            }, this);
        } else {
            let c = blank.color;
            TimerManager.doTimer(this._idleTime, 1, () => {
                this.setState(GameState.Idle);
            }, this);
        }
    }

    /**
     * 获取路径
     */
    private getPath(start: egret.Point, end: egret.Point, value: number = -1): Array<egret.Point> {
        var blocks = this._blocks;
        var maze: Array<Array<number>> = [];
        for (let x: number = 0; x < this.hor; x++) {
            let list = [];
            maze.push(list);
            for (let y: number = 0; y < this.ver; y++) {
                if (blocks[x][y].value != value) {
                    list.push(1);
                } else {
                    list.push(0);
                }
            }
        }
        var point = MazeUtils.findPath(maze, new Point(start.x, start.y),
            new Point(end.x, end.y));
        var arr: Array<egret.Point> = [];
        while (point != null && point.parent != null) {
            arr.push(new egret.Point(point.X, point.Y));
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
        if (block.value >= 0) {
            this._blockCon.addChild(block);
            this._checkList = [];
            this.check(block);
            if (this._checkList.length >= 4) {
                var arr: Array<Block> = [];
                this._checkList.forEach(b => {
                    arr.push(b);
                });

                for (let i: number = 0; i < this._removeList.length; i++) {
                    for (let j: number = 0; j < arr.length; j++) {
                        if (this._removeList[i].indexOf(arr[j]) >= 0) {
                            ArrayUtils.remove(this._removeList, this._removeList[i]);
                            break;
                        }
                    }
                }
                this._removeList.push(arr);
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
        var pos = arr[0].pos;
        var value = arr[0].value;
        for (let i: number = 0; i < arr.length; i++) {
            let block = arr[i];
            if (i == 0) {
                this.removeBlock(block);
            } else {
                let duration = this.toRemove(block, pos);
                if (duration > t) {
                    t = duration;
                }
            }
        }
        TimerManager.doTimer(t + 200, 1, () => {
            this.addBlock(pos.x, pos.y, value * 2);
            TimerManager.doTimer(this._idleTime, 1, () => {
                this.setState(GameState.Idle);
            }, this);
        }, this);
    }

    /**
     * 移动消除
     */
    private toRemove(block: Block, target: egret.Point): number {
        var path = this.getPath(block.pos, target, block.value);
        var duration = this._perMoveTime;
        for (let i: number = 0; i < path.length; i++) {
            let position = this.getPosition(path[i].x, path[i].y);
            TimerManager.doTimer(duration * i, 1, () => {
                egret.Tween.get(block).to({ x: position.x, y: position.y }, duration);
            }, this);
        }
        TimerManager.doTimer(duration, 1, () => {
            this.addBlank(block.pos.x, block.pos.y);
        }, this);
        TimerManager.doTimer(duration * path.length, 1, () => {
            this.removeBlock(block);
        }, this);

        return duration * path.length;
    }

    /**
     * 检查消除
     */
    private checkRemove(): boolean {
        if (this._state != GameState.Idle) return false;
        if (this._removeList.length > 0) {
            var arr = this._removeList.shift();
            this.remove(arr);
            return true;
        }
        return false;
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
        if (blankCnt >= this.ver * this.hor) {
            cnt = 11;
        } else if (blankCnt >= 20) {
            cnt = 5;
        } else if (blankCnt > 5) {
            cnt = 4;
        } else {
            cnt = Math.min(blankCnt, 3);
        }
        if (cnt == 0) {
            this.setState(GameState.End);
            this._ui.end();
        }
        for (let i: number = 0; i < cnt; i++) {
            arr.push(RandomUtils.limitInteger(0, 3));
        }
        return arr;
    }

    /**
     * 设置状态
     */
    private setState(state: GameState) {
        this._state = state;
        if (state == GameState.Idle) {
            this._curItem = 0;
            if ((!this.checkRemove() && this._moveFlag) || this._blankList.length == this.ver * this.hor) {
                this.addBlocks();
            }
            this._moveFlag = false;
        }
    }

    /**
     * 根据坐标获取位置
     */
    private getPosition(x, y): egret.Point {
        var position = new egret.Point;
        position.x = (x - DataManager.HOR_SIZE / 2 + 0.5) * DataManager.BLOCK_W;
        position.y = (y - DataManager.VER_SIZE / 2 + (x % 2 == 0 ? 0.5 : 0)) * DataManager.BLOCK_H;
        return position;
    }

    /** 横向个数 */
    public get hor(): number {
        return DataManager.HOR_SIZE;
    }

    /** 纵向个数 */
    public get ver(): number {
        return DataManager.VER_SIZE;
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
    Move,
    /** 结束 */
    End,
    /** 使用道具 */
    Item
}