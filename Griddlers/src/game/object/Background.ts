/**
 *
 * 背景
 *
 */
class Background extends egret.DisplayObjectContainer {
    private bg: egret.Bitmap;

    public constructor(){
        super();
        this.bg = DisplayUtils.createBitmap("spritesheet.griddlers-bacground");
        this.bg.scaleX = this.bg.scaleY = StageUtils.stageH / this.bg.height;
        this.addChild(this.bg);
    }
}
