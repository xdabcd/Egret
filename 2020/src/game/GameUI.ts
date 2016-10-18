/**
 *
 * 游戏UI
 *
 */
class GameUI extends BaseScene {

    /** 方块容器 */
    private _blockCon: egret.DisplayObjectContainer;
    /** 方块列表 */
    private _blocks: Array<Block>;
    /** 重新开始按钮 */
    private _restartBtn: egret.Sprite;
    /** 弹出背景 */
    private _popBg: egret.Sprite;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        this.width = StageUtils.stageW;
        this.height = StageUtils.stageH;
        this.reset();
    }

    /**
     * 重置
     */
    private reset() {
        this._blocks = [];

        if (!this._blockCon) {
            this._blockCon = new egret.DisplayObjectContainer;
            this._blockCon.name = "方块容器";
            this._blockCon.x = this.width / 2;
            this._blockCon.y = 30;
            this._blockCon.scaleX = this._blockCon.scaleY = 0.75;
            AnchorUtils.setAnchorX(this._blockCon, 0.5);
            this.addChild(this._blockCon);
        }
        if (!this._restartBtn) {
            this._restartBtn = new egret.Sprite;
            this._restartBtn.name = "重新开始按钮";
            DrawUtils.drawRoundHexagon(this._restartBtn, 60, 25, 0x000000);
            this._restartBtn.x = this.width / 2;
            this._restartBtn.y = this.height - 80;
            this.addChild(this._restartBtn);
            var s1 = new egret.Sprite;
            var s2 = new egret.Sprite;
            DrawUtils.drawCircle(s1, 35, 0xffffff);
            DrawUtils.drawCircle(s2, 25, 0x000000);
            this._restartBtn.addChild(s1);
            this._restartBtn.addChild(s2);
            this._restartBtn.touchEnabled = true;
            this._restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restart, this),
                this._restartBtn.visible = false;
        }

        if (!this._popBg) {
            this._popBg = new egret.Sprite;
            this._popBg.name = "弹出背景";
            DrawUtils.drawRect(this._popBg, this.width, this.height, 0x000000);
            this.addChild(this._popBg);
            this._popBg.visible = false;
            this._popBg.touchEnabled = true;
        }
    }

    /**
     * 重新开始
     */
    public restart() {
        egret.Tween.get(this._restartBtn).to({ scaleX: 0.1, scaleY: 0.1 }, 500, egret.Ease.elasticIn)
            .call(() => {
                this._restartBtn.visible = false;
                let gameSene = SceneManager.curScene as GameScene;
                gameSene.restart();
            });

    }

    /**
     * 结束
     */
    public end() {
    }

    /**
     * 显示背景
     */
    private showBg() {
        this._popBg.visible = true;
        this._popBg.alpha = 0.4;
        egret.Tween.get(this._popBg).to({ alpha: 0.85 }, 500);
    }

    /**
     * 隐藏背景
     */
    private hideBg() {
        egret.Tween.get(this._popBg).to({ alpha: 0.01 }, 500).call(() => { this._popBg.visible = false });
    }

    /**
     * 设置方块
     */
    public setBlocks(list: Array<number>) {
        this._blocks = [];
        var duration = 100;
        var w = this.blockSize * 1.8;
        var s = -list.length * w / 2;
        for (let i: number = 0; i < list.length; i++) {
            TimerManager.doTimer(duration * i, 1, () => {
                let block: Block = ObjectPool.pop("Block");
                block.name = "方块" + i;
                this._blockCon.addChild(block);
                block.init(list[i]);
                block.x = s + w * i;
                block.y = 0;
                this._blocks.push(block);
                block.show(500);
            }, this);
        }
        TimerManager.doTimer(duration * list.length + 100, 1, () => {
            if (this._restartBtn.visible == false) {
                this._restartBtn.visible = true;
                this._restartBtn.scaleX = this._restartBtn.scaleY = 0.2;
                egret.Tween.get(this._restartBtn).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.elasticOut);
            }
        }, this);
    }

    /**
     * 清空方块
     */
    public clearBlocks() {
        var duration = 100;
        if (this._blocks && this._blocks.length > 0) {
            for (let i: number = 0; i < this._blocks.length; i++) {
                let block = this._blocks[i];
                TimerManager.doTimer(duration * (this._blocks.length - i - 1), 1, () => {
                    egret.Tween.get(block).to({ alpha: 0.3 }, 100)
                        .call(() => {
                            this.removeBlock(block);
                        }, this);
                }, this);
            }
        }
        TimerManager.doTimer(duration * this._blocks.length, 1, () => {
            this._blocks = [];
        }, this);
    }

    /**
     * 消除方块
     */
    public removeBlocks() {
        var duration = 100;
        if (this._blocks && this._blocks.length > 0) {
            for (let i: number = 0; i < this._blocks.length; i++) {
                let block = this._blocks[i];
                TimerManager.doTimer(duration * i, 1, () => {
                    egret.Tween.get(block).to({ x: block.x, y: block.y + 50, alpha: 0.3 }, 100)
                        .call(() => {
                            this.removeBlock(block);
                        }, this);
                }, this);
            }
        }
        TimerManager.doTimer(duration * this._blocks.length, 1, () => {
            this._blocks = [];
        }, this);
    }

    /**
     * 移除方块
     */
    private removeBlock(block: Block) {
        egret.Tween.removeTweens(block);
        DisplayUtils.removeFromParent(block);
        ObjectPool.push(block);
    }

    /** 方块半径 */
    public get blockSize(): number {
        return DataManager.BLOCK_SIZE;
    }
}