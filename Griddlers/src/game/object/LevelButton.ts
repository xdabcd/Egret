/**
 *
 * 关卡按钮
 *
 */
class LevelButton extends Button {
    private pageNr: number;
    private pageSize: number;
    private levelNr: number;
    private levelInfo: PlayerLevelData;
    private catData: CatData;
    private starIcon: egret.Bitmap;

    public constructor() {
        super();
        this.starIcon = new egret.Bitmap;
        this.starIcon.y = 20;
        AnchorUtils.setAnchorX(this.starIcon, 0.5);
        this.addChild(this.starIcon);
    }

    /**
     * 初始化
     */
    public initBtn(catData: CatData, page: number) {
        super.init("");
        this.catData = catData;
        this.levelNr = this.pageNr + page * this.pageSize;
        this.levelInfo = PlayerDataManager.getLevelInfo(catData.nr, this.levelNr);

        this.starIcon.texture = null;
        this.visible = true;

        if (this.levelInfo == null) {
            this.visible = false;
            return;
        }
        if (this.levelInfo.unlocked) {
            if (this.levelInfo.star > 0) {
                this.sprite.texture = RES.getRes("spritesheet.griddlers-buttonEmty");
                this.starIcon.texture = RES.getRes("spritesheet.lvl-stars-" + this.levelInfo.star);
                this.imgLabel.texture = RES.getRes("miniaturessheet." + catData.name + "-" + this.levelNr);
            } else {
                this.sprite.texture = RES.getRes("spritesheet.griddlers-button----");
            }
        } else {
            this.sprite.texture = RES.getRes("spritesheet.griddlers-button-locked");
        }

        this.addTerm(() => { return this.levelInfo && this.levelInfo.unlocked; });
        AnchorUtils.setAnchor(this.sprite, 0.5);
        AnchorUtils.setAnchor(this.imgLabel, 0.5);
        AnchorUtils.setAnchorX(this.starIcon, 0.5);
    }

    /**
     * 设置位置
     */
    public setPos(x: number, y: number, pageNr: number, pageSize: number) {
        this.x = x;
        this.y = y;
        this.pageNr = pageNr;
        this.pageSize = pageSize;
    }

    /**
     * 刷新
     */
    public refresh(page: number) {
        this.touchEnabled = false;
        var delay: number = this.pageNr / this.pageSize * 400;
        this.scaleX = this.scaleY = 1;
        egret.Tween.get(this).wait(delay).to({ scaleX: 0, scaleY: 0 }, 200, egret.Ease.sineInOut)
            .call(() => {
                this.initBtn(this.catData, page);
                egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 200, egret.Ease.sineInOut)
                    .call(() => { this.touchEnabled = true });
            });
    }
}
