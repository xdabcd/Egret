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
    /** 空白方块列表 */
    private _blankList: Array<Block>;
    /** 下一批要补充的方块 */
    private _nextBlocks: Array<number>;

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
        this._state = GameState.Init;
        this._blocks = [];
        this._blankList = [];
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
                    this.addBlankBlock(x, y);
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
        this._state = GameState.Add;
        this._blankList.sort(SortUtils.random);
        var list = this._nextBlocks;
        var del_blocks = [];
        for (let i: number = 0; i < list.length; i++) {
            TimerManager.doTimer(i * 100, 1, () => {
                let value = list[i];
                let blankBlock = this._blankList.pop();
                del_blocks.push(blankBlock);
                var block: Block = ObjectPool.pop("Block");
                block.init(value);
                block.x = blankBlock.x;
                block.y = blankBlock.y;
                this.pushToList(block, blankBlock.pos.x, blankBlock.pos.y);
                block.show(500);
            }, this);
        }
        TimerManager.doTimer(list.length * 100, 1, ()=>{
            for(let i: number = 0; i < del_blocks.length; i++){
                this.delBlankBlock(del_blocks[i])
            }
            this._nextBlocks = this.getNextBlocks();
        }, 1);
    }

    /**
     * 添加空白方块
     */
    private addBlankBlock(x: number, y: number) {
        let block: Block = ObjectPool.pop("Block");
        block.init(0);
        let t_x = this.b_w * x;
        let t_y = this.b_h / 2 * (2 * y + 1 - x % 2);
        block.x = t_x;
        block.y = t_y + this.b_h;
        egret.Tween.get(block).to({ x: t_x, y: t_y }, 1000, egret.Ease.elasticOut);
        this._blankList.push(block);
        this.pushToList(block, x, y);
        return block;
    }

    /**
     * 移除空白方块
     */
    private delBlankBlock(block: Block) {
        DisplayUtils.removeFromParent(block);
        ObjectPool.push(block);
    }

    /**
     * 放入列表
     */
    private pushToList(block: Block, x: number, y: number) {
        block.pos = new egret.Point(x, y);
        this._blocks[x][y] = block;
        block.name = "方块（" + x + ", " + y + "）";
        this._blockCon.addChild(block);
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
    Del
}