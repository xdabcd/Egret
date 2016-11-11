/**
 *
 * 阻止的提示
 *
 */
class ForbidHint extends egret.DisplayObjectContainer {
    private effect: egret.MovieClip;
    private line: egret.Sprite;
    private block: egret.Bitmap;


    public constructor() {
        super();
        this.addChild(this.block = DisplayUtils.createBitmap("disable_png"));
        AnchorUtils.setAnchor(this.block, 0.5);
        this.addChild(this.line = new egret.Sprite);
        this.addChild(this.effect = EffectManager.getEffect("forbid"));
        this.effect.scaleX = this.effect.scaleY = 0.6;
    }

    public show(start: egret.Point, end: egret.Point): number {
        this.visible = true;
        SoundManager.playEffect("blocked_mp3");
        this.effect.x = (start.x + end.x) / 2;
        this.effect.y = (start.y + end.y) / 2;
        this.effect.gotoAndPlay(0);

        this.block.x = end.x;
        this.block.y = end.y;

        var graphics = this.line.graphics;
        graphics.clear();
        graphics.lineStyle(5, 0xF44336);
        graphics.moveTo(start.x, start.y);
        graphics.lineTo(end.x, end.y);

        this.alpha = 1;
        egret.Tween.get(this).to({ alpha: 1 }, 200)
            .wait(800).to({ alpha: 0 }, 250)
            .call(() => {
                this.visible = false;
            }, this);
        return 1300;
    }
}
