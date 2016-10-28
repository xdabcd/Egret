/**
 *
 * 关卡类型按钮
 *
 */
class CatButton extends Button {
    private catInfo: PlayerCatData;
    public catData: CatData;
    private m: egret.Sprite;
    private lockIcon: egret.Bitmap;
    private starIcon: egret.Bitmap;

    public constructor() {
        super();

        this.m = new egret.Sprite;
        this.addChild(this.m);

        this.lockIcon = DisplayUtils.createBitmap("spritesheet.griddlers-lock");
        this.lockIcon.x = -this.lockIcon.width - 35;
        this.lockIcon.y = -this.lockIcon.height * 0.5;
        this.addChild(this.lockIcon);
        this.starIcon = DisplayUtils.createBitmap("spritesheet.griddlers-miniStar");
        this.starIcon.x = 35;
        this.starIcon.y = -this.starIcon.height * 0.48;
        this.addChild(this.starIcon);
    }

    /**
    * 初始化
    */
    public initBtn(catData: CatData) {
        super.init("");
        this.catData = catData;
        this.catInfo = PlayerDataManager.getCategoryInfo(catData);
        this.m.graphics.clear();

        if (this.catInfo.unlock) {
            this.sprite.texture = RES.getRes("spritesheet.griddlers-buttonEmtyLongGreen");
            this.setTextLabel(DataManager.getTxt(this.catData.name));

            this.lockIcon.visible = false;
            this.starIcon.visible = false;
        } else {
            this.sprite.texture = RES.getRes("spritesheet.griddlers-buttonEmtyLongGrey");

            this.imgLabel.texture = RES.getRes("spritesheet.griddlers-buttonEmtyLongNoShadow");
            DrawUtils.drawRect(this.m, this.catInfo.unlockProgress * this.imgLabel.width, this.imgLabel.height, 0x000000);
            this.m.x = -this.imgLabel.width / 2;
            this.m.y = -this.imgLabel.height / 2;
            this.imgLabel.mask = this.m;
            this.setTextLabel(this.catData.unlock.toString());

            this.lockIcon.visible = true;
            this.starIcon.visible = true;
        }

        this.addTerm(() => { return this.catInfo && this.catInfo.unlock; });
    }
}
