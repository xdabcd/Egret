/**
 *
 * 关卡列表
 *
 */
class LevelsGroup extends egret.DisplayObjectContainer {
    private pages: number;
    private page: number;
    private levels: Array<LevelButton>;
    private rows: Array<egret.DisplayObjectContainer>;
    private pageButtons: egret.DisplayObjectContainer;
    private changeLock: boolean = false;

    public constructor() {
        super();

        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        this.rows = [];
        this.levels = [];
        for (let i: number = 0; i < 4; i++) {
            let row = new egret.DisplayObjectContainer;
            this.rows.push(row);
            row.y = h * (0.3 + i * 0.16);
            row.x = w;

            for (let j: number = 0; j < 4; j++) {
                let level: LevelButton = ObjectPool.pop("LevelButton");
                level.setPos(w * ((1 - 0.4) / 3 * j + 0.2), 0, i * 4 + j, 16);
                row.addChild(level);
                level.touchEnabled = false;
                level.setOnTap(() => {
                    //TODO
                });
                this.levels.push(level);
            }
            this.addChild(row);
        }

        this.pageButtons = new egret.DisplayObjectContainer;
        this.pageButtons.y = h * 0.9;
        this.addChild(this.pageButtons);
        this.visible = false;
    }

    public init(catData: CatData, page: number) {
        this.levels.forEach(level => level.initBtn(catData, page));

        var w = StageUtils.stageW;
        this.pages = Math.ceil(catData.levels.length / 16);
        this.page = page;

        if (this.pages > 1) {
            var xx = w / 2 + ((this.pages - 2) * 38 * -0.5);
            for (let i = 0; i < this.pages; i++) {
                let pageBtn: PageButton = ObjectPool.pop("PageButton");
                pageBtn.initBtn();
                pageBtn.setPos(xx, 0, i);
                if (page == i) {
                    pageBtn.setHighLight();
                }
                pageBtn.setOnTap(() => this.changePage(i));
                this.pageButtons.addChild(pageBtn);
                xx += 38;
            }
        }
    }

    public show(catData: CatData, immediately: boolean, lastLevel: number) {
        this.visible = true;
        var passedLevels = lastLevel || Math.min(catData.levels.length - 1, PlayerDataManager.getNumberOfPassedLevels(catData.nr));
        let w = StageUtils.stageW;

        this.init(catData, Math.floor(passedLevels / 16));
        this.rows.forEach(row => row.x = w);
        this.pageButtons.x = w;

        var targetX = 0;

        if (immediately) {
            this.rows.forEach(row => {
                row.x = targetX;
                if (DeviceUtils.IsPC) row.alpha = 1;
                row.$children.forEach(level => {
                    level.touchEnabled = true;
                })
            });

            this.pageButtons.x = targetX;
        } else {
            var delayIncrease = Math.floor(250 / 5);
            var delay = 250;
            this.rows.forEach(row => {
                if (DeviceUtils.IsPC) {
                    row.alpha = 0;
                    egret.Tween.get(row).wait(delay).to({ alpha: 1 }, 500, egret.Ease.sineInOut);
                }
                egret.Tween.get(row).wait(delay).to({ x: targetX }, 500, egret.Ease.sineInOut);
                delay += delayIncrease;
                row.$children.forEach(level => {
                    level.touchEnabled = true;
                })
            });

            egret.Tween.get(this.pageButtons).wait(delay).to({ x: targetX }, 500, egret.Ease.sineInOut);
            if (DeviceUtils.IsPC) {
                this.pageButtons.alpha = 0;
                egret.Tween.get(this.pageButtons).wait(delay).to({ alpha: 1 }, 500, egret.Ease.sineInOut);
            }
        }
    }

    public hide(immediately: boolean) {
        let w = StageUtils.stageW;
        if (immediately) {
            this.x = w / 2;
            this.visible = false;
            this.pageButtons.$children.forEach(btn => {
                ObjectPool.push(btn);
            });
            this.pageButtons.removeChildren();
        } else {
            var delayIncrease = Math.floor(250 / 5);
            var delay = 250;
            this.rows.forEach(row => {
                if (DeviceUtils.IsPC) {
                    row.alpha = 1;
                    egret.Tween.get(row).wait(delay).to({ alpha: 0 }, 500, egret.Ease.sineInOut);
                }

                egret.Tween.get(row).wait(delay).to({ x: w }, 500, egret.Ease.sineInOut);
                delay += delayIncrease;

                row.$children.forEach(level => {
                    level.touchEnabled = false;
                })
            });

            egret.Tween.get(this.pageButtons).wait(delay).to({ x: w }, 500, egret.Ease.sineInOut)
                .call(() => {
                    this.pageButtons.$children.forEach(btn => {
                        ObjectPool.push(btn);
                    });
                    this.pageButtons.removeChildren();
                    this.visible = false;
                }, this);
            if (DeviceUtils.IsPC) {
                this.pageButtons.alpha = 1;
                egret.Tween.get(this.pageButtons).wait(delay).to({ alpha: 0 }, 500, egret.Ease.sineInOut);
            }
        }
    }

    public changePage(page: number) {
        if (this.changeLock) return;
        if (page >= 0 && page < this.pages && page != this.page) {
            this.page = page;
            this.levels.forEach(level => {
                level.refresh(page);
            });

            this.pageButtons.$children.forEach(child => {
                (child as PageButton).refresh(page);
            });
        }

        this.changeLock = true;
        TimerManager.doTimer(600, 1, () => {
            this.changeLock = false;
        }, this);
    }
}
