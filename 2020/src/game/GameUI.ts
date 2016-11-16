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
    /** 暂停按钮 */
    private _pauseBtn: egret.DisplayObjectContainer;
    /** 金币按钮 */
    private _coinBtn: egret.DisplayObjectContainer;
    /** 金币 */
    private _coin: egret.TextField;
    /** 金币容器 */
    private _coinCon: egret.DisplayObjectContainer;
    /** 金币列表 */
    private _coinArr: Array<egret.Bitmap>;
    /** 道具按钮 */
    private _itemBtn: egret.DisplayObjectContainer;
    /** 道具图标 */
    private _itemIcon: egret.Bitmap;
    /** 关闭道具图标 */
    private _itemClose: egret.Bitmap;
    /** 奖杯 */
    private _cup: egret.Bitmap;
    /** 撒花 */
    private _burst: Burst;
    /** 得分 */
    private _score: egret.TextField;
    /** 增加得分 */
    private _addScore: egret.TextField;
    /** 记录 */
    private _record: egret.TextField;

    /** 道具界面 */
    private _itemScene: ItemScene;
    /** 道具背景 */
    private _itemBg: egret.Sprite;
    private _itemShow: boolean;
    /** 结束界面 */
    private _endScene: EndScene;
    /** 结束背景 */
    private _endBg: egret.Sprite;
    /** 提示文字 */
    private _hint: egret.TextField;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        this.reset();
        this.onResize();
    }

    /**
     * 重置
     */
    public reset() {
        if (!this._blockCon) {
            this._blockCon = new egret.DisplayObjectContainer;
            this._blockCon.name = "方块容器";
            this._blockCon.scaleX = this._blockCon.scaleY = 0.75;
            AnchorUtils.setAnchorX(this._blockCon, 0.5);
            this.addChild(this._blockCon);
        }

        if (!this._pauseBtn) {
            this.addChild(this._pauseBtn = new egret.DisplayObjectContainer);
            AnchorUtils.setAnchorX(this._pauseBtn, 0.5);
            AnchorUtils.setAnchorY(this._pauseBtn, 1);
            var bg = DisplayUtils.createBitmap("pausebg_png");
            this._pauseBtn.addChild(bg);
            var icon = DisplayUtils.createBitmap("pause_png");
            icon.x = bg.width / 2 - icon.width / 2;
            icon.y = bg.height / 2 - icon.height / 2;
            this._pauseBtn.addChild(icon);
            this.setOnTap(this._pauseBtn, () => {
                SoundManager.playEffect("click_mp3");
                MISO.trigger("gamePause", null);
                this.pause();
            });
        }

        if (!this._cup) {
            this.addChild(this._cup = DisplayUtils.createBitmap("cup_png"));
            AnchorUtils.setAnchorX(this._cup, 0.5);
            AnchorUtils.setAnchorY(this._cup, 0.9);
            this.addChild(this._burst = new Burst);
            this.addChild(this._score = new Label);
            this._score.width = 100;
            this._score.textColor = 0xff9654;
            this.addChild(this._addScore = new Label);
            this._addScore.width = 100;
            this._addScore.textColor = 0xff9654;
            this.addChild(this._record = new Label);
            this._record.width = 100;
            this._record.textColor = 0xa0abf7;
        }

        if (!this._hint) {
            var hint = new Label;
            hint.size = 40;
            hint.bold = true;
            hint.textColor = 0x000000;
            hint.name = "hint";
            this.addChild(hint);
            this._hint = hint;
            this._hint.visible = false;
        }

        if (!this._coinCon) {
            this.addChild(this._coinCon = new egret.DisplayObjectContainer);
        }

        if (!this._itemBg) {
            this.addChild(this._itemBg = new egret.Sprite);
            this._itemBg.visible = false;
            this._itemBg.touchEnabled = true;
        }

        if (!this._itemBtn) {
            this.addChild(this._itemBtn = new egret.DisplayObjectContainer);
            AnchorUtils.setAnchorX(this._itemBtn, 1);
            AnchorUtils.setAnchorY(this._itemBtn, 0.5);
            var bg = DisplayUtils.createBitmap("boostbg_png");
            this._itemBtn.addChild(bg);
            this._itemIcon = DisplayUtils.createBitmap("boost_png");
            AnchorUtils.setAnchor(this._itemIcon, 0.5);
            this._itemIcon.x = 110;
            this._itemIcon.y = 45;
            this._itemBtn.addChild(this._itemIcon);
            TimerManager.doTimer(5000, 0, () => {
                egret.Tween.get(this._itemIcon).to({ x: this._itemIcon.x + 10 }, 100)
                    .to({ x: this._itemIcon.x }, 100)
                    .to({ x: this._itemIcon.x + 10 }, 100)
                    .to({ x: this._itemIcon.x }, 100);
            }, this);
            this._itemClose = DisplayUtils.createBitmap("close_png");
            AnchorUtils.setAnchor(this._itemClose, 0.5);
            this._itemClose.x = 110;
            this._itemClose.y = 45;
            this._itemBtn.addChild(this._itemClose);
            this._itemClose.visible = false;
            this.setOnTap(this._itemBtn, () => {
                let gameSene = SceneManager.curScene as GameScene;
                if(gameSene.state != GameState.Idle){
                    SoundManager.playEffect("fail_mp3");
                    return;
                }
                SoundManager.playEffect("click_mp3");
                if (this._itemShow) {
                    this.hideItemScene();
                } else {
                    this.showItemScene();
                }
                this._itemShow = !this._itemShow;
            });
        }

        if (!this._endBg) {
            this.addChild(this._endBg = new egret.Sprite);
            this._endBg.visible = false;
            this._endBg.touchEnabled = true;
        }

        if (!this._coinBtn) {
            this.addChild(this._coinBtn = new egret.DisplayObjectContainer);
            AnchorUtils.setAnchorY(this._coinBtn, 0.5);
            this._coinBtn.y = 140;
            var bg = DisplayUtils.createBitmap("boostbg_png");
            bg.scaleX = -1;
            bg.x = bg.width;
            this._coinBtn.addChild(bg);
            var icon = DisplayUtils.createBitmap("coin_png");
            AnchorUtils.setAnchor(icon, 0.5);
            icon.x = 90;
            icon.y = 0;
            this._coinBtn.addChild(icon);
            this._coin = new Label;
            this._coin.width = 150;
            this._coin.x = 90;
            this._coin.y = 55;
            this._coinBtn.addChild(this._coin);
            this.setOnTap(this._coinBtn, () => { SoundManager.playEffect("click_mp3"); });
        }

        if (!this._itemScene) {
            this.addChild(this._itemScene = ObjectPool.pop("ItemScene"));
            this._itemScene.setCallBack(this.useItem.bind(this));
        }

        this._itemShow = false;

        if (!this._endScene) {
            this.addChild(this._endScene = ObjectPool.pop("EndScene"));
            this._endScene.setCallBack(this.useItem1.bind(this));
            this._endScene.setGiveup(() => {
                this.hideEndScene();
                TimerManager.doTimer(300, 1, () => {
                    SceneManager.enterScene(Scene.Menu);
                }, this);
            });
        }

        if (this._blocks) {
            this._blocks.forEach(b => {
                b.remove();
            })
        };
        if (!this._coinArr) {
            this._coinArr = [];
        } else {
            this._coinArr.forEach(c => {
                c.visible = false;
            })
        }
        this._blocks = [];
        this._addScore.visible = false;
        this.updateCoin(true);
        this.updateScore(true);
        this.updateRecord();
        this._hint.visible = false;
    }

    protected onResize() {
        super.onResize();

        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        this._blockCon.x = w / 2;
        this._blockCon.y = 50;

        this._pauseBtn.x = w / 2;
        this._pauseBtn.y = h;

        this._cup.x = w / 2;
        this._cup.y = 180;

        this._burst.x = this._cup.x;
        this._burst.y = this._cup.y - 50;

        this._score.x = w / 2 - 80;
        this._score.y = 160;

        this._record.x = w / 2 + 60;
        this._record.y = 160;

        DrawUtils.drawRect(this._itemBg, w, h, 0x000000);

        this._hint.x = w / 2;
        this._hint.y = h - 120;

        this._itemBtn.y = 148;
        this._itemBtn.x = w;

        DrawUtils.drawRect(this._endBg, w, h, 0x000000);
    }

    /**
     * 重新开始
     */
    public restart() {
        let gameSene = SceneManager.curScene as GameScene;
        gameSene.restart();
    }

    /**
     * 使用道具
     */
    private useItem(type: number) {
        var price = DataManager.getItemPrice(type);
        if (this.addCoin(-price)) {
            this.hideItemScene();
            this._itemShow = false;
            let gameSene = SceneManager.curScene as GameScene;
            gameSene.useItem(type);
        } else {
            SoundManager.playEffect("fail_mp3");
            egret.Tween.get(this._coin).to({ x: this._coin.x + 5 }, 100)
                .to({ x: this._coin.x }, 100)
                .to({ x: this._coin.x + 5 }, 100)
                .to({ x: this._coin.x }, 100);
        }
    }

    /**
     * 使用道具1
     */
    private useItem1(type: number) {
        var price = DataManager.getItemPrice(type);
        if (this.addCoin(-price)) {
            this.hideEndScene();
            let gameSene = SceneManager.curScene as GameScene;
            gameSene.useItem(type);
        } else {
            SoundManager.playEffect("fail_mp3");
            egret.Tween.get(this._coin).to({ x: this._coin.x + 5 }, 50)
                .to({ x: this._coin.x }, 50)
                .to({ x: this._coin.x + 5 }, 50)
                .to({ x: this._coin.x }, 50);
        }
    }

    /**
     * 显示道具界面
     */
    private showItemScene() {
        this._itemClose.visible = true;
        this._itemIcon.visible = false;
        this._itemBg.visible = true;
        this._itemBg.alpha = 0;
        var b = this._coinBtn.getChildAt(0) as egret.Bitmap;
        b.texture = RES.getRes("boostbg1_png");
        var b1 = this._itemBtn.getChildAt(0) as egret.Bitmap;
        b1.texture = RES.getRes("boostbg1_png");
        egret.Tween.get(this._itemBg).to({ alpha: 0.7 }, 200);
        this._itemScene.show();
    }

    /**
     * 隐藏道具界面
     */
    private hideItemScene() {
        this._itemClose.visible = false;
        this._itemIcon.visible = true;
        var b = this._coinBtn.getChildAt(0) as egret.Bitmap;
        b.texture = RES.getRes("boostbg_png");
        var b1 = this._itemBtn.getChildAt(0) as egret.Bitmap;
        b1.texture = RES.getRes("boostbg_png");
        egret.Tween.get(this._itemBg).to({ alpha: 0 }, 200).call(() => {
            this._itemBg.visible = false;
        });
        this._itemScene.hide();
    }

    /**
     * 显示结束界面
     */
    public showEndScene() {
        this._endBg.visible = true;
        this._endBg.alpha = 0;
        egret.Tween.get(this._endBg).to({ alpha: 0.7 }, 200);
        var b = this._itemBtn.getChildAt(0) as egret.Bitmap;
        b.texture = RES.getRes("boostbg1_png");
        this._endScene.show();
    }

    /**
     * 隐藏结束界面
     */
    public hideEndScene() {
        var b = this._itemBtn.getChildAt(0) as egret.Bitmap;
        b.texture = RES.getRes("boostbg_png");
        egret.Tween.get(this._endBg).to({ alpha: 0 }, 200).call(() => {
            this._endBg.visible = false;
        });
        this._endScene.hide();
    }


    /**
     * 暂停
     */
    public pause() {
        let gameSene = SceneManager.curScene as GameScene;
        gameSene.pause();
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
        egret.Tween.get(hint).to({ alpha: 1 }, 300).call(() => this.playHint());
    }

    /**
     * 提示
     */
    public playHint() {
        var hint = this._hint;
        var target = 1;
        if (hint.scaleX < 1.1) {
            target = 1.1;
        }
        egret.Tween.get(hint).to({ scaleX: target, scaleY: target }, 500).call(() => this.playHint());
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
     * 增加金币数
     */
    public addCoin(value: number, pos: egret.Point = null): boolean {
        if (PlayerDataManager.addCoin(value)) {
            if (pos) {
                var r = 130;
                for (let i = 0; i < value; i++) {
                    let l = RandomUtils.limit(r * 0.8, r);
                    let a = RandomUtils.limit(0, 2 * Math.PI);
                    let x = pos.x + l * Math.sin(a);
                    let y = pos.y + l * Math.cos(a);
                    this.newCoin(pos, new egret.Point(x, y));
                }
                TimerManager.doTimer(800, 1, () => {
                    this.updateCoin();
                }, this);
            } else {
                this.updateCoin();
            }
            return true;
        }
        return false;
    }

    /** 
     * 设置金币数
     */
    private updateCoin(init: boolean = false) {
        var value = PlayerDataManager.coin;
        var l = MathUtils.log(10, value) + 1;
        if (l >= 4) {
            this._coin.size = Math.floor(45 * 4 / l);
        } else {
            this._coin.size = 45;
        }
        this._coin.text = value.toString();
        if (init) return;
        egret.Tween.get(this._coin).to({ scaleX: 1.2, scaleY: 1.2 }, 150)
            .wait(100)
            .to({ scaleX: 1, scaleY: 1 }, 100);
    }

    /**
     * 生成金币
     */
    private newCoin(start: egret.Point, end: egret.Point) {
        SoundManager.playEffect("coin_mp3");
        var c = this._coinArr.pop();
        if (!c) {
            c = DisplayUtils.createBitmap("coin_png");
            this._coinCon.addChild(c);
        }
        c.visible = true;
        c.x = start.x;
        c.y = start.y;
        egret.Tween.get(c).to({ x: end.x, y: end.y }, 250).wait(200)
            .to({ x: this._coin.x, y: this._coin.y }, 300)
            .call(() => {
                c.visible = false;
                this._coinArr.push(c);
            })
    }

    /**
     * 增加得分
     */
    public addScore(value: number) {
        if (PlayerDataManager.addScore(value)) {
            this._burst.show();
        }
        this._addScore.visible = true;
        this._addScore.alpha = 1;
        this._addScore.text = "+" + value;
        this._addScore.size = this._score.size - 5;
        this._addScore.x = this._score.x;
        this._addScore.y = this._score.y - 35;
        egret.Tween.get(this._addScore).wait(100).to({ alpha: 0.1, y: this._score.y - 25 }, 300)
            .call(() => {
                this._addScore.visible = false;
            });

        this.updateScore();
        this.updateRecord();
    }

    /**
     * 设置得分
     */
    private updateScore(init: boolean = false) {
        var value = PlayerDataManager.score;
        var l = MathUtils.log(10, value) + 1;
        if (l >= 3) {
            this._score.size = Math.floor(40 * 3 / l);
        } else {
            this._score.size = 40;
        }
        this._score.text = value.toString();
        if (init) return;
        egret.Tween.get(this._cup).to({ rotation: -20 }, 200)
            .to({ rotation: 15 }, 200)
            .to({ rotation: -10 }, 200)
            .to({ rotation: 5 }, 200)
            .to({ rotation: 0 }, 200)
    }

    /**
     * 设置记录
     */
    private updateRecord() {
        var value = PlayerDataManager.record;
        var l = MathUtils.log(10, value) + 1;
        if (l >= 3) {
            this._record.size = Math.floor(40 * 3 / l);
        } else {
            this._record.size = 40;
        }
        this._record.text = value.toString();
    }

    /**
     * 设置方块
     */
    public setBlocks(list: Array<number>): number {
        this._blocks = [];
        var duration = 100;
        var w = DataManager.BLOCK_W;
        var s = -list.length * w / 2;
        for (let i: number = 0; i < list.length; i++) {
            TimerManager.doTimer(duration * i, 1, () => {
                let block: Block = ObjectPool.pop("Block");
                block.name = "方块" + i;
                this._blockCon.addChild(block);
                block.init(list[i]);
                block.x = s + w * (i + 0.5);
                block.y = 0;
                this._blocks.push(block);
                block.show(500);
            }, this);
        }
        return duration * this._blocks.length;
    }

    /**
     * 清空方块
     */
    public clearBlocks(): number {
        var duration = 100;
        if (this._blocks && this._blocks.length > 0) {
            for (let i: number = 0; i < this._blocks.length; i++) {
                let block = this._blocks[i];
                TimerManager.doTimer(duration * (this._blocks.length - i - 1), 1, () => {
                    egret.Tween.get(block).to({ alpha: 0.3 }, 100)
                        .call(() => {
                            block.remove();
                        }, this);
                }, this);
            }
        }
        TimerManager.doTimer(duration * this._blocks.length, 1, () => {
            this._blocks = [];
        }, this);
        return duration * this._blocks.length;
    }

    /**
     * 消除方块
     */
    public removeBlocks(direction: number = 1): number {
        var duration = 100;
        if (this._blocks && this._blocks.length > 0) {
            for (let i: number = 0; i < this._blocks.length; i++) {
                let block = this._blocks[i];
                TimerManager.doTimer(duration * i, 1, () => {
                    egret.Tween.get(block).to({ x: block.x, y: block.y + 50 * direction, alpha: 0.3 }, 100)
                        .call(() => {
                            block.remove();
                        }, this);
                }, this);
            }
        }
        TimerManager.doTimer(duration * this._blocks.length, 1, () => {
            this._blocks = [];
        }, this);

        return duration * this._blocks.length;
    }

    /**
     * 设置点击回调
     */
    private setOnTap(btn: egret.DisplayObjectContainer, callBack: Function) {
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            egret.Tween.get(btn).to({ scaleX: 0.95, scaleY: 0.95 }, 120, egret.Ease.quadOut)
                .to({ scaleX: 1, scaleY: 1 }, 80, egret.Ease.quadOut);
            if (callBack) {
                callBack();
            }
        }, this);
        btn.touchEnabled = true;
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
}