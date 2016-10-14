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
    /** 方块列表 */
    private _blocks: Array<Array<Block>>;
    /** 连接中的方块 */
    private _lineBlocks: Array<Block>;
    /** 连接线 */
    private _lines: Array<egret.Sprite>;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        this.addTouch();
        this.initBlocks();
        this._lineBlocks = [];
        this._lines = [];
    }

    /**
     * 初始化方块
     */
    private initBlocks() {
        this._blocks = [];
        this._blockCon = new egret.DisplayObjectContainer;
        this._blockCon.name = "方块容器";
        this._blockCon.x = StageUtils.stageW / 2;
        this._blockCon.y = StageUtils.stageH / 2;
        this._blockCon.width = this.hor * this.blockSize;
        this._blockCon.height = this.ver * this.blockSize;
        AnchorUtils.setAnchor(this._blockCon, 0.5);
        this.addChild(this._blockCon);

        for (let x: number = 0; x < this.hor; x++) {
            let list: Array<Block> = [];
            for (let y: number = 0; y < this.ver; y++) {
                let block: Block = this.getRandomBlock();
                block.pos = new egret.Point(x, y);
                block.name = "方块（" + x + ", " + y + "）";
                block.x = x * this.blockSize;
                block.y = y * this.blockSize;
                list.push(block);
                this._blockCon.addChild(block);
                block.setOnTouch(() => {
                    this.selectBlcok(block);
                });
            }
            this._blocks.push(list);
        }
    }

    /**
     * 选中方块
     */
    private selectBlcok(block: Block) {
        var x = block.pos.x; 
        var y = block.pos.y;
        var self = this;
        var curBlock = this.curBlock;
        var blocks = this._lineBlocks;
        var selectFunc = () => {
            block.select();
            blocks.push(block);
            self.addLine();
        };
        if (curBlock) {
            var point = curBlock.pos;
            var idx = blocks.indexOf(block);
            if (idx >= 0) {
                /** 是上一个选中点则回退 */
                if (idx == blocks.length - 2) {
                    this.delLine();
                    blocks.pop();
                }
            } else {
                /** 相邻同色且未被选中则选中 */
                if (MathUtils.getDistance(x, y, point.x, point.y) == 1 && curBlock.color == block.color) {
                    let line = this.curLine;
                    let src = this.getBlockPos(curBlock);
                    let dest = this.getBlockPos(block);
                    DrawUtils.drawLine(line, src, dest, this.lineSize, curBlock.color);
                    selectFunc();
                }
            }
        } else {
            /** 未选中任何点则选中 */
            selectFunc();
        }
    }

    /**
     * 添加连接线
     */
    private addLine() {
        var line = new egret.Sprite;
        line.name = "连接线";
        this.addChild(line);
        this._lines.push(line);
    }

    /**
     * 删除连接线
     */
    private delLine() {
        var line = this._lines.pop();
        DisplayUtils.removeFromParent(line);
    }

    /**
     * 添加触摸事件
     */
    private addTouch() {
        var bg = new egret.Sprite;
        bg.name = "背景";
        DrawUtils.drawRect(bg, StageUtils.stageW, StageUtils.stageH, 0xffffff);
        this.addChild(bg);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onEnd, this);
    }

    /**
     * 移动回调
     */
    private onMove(event: egret.TouchEvent) {
        if (this.curBlock) {
            var line = this.curLine;
            var block = this.curBlock;
            var size = this.blockSize;
            var src = this.getBlockPos(block);
            var dest = new egret.Point(event.stageX, event.stageY);
            DrawUtils.drawLine(line, src, dest, this.lineSize, block.color);
        }
    }

    /**
     * 触摸结束回调
     */
    private onEnd(event: egret.Event) {
        if (this.curBlock) {
            var blocks = this._lineBlocks;
            var lines = this._lines;
            for (let i = 0; i < lines.length; i++) {
                DisplayUtils.removeFromParent(lines[i]);
            }
            if (blocks.length >= 2) {
                var removes = {};
                /** 移除方块 */
                for (let i = 0; i < blocks.length; i++) {
                    let block = blocks[i];
                    let x = block.pos.x;
                    let y = block.pos.y;
                    if (!removes[x]) {
                        removes[x] = [y];
                    } else {
                        removes[x].push(y);
                    }
                    block.remove(250);
                }

                TimerManager.doTimer(300, 1, () => {
                    /** 补充方块 */
                    for (var x in removes) {
                        let arr: Array<number> = removes[x];
                        arr.sort(SortUtils.sortNum);
                        let start = 0;
                        for (let i = 0; i < arr.length; i++) {
                            for (let y = start; y < arr[i]; y++) {
                                let block = this._blocks[x][y];
                                let point = new egret.Point(parseInt(x), y + arr.length - i);
                                this.moveBlock(block, point);
                            }
                            start = arr[i] + 1;

                            let block: Block = this.getRandomBlock();
                            let point = new egret.Point(parseInt(x), i);
                            block.x = parseInt(x) * this.blockSize;
                            block.y = (i - 4) * this.blockSize;
                            this._blockCon.addChild(block);
                            block.setOnTouch(() => {
                                this.selectBlcok(block);
                            });
                            this.moveBlock(block, point);
                        }
                    }
                }, this);
            }

            this._lineBlocks = [];
            this._lines = [];
        }
    }

    /**
     * 移动方块
     */
    private moveBlock(block: Block, target: egret.Point): number {
        var pos = new egret.Point(target.x * this.blockSize, target.y * this.blockSize);
        var duration: number = (pos.y - block.y) * 3;
        egret.Tween.get(block).to({ x: pos.x, y: pos.y }, duration, egret.Ease.elasticOut)
            .call(() => {
                block.pos = target;
                this._blocks[target.x][target.y] = block;
                block.name = "方块（" + target.x + ", " + target.y + "）";
            });
        return duration;
    }

    /**
     * 获取方块中心位置
     */
    private getBlockPos(block: Block): egret.Point {
        return new egret.Point(this._blockCon.x - this._blockCon.width / 2 + block.x + block.width / 2,
            this._blockCon.y - this._blockCon.height / 2 + block.y + block.height / 2);
    }

    /** 
     * 获取普通方块（随机） 
     */
    private getRandomBlock(): Block {
        var block: Block = ObjectPool.pop("Block");
        var blockData: BlockData = new BlockData;
        blockData.type = BlockType.Normal;
        blockData.id = RandomUtils.limitInteger(0, 3);
        block.init(blockData);
        return block;
    }

    /**
     * 当前方块
     */
    private get curBlock(): Block {
        if (this._lineBlocks.length > 0) {
            return this._lineBlocks[this._lineBlocks.length - 1];
        } else {
            return null;
        }
    }

    /**
     * 当前连接线
     */
    private get curLine(): egret.Sprite {
        if (this._lines.length > 0) {
            return this._lines[this._lines.length - 1];
        } else {
            return null;
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

    /** 方块大小 */
    public get blockSize(): number {
        return DataManager.BLOCK_SIZE;
    }

    /** 连接线粗细 */
    public get lineSize(): number {
        return DataManager.LINE_SIZE;
    }
}

/**
 * 游戏状态
 */
enum GameState {
    Idle,
    Anim
}