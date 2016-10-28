/**
 *
 * 切页按钮
 *
 */
class PageButton extends Button {
    private nr: number

    public constructor() {
        super();
    }

    public initBtn() {
        super.init("");
        this.sprite.texture = RES.getRes("spritesheet.ui_dot_white");
        this.imgLabel.texture = RES.getRes("spritesheet.ui_dot_blue");
        this.imgLabel.alpha = 0;
    }

    /**
     * 设置位置
     */
    public setPos(x: number, y: number, nr: number) {
        this.x = x;
        this.y = y;
        this.nr = nr;
    }

    /**
     * 刷新
     */
    public refresh(page: number) {
        if (this.imgLabel.alpha > 0) {
            egret.Tween.get(this.imgLabel).to({ alpha: 0 }, 300, egret.Ease.sineInOut);
        }
        if (page == this.nr) {
            egret.Tween.get(this.imgLabel).to({ alpha: 1 }, 300, egret.Ease.sineInOut);
        }
    }

    public setHighLight() {
        this.imgLabel.alpha = 1;
    }
}
