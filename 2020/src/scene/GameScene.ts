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
    /** 弹出提示 */
    private _popHint: PopHint;
    /** 暂停界面 */
    private _pauseScene: PauseScene;
    /** 状态 */
    private _state: GameState;
    /** 返回闲置所需时间 */
    private _idleTime = 80;
    /** 添加方块时间 */
    private _addTime = 800;
    /** 单步位移时间 */
    private _perMoveTime = 80;
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
    private _checkList: Array<egret.Point>;
    /** 消除列表 */
    private _removeList: Array<Array<Block>>;
    /** 移动标志 */
    private _moveFlag: boolean;
    /** 当前道具 */
    private _curItem: number;
    /** 引导步骤 */
    private _tutorialStep: number;
    /** 引导数据 */
    private _tutorialArr: Array<any>;
    /** 引导 */
    private _tutorialHand: TutorialHand;
    /** 移动 */
    private _moveArr: Array<egret.Point>;
    /** 手 */
    private _hand: Hand;
    /** 手的间隔 */
    private _handInterval: number;
    /** 阻止提示 */
    private _forbidHint: ForbidHint;
    /** 称赞 */
    private _praise: Praise;
    /** 额外奖励提示 */
    private _extra: Praise;
    /** 轨迹 */
    private _orbit: Orbit;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        this.reset();
        this.onResize();
        this.initBlocks();
    }

    /**
     * 更新
     */
    protected update(time: number) {
        if (this._tutorialStep <= 0 && this._state == GameState.Idle) {
            if (this._moveArr.length == 0) return;
            this._handInterval -= time;
            if (this._handInterval <= 0) {
                var p1 = this._blocks[this._moveArr[0].x][this._moveArr[0].y];
                var p2 = this._blocks[this._moveArr[1].x][this._moveArr[1].y];
                var t = this._hand.show(new egret.Point(p1.x + this._blockCon.x, p1.y + this._blockCon.y),
                    new egret.Point(p2.x + this._blockCon.x, p2.y + this._blockCon.y));
                this._handInterval = 2000 + t;
            }
        }
    }

    /**
     * 重置
     */
    private reset() {
        PlayerDataManager.reset();

        if (!this._bg) {
            this.addChild(this._bg = DisplayUtils.createBitmap("bg_png"));
        }
        if (!this._blankCon) {
            this._blankCon = new egret.DisplayObjectContainer;
            this._blankCon.name = "空白容器";
            this._blankCon.width = this.hor * DataManager.BLOCK_W;
            this._blankCon.height = (this.ver + 0.5) * DataManager.BLOCK_H;
            this.addChild(this._blankCon);
        }

        if (!this._orbit) {
            this.addChild(this._orbit = new Orbit);
        }

        if (!this._blockCon) {
            this._blockCon = new egret.DisplayObjectContainer;
            this._blockCon.name = "方块容器";
            this._blockCon.width = this.hor * DataManager.BLOCK_W;
            this._blockCon.height = (this.ver + 0.5) * DataManager.BLOCK_H;
            this.addChild(this._blockCon);
        }

        if (!this._hand) {
            this.addChild(this._hand = new Hand());
        }

        if (!this._forbidHint) {
            this.addChild(this._forbidHint = new ForbidHint);
        }

        if (!this._praise) {
            this.addChild(this._praise = new Praise);
        }

        if (!this._extra) {
            this.addChild(this._extra = new Praise);
        }

        if (!this._ui) {
            this._ui = new GameUI();
            this.addChild(this._ui);
        } else {
            this._ui.reset();
        }

        if (!this._tutorialHand) {
            this.addChild(this._tutorialHand = new TutorialHand());
        }

        if (!this._popHint) {
            this.addChild(this._popHint = new PopHint());
        }

        if (!this._pauseScene) {
            this.addChild(this._pauseScene = ObjectPool.pop("PauseScene"));
        }

        if (this._blocks) {
            this._blocks.forEach(arr => {
                arr.forEach(b => {
                    if (b.value > 0) {
                        b.remove();
                    } else {
                        b.remove();
                    }
                });
            })
        }
        this._hand.visible = false;
        this._pauseScene.visible = false;
        this._popHint.visible = false;
        this._tutorialHand.visible = false;
        this._forbidHint.visible = false;
        this._praise.visible = false;
        this._extra.visible = false;
        this._orbit.visible = false;

        this._blocks = [];
        this._blankList = [];
        this._removeList = [];
        this._moveFlag = false;
        this._curItem = 0;
        this._tutorialStep = 0;
        if (PlayerDataManager.isFirstTime) {
            this._tutorialStep = 1;
            this.initTutorial();
        }
    }

    protected onResize() {
        super.onResize();

        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        this._bg.width = w;
        this._bg.height = h;
        this._blankCon.x = w / 2;
        this._blankCon.y = h / 2 + 80;
        this._blockCon.x = w / 2;
        this._blockCon.y = h / 2 + 80;
        this._orbit.x = this._blockCon.x;
        this._orbit.y = this._blockCon.y;

        this._extra.x = StageUtils.stageW / 2;
        this._extra.y = this._blockCon.y - this._blockCon.height / 2;
    }

    /**
     * 初始化方块
     */
    private initBlocks() {
        MISO.trigger("gameStart", null);
        this.setState(GameState.Init);
        SoundManager.playEffect("cell_mp3");
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
     * 初始化引导数据 
     */
    private initTutorial() {
        MISO.trigger("tutorialStart", null);
        this._tutorialArr = [
            {
                "step": 1,
                "add": [[3, 2, 2], [1, 4, 2], [1, 5, 2], [2, 4, 2], [4, 5, 4], [3, 6, 1], [3, 7, 4], [2, 7, 4], [3, 0, 1], [1, 1, 1]],
                "next": false,
                "hint": {
                    "bg": "blue_png",
                    "text": "Connect at\nleast 4\nnumbers of\nthse same\nvalue",
                    "duration": 3000
                },
                "hand": {
                    "src": [3, 2],
                    "dest": [1, 3]
                }
            },
            {
                "step": 2,
                "hand": {
                    "src": [1, 3],
                    "dest": [4, 6]
                }
            },
            {
                "step": 3,
                "hand": {
                    "src": [3, 6],
                    "dest": [2, 0]
                }
            },
            {
                "step": 5,
                "add": [[1, 5, 1], [4, 3, 3], [0, 6, 3]],
                "next": true,
                "hand": {
                    "src": [1, 3],
                    "dest": [4, 6]
                }
            },
            {
                "step": 6,
                "hand": {
                    "src": [1, 5],
                    "dest": [2, 1]
                }
            },
            {
                "step": 7,
                "hint": {
                    "bg": "purple_png",
                    "text": "You are ready\nto play!\nKeep forming\nhigher\nnumbers",
                    "duration": 3000
                },
                "isEnd": true
            }


        ];
    }

    /**
     * 获取引导数据
     */
    private getTutorialData(step: number) {
        if (this._tutorialArr) {
            for (let i = 0; i < this._tutorialArr.length; i++) {
                let data = this._tutorialArr[i];
                if (data["step"] == step) {
                    return data;
                }
            }
        }
        return;
    }

    /**
     * 显示提示
     */
    private showHint(bg: string, text: string, callBack: Function, duration: number) {
        this._popHint.show(bg, text, callBack, duration);
    }

    /**
     * 显示引导
     */
    private showHand(block: Block, callBack: Function) {
        var x = block.x + this._blockCon.x;
        var y = block.y + this._blockCon.y;
        this._tutorialHand.show(new egret.Point(x, y), callBack);
    }

    /**
     * 引导
     */
    private doTutorial() {
        var data = this.getTutorialData(this._tutorialStep);
        this._tutorialStep += 1;
        if (data) {
            var hint = data["hint"];
            var hand = data["hand"];
            if (data["isEnd"]) {
                this._tutorialStep = 0;
                MISO.trigger("tutorialEnd", null);
                PlayerDataManager.tutorialOver();
            }
            var action = () => {
                if (hand) {
                    let src = hand["src"];
                    let dest = hand["dest"];
                    let block = this._blocks[src[0]][src[1]];
                    let blank = this._blocks[dest[0]][dest[1]];
                    this.showHand(block, () => {
                        this.tapBlock(block);
                        TimerManager.doTimer(200, 1, () => {
                            this.showHand(blank, () => {
                                this.tapBlank(blank);
                            });
                        }, this);
                    });
                };
            }

            if (hint) {
                this.showHint(hint["bg"], hint["text"], () => {
                    action();
                }, hint["duration"]);
            } else {
                action();
            }
        }
    }

    /**
     * 重新开始
     */
    public restart() {
        if (this._state != GameState.Idle && this._state != GameState.End) return;
        this.setState(GameState.Init);
        this._ui.clearBlocks();
        var delay = (x, y) => {
            return (this.ver - y) * 200 + (this.hor - x) * 50 + 300;
        }

        for (let x: number = 0; x < this.hor; x++) {
            for (let y: number = 0; y < this.ver; y++) {
                TimerManager.doTimer(delay(x, y), 1, () => {
                    let block = this._blocks[x][y];
                    egret.Tween.get(block).to({ alpha: 0.3 }, 100).call(() => {
                        if (block.value > 0) {
                            block.remove();
                        } else {
                            block.remove();
                        }
                    })
                }, this);
            }
        }
        TimerManager.doTimer(700, 1, () => {
            SoundManager.playEffect("remove_mp3");
        }, this);
        TimerManager.doTimer(delay(0, 0) + 500, 1, this.init, this);
    }

    /**
     * 暂停
     */
    public pause() {
        this._pauseScene.show();
    }

    /**
     * 使用道具
     */
    public useItem(idx: number) {
        if (this._state != GameState.Idle && this._state != GameState.End) return;
        this.setState(GameState.Item);
        this._curItem = idx;
        if (idx > 1 && this._curBlock) {
            this._curBlock.unSelect();
            this._curBlock = null;
        }
        if (idx == 2 || idx == 4) {
            this._ui.showHint("Select one cell!");
        } else {
            this.itemEffect();
        }
    }

    /**
     * 道具效果
     */
    private itemEffect(block: Block = null) {
        SoundManager.playEffect("booster_mp3");
        switch (this._curItem) {
            case 1:
                /** 刷新备用列表 */
                var t = this._ui.removeBlocks(-1);
                TimerManager.doTimer(t + 50, 1, () => {
                    this._nextBlocks = this.getNextBlocks();
                    this._ui.setBlocks(this._nextBlocks);
                    TimerManager.doTimer(this._idleTime, 1, () => {
                        this.setState(GameState.Idle);
                    }, this);
                }, this);
                break;
            case 2:
                /** 消除一个 */
                this._ui.hideHint();
                var t = this.delBlock(block, this._addTime);
                TimerManager.doTimer(t + 50 + this._idleTime, 1, () => this.setState(GameState.Idle), this);
                break;
            case 3:
                /** 随机消除5个 */
                var arr = [];
                this._blocks.forEach(bs => {
                    bs.forEach(b => {
                        if (b.value > 0) {
                            arr.push(b);
                        }
                    });
                });
                arr.sort(SortUtils.random);
                var duration = this._addTime;
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
                /** 消除一色 */
                this._ui.hideHint();
                var duration = this._addTime;
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
        this._curItem = 0;
    }

    /**
     * 补充方块
     */
    private addBlocks() {
        this.setState(GameState.Add);
        var t = this._ui.removeBlocks();
        /** 引导 */
        if (this._tutorialStep > 0) {
            var data = this.getTutorialData(this._tutorialStep);
            var arr: Array<Array<number>> = data["add"];
            var next: boolean = data["next"];
            var del_blanks: Array<Block> = [];
            for (let i: number = 0; i < arr.length; i++) {
                let x = arr[i][0];
                let y = arr[i][1];
                let value = arr[i][2];
                TimerManager.doTimer(i * this._perMoveTime, 1, () => {
                    let blank = this._blocks[x][y];
                    ArrayUtils.remove(this._blankList, blank);
                    del_blanks.push(blank);
                    this.addBlock(blank.pos.x, blank.pos.y, value);
                }, this);
            }
            TimerManager.doTimer(arr.length * this._perMoveTime, 1, () => {
                for (let i: number = 0; i < del_blanks.length; i++) {
                    this.removeBlank(del_blanks[i]);
                }
                TimerManager.doTimer(this._idleTime + this._addTime, 1, () => {
                    this.setState(GameState.Idle);
                }, this);
            }, this);
            if (next) {
                TimerManager.doTimer(Math.max(t + 50, arr.length * this._perMoveTime), 1, () => {
                    this._nextBlocks = this.getNextBlocks();
                    this._ui.setBlocks(this._nextBlocks);
                }, this);
            }
            return;
        }

        this._blankList.sort(SortUtils.random);
        var list = this._nextBlocks;
        var del_blanks: Array<Block> = [];
        for (let i: number = 0; i < list.length; i++) {
            TimerManager.doTimer(i * this._perMoveTime, 1, () => {
                let value = list[i];
                let blank = this._blankList.pop();
                del_blanks.push(blank);
                this.addBlock(blank.pos.x, blank.pos.y, value);
            }, this);
        }
        TimerManager.doTimer(list.length * this._perMoveTime, 1, () => {
            for (let i: number = 0; i < del_blanks.length; i++) {
                this.removeBlank(del_blanks[i]);
            }
            TimerManager.doTimer(this._idleTime + this._addTime, 1, () => {
                this.setState(GameState.Idle);
            }, this);
        }, this);
        TimerManager.doTimer(Math.max(t + 50, list.length * this._perMoveTime), 1, () => {
            this._nextBlocks = this.getNextBlocks();
            this._ui.setBlocks(this._nextBlocks);
        }, this);
    }

    /**
     * 添加方块
     */
    private addBlock(x: number, y: number, value: number, type: number = 1) {
        var b: Block = ObjectPool.pop("Block");
        b.init(value);
        var postion = this.getPosition(x, y);
        b.x = postion.x;
        b.y = postion.y;
        this.pushToList(b, x, y);
        b.show(this._addTime, type);
        b.setOnTap(() => this.tapBlock(b));
    }

    /**
     * 添加空白方块
     */
    private addBlank(x: number, y: number) {
        let blank: Block = ObjectPool.pop("Block");
        blank.init(0);
        var position = this.getPosition(x, y);
        blank.x = position.x;
        blank.y = position.y + DataManager.BLOCK_H;
        blank.moveTo(position.x, position.y, 1000, egret.Ease.elasticOut);
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
    private delBlock(block: Block, duration: number): number {
        block.hide(duration);
        TimerManager.doTimer(duration + 100, 1, () => {
            block.remove();
            this.addBlank(block.pos.x, block.pos.y);
        }, this);
        return duration + 300;
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
        this.setState(GameState.Move);
        if (path.length > 0) {
            SoundManager.playEffect("move_mp3");
            this._orbit.start(cur);
            var duration: number = this._perMoveTime;
            for (let i: number = 0; i < path.length; i++) {
                let blank = this._blocks[path[i].x][path[i].y];
                TimerManager.doTimer(duration * i, 1, () => {
                    cur.moveTo(blank.x, blank.y, duration);
                }, this);
            }
            TimerManager.doTimer(duration, 1, () => {
                this.addBlank(cur.pos.x, cur.pos.y);
            }, this);
            TimerManager.doTimer(duration * path.length, 1, () => {
                SoundManager.playEffect("stop_mp3");
                this._orbit.end();
                this.pushToList(cur, blank.pos.x, blank.pos.y);
                ArrayUtils.remove(this._blankList, blank);
                this.removeBlank(blank);
                this._moveFlag = true;
                TimerManager.doTimer(this._idleTime, 1, () => {
                    this.setState(GameState.Idle);
                }, this);
            }, this);
        } else {
            var start = new egret.Point(cur.x + this._blockCon.x, cur.y + this._blankCon.y);
            var end = new egret.Point(blank.x + this._blockCon.x, blank.y + this._blankCon.y);

            var t = this._forbidHint.show(start, end);
            TimerManager.doTimer(t + this._idleTime, 1, () => {
                this.setState(GameState.Idle);
            }, this);
        }
    }

    /**
     * 获取路径
     */
    private getPath(start: egret.Point, end: egret.Point, value: number = 0): Array<egret.Point> {
        var maze: Array<Array<number>> = this.getBinaryMap(value);
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
        if (block.value > 0) {
            this._blockCon.addChild(block);
            this._checkList = [];
            this.check(new egret.Point(x, y), this.map);
            if (this._checkList.length >= 4) {
                var arr: Array<Block> = [];
                this._checkList.forEach(p => {
                    arr.push(this._blocks[p.x][p.y]);
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
        SoundManager.playEffect("unite_mp3");
        var x = StageUtils.stageW / 2;
        var y = this._blockCon.y - this._blockCon.height / 2;
        this._extra.show(PlayerDataManager.checkExtra(), new egret.Point(x, y));

        var t = 0;
        var pos = arr[0].pos;
        var value = arr[0].value;
        for (let i: number = 0; i < arr.length; i++) {
            let block = arr[i];
            if (i == 0) {
                block.remove();
            } else {
                let duration = this.toRemove(block, pos);
                if (duration > t) {
                    t = duration;
                }
            }
        }
        TimerManager.doTimer(t + 200, 1, () => {
            this.addBlock(pos.x, pos.y, value + 2, 2);
            var c = PlayerDataManager.connect(value, arr.length);
            this._ui.addScore(c[0]);
            var p = this.getPosition(pos.x, pos.y);
            var p1 = new egret.Point(p.x + this._blockCon.x, p.y + this._blockCon.y);
            var p2 = new egret.Point(p1.x, p1.y - 70);
            this._ui.addCoin(c[1], p1);
            this._praise.show(arr.length, p2);
            TimerManager.doTimer(this._idleTime + this._addTime, 1, () => {
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
                block.moveTo(position.x, position.y, duration);
            }, this);
        }
        TimerManager.doTimer(duration, 1, () => {
            this.addBlank(block.pos.x, block.pos.y);
        }, this);
        TimerManager.doTimer(duration * path.length, 1, () => {
            block.remove();
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
    private check(pos: egret.Point, map: Array<Array<number>>) {
        for (let i = 0; i < this._checkList.length; i++) {
            let p = this._checkList[i];
            if (pos.x == p.x && pos.y == p.y) return;
        }
        this._checkList.push(pos);
        var x = pos.x;
        var y = pos.y;
        var value = map[x][y];
        var arr = this.getNeighbor(pos, value, map);
        for (let i = 0; i < arr.length; i++) {
            this.check(arr[i], map);
        }
    }

    /**
     * 获取相邻的
     */
    private getNeighbor(pos: egret.Point, value: number, map: Array<Array<number>>): Array<egret.Point> {
        var x = pos.x;
        var y = pos.y;
        var arr = [];
        for (let i: number = -1; i <= 1; i++) {
            for (let j: number = -1; j <= 1; j++) {
                if (x + i < 0 || x + i >= this.hor || y + j < 0 || y + j >= this.ver) {
                    continue;
                }
                let p = new egret.Point(x + i, y + j);
                let v = map[x + i][y + j];
                if (v == value && (i != 0 || j != 0)) {
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
                        arr.push(p);
                    }
                }
            }
        }
        return arr;
    }

    /**
     * 获取相同类型的
     */
    private getOneType(pos: egret.Point, value: number, map: Array<Array<number>>): Array<egret.Point> {
        var arr = [];
        for (let x: number = 0; x < this.hor; x++) {
            for (let y: number = 0; y < this.ver; y++) {
                if (value == map[x][y] && !(pos.x == x && pos.y == y)) {
                    arr.push(new egret.Point(x, y));
                }
            }
        }
        return arr;
    }

    /**
     * 检查移动
     */
    private checkMove() {
        this._moveArr = [];
        var map = this.map;
        var cnt = 0;
        for (let x: number = 0; x < this.hor; x++) {
            for (let y: number = 0; y < this.ver; y++) {
                let value = map[x][y];
                if (value == 0) {
                    continue;
                }
                let pos = new egret.Point(x, y);
                let neighbor = this.getNeighbor(pos, 0, map);
                let arr = this.getOneType(pos, value, map);
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0; j < neighbor.length; j++) {
                        let start = arr[i];
                        let end = neighbor[j];
                        if (this.getPath(start, end).length > 0) {
                            let newMap = [];
                            for (let m = 0; m < this.hor; m++) {
                                for (let n = 0; n < this.ver; n++) {
                                    if (!newMap[m]) newMap[m] = [];
                                    newMap[m][n] = map[m][n];
                                }
                            }
                            newMap[start.x][start.y] = 0;
                            newMap[end.x][end.y] = value;
                            this._checkList = [];
                            this.check(pos, newMap);
                            if (cnt < this._checkList.length) {
                                cnt = this._checkList.length;
                                this._moveArr = [start, end];
                            }
                        }
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
        for (let i: number = 0; i < cnt; i++) {
            arr.push(RandomUtils.limitInteger(1, 4));
        }
        return arr;
    }

    /**
     * 设置状态
     */
    private setState(state: GameState) {
        this._state = state;
        if (state == GameState.Idle) {
            if (!this.checkRemove()) {
                this.checkMove();
                this._handInterval = 5000;
                if (this._tutorialStep > 0) {
                    this.doTutorial();
                }

                if (this._moveFlag || this._blankList.length == this.ver * this.hor) {
                    PlayerDataManager.clearCnt();
                    this.addBlocks();
                } else if (this._blankList.length == 0) {
                    this.setState(GameState.End);
                }
            }
            this._moveFlag = false;
        } else if (this._state == GameState.End) {
            this._ui.showEndScene();
        }
    }

    /**
     * 获取数值地图
     */
    private get map(): Array<Array<number>> {
        var arr = [];
        for (let x: number = 0; x < this.hor; x++) {
            let list = [];
            arr.push(list);
            for (let y: number = 0; y < this.ver; y++) {
                list.push(this._blocks[x][y].value);
            }
        }
        return arr;
    }

    /**
     * 获取二进制地图
     */
    private getBinaryMap(value: number): Array<Array<number>> {
        var arr = [];
        for (let x: number = 0; x < this.hor; x++) {
            let list = [];
            arr.push(list);
            for (let y: number = 0; y < this.ver; y++) {
                if (this._blocks[x][y].value == value) {
                    list.push(0);
                } else {
                    list.push(1);
                }
            }
        }
        return arr;
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

    public get state(): GameState {
        return this._state;
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