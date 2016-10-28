/**
 *
 * logo
 *
 */
class Logo extends egret.DisplayObjectContainer {
    private logo: egret.Bitmap;
    private deluxe: egret.Bitmap;

    public constructor() {
        super();
        var w = StageUtils.stageW;
        var h = StageUtils.stageH;
        this.y = h * 0.35;

        this.logo = DisplayUtils.createBitmap("spritesheet.griddlers-logo");
        this.logo.x = w / 2;
        AnchorUtils.setAnchor(this.logo, 0.5);
        this.addChild(this.logo);

        this.deluxe = DisplayUtils.createBitmap("spritesheet.griddlers-deluxe");
        this.deluxe.x = this.logo.x + 153;
        this.deluxe.y = this.logo.y + 67;
        AnchorUtils.setAnchor(this.deluxe, 0.5);
        this.addChild(this.deluxe);
    }

    private moveTo(y: number, immediately: boolean) {
        if (immediately) {
            this.y = y;
        } else {
            egret.Tween.get(this).to({ y: y }, 1000, egret.Ease.sineInOut);
        }
    }

    public show(immediately: boolean) {
        this.moveTo(StageUtils.stageH * 0.35, immediately);
    }

    public hide(immediately: boolean) {
        this.moveTo(-StageUtils.stageH * 0.2, immediately)
    }
}
