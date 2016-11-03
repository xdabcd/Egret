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
    /** 更换下一批方块 */
    private _refreshNext: egret.Sprite;
    /** 消除一个 */
    private _clearOne: egret.Sprite;
    /** 消除随机5个 */
    private _clearRandomFive: egret.Sprite;
    /** 消除一色 */
    private _clearOneColor: egret.Sprite;
    /** 提示文字 */
    private _hint: egret.TextField;

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
            this._blockCon.y = 50;
            this._blockCon.scaleX = this._blockCon.scaleY = 0.75;
            AnchorUtils.setAnchorX(this._blockCon, 0.5);
            this.addChild(this._blockCon);
        }
        if (!this._restartBtn) {
            this._restartBtn = this.newButton("重启", this.width / 2 + 250, 75, this.restart);
            this._restartBtn.visible = false;
        }
        if (!this._refreshNext) {
            let x = this.width / 2;
            let y = this.height - 75;
            this._refreshNext = this.newButton("刷新", x - 225, y, () => this.useItem(1));
            this._refreshNext.visible = false;
            this._clearOne = this.newButton("消一", x - 75, y, () => this.useItem(2));
            this._clearOne.visible = false;
            this._clearRandomFive = this.newButton("消五", x + 75, y, () => this.useItem(3));
            this._clearRandomFive.visible = false;
            this._clearOneColor = this.newButton("消色", x + 225, y, () => this.useItem(4));
            this._clearOneColor.visible = false;
        }
        if (!this._hint) {
            var hint = new egret.TextField;
            hint.size = 30;
            hint.x = this.width / 2;
            hint.y = this.height - 170;
            hint.textAlign = "center";
            hint.bold = true;
            hint.textColor = 0x000000;
            hint.name = "hint";
            this.addChild(hint);
            this._hint = hint;
            this._hint.visible = false;
        }
    }

    /**
     * 重新开始
     */
    public restart() {
        this.hideBtns();
        let gameSene = SceneManager.curScene as GameScene;
        gameSene.restart();
    }

    /**
     * 使用道具
     */
    public useItem(idx: number) {
        let gameSene = SceneManager.curScene as GameScene;
        gameSene.useItem(idx);
    }

    /**
     * 显示提示
     */
    public showHint(text: string) {
        var hint = this._hint;
        egret.Tween.removeTweens(hint);
        hint.text = text;
        AnchorUtils.setAnchor(hint, 0.5);
        hint.visible = true;
        hint.scaleX = hint.scaleY = 1;
        hint.alpha = 0;
        egret.Tween.get(hint).to({ alpha: 1 }, 300).call(()=>this.playHint());
    }

    /**
     * 提示
     */
    public playHint() {
        var hint = this._hint;
        var target = 1;
        if(hint.scaleX < 1.1){
            target = 1.1;
        }
        egret.Tween.get(hint).to({ scaleX: target, scaleY: target}, 500).call(()=>this.playHint());
    }

    /**
     * 隐藏提示
     */
    public hideHint() {
        var hint = this._hint;
        egret.Tween.removeTweens(hint);
        egret.Tween.get(hint).to({ alpha: 0 }, 300).call(() => { hint.visible = false });
    }


    /**
     * 结束
     */
    public end() {
    }

    /**
     * 设置方块
     */
    public setBlocks(list: Array<number>) {
        this._blocks = [];
        var duration = 100;
        var w = this.blockSize * 1.7;
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
                this.showBtns();
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
    public removeBlocks(direction: number = 1) {
        var duration = 100;
        if (this._blocks && this._blocks.length > 0) {
            for (let i: number = 0; i < this._blocks.length; i++) {
                let block = this._blocks[i];
                TimerManager.doTimer(duration * i, 1, () => {
                    egret.Tween.get(block).to({ x: block.x, y: block.y + 50 * direction, alpha: 0.3 }, 100)
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
     * 显示所有按钮
     */
    private showBtns() {
        this.showBtn(this._restartBtn);
        TimerManager.doTimer(100, 1, () => this.showBtn(this._refreshNext), this);
        TimerManager.doTimer(200, 1, () => this.showBtn(this._clearOne), this);
        TimerManager.doTimer(300, 1, () => this.showBtn(this._clearRandomFive), this);
        TimerManager.doTimer(400, 1, () => this.showBtn(this._clearOneColor), this);
    }

    /**
     * 隐藏所有按钮
     */
    private hideBtns() {
        this.hideBtn(this._restartBtn);
        TimerManager.doTimer(400, 1, () => this.hideBtn(this._refreshNext), this);
        TimerManager.doTimer(300, 1, () => this.hideBtn(this._clearOne), this);
        TimerManager.doTimer(200, 1, () => this.hideBtn(this._clearRandomFive), this);
        TimerManager.doTimer(100, 1, () => this.hideBtn(this._clearOneColor), this);
    }

    /**
     * 新建按钮
     */
    private newButton(name: string, x: number, y: number, onTap: Function): egret.Sprite {
        var btn = new egret.Sprite;
        btn.name = name;
        DrawUtils.drawCircle(btn, 50, 0x000000);
        btn.x = x;
        btn.y = y;
        this.addChild(btn);
        let t = new egret.TextField;
        btn.addChild(t);
        t.size = 35;
        t.width = btn.width;
        t.height = 35;
        t.textAlign = "center";
        t.bold = true;
        AnchorUtils.setAnchor(t, 0.5);
        t.text = name;
        btn.touchEnabled = true;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, onTap, this);
        return btn;
    }

    /**
     * 显示按钮
     */
    private showBtn(btn: egret.Sprite) {
        egret.Tween.removeTweens(btn);
        btn.visible = true;
        btn.scaleX = btn.scaleY = 0.1;
        egret.Tween.get(btn).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.elasticOut);
    }

    /**
     * 隐藏按钮
     */
    private hideBtn(btn: egret.Sprite) {
        egret.Tween.removeTweens(btn);
        egret.Tween.get(btn).to({ scaleX: 0.1, scaleY: 0.1 }, 500, egret.Ease.elasticIn)
            .call(() => {
                btn.visible = false;
            });
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