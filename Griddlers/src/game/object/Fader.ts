/**
 *
 * 
 *
 */
class Fader extends egret.DisplayObjectContainer {
    private sprite: egret.Bitmap;


    public constructor() {
        super();

        this.sprite = DisplayUtils.createBitmap("spritesheet.fader");
        this.sprite.width = StageUtils.stageW;
        this.sprite.height = StageUtils.stageH;
        this.addChild(this.sprite);
        this.touchEnabled = true;
        egret.Tween.get(this.sprite).to({ alpha: 0 }, 1500, egret.Ease.sineInOut)
        TimerManager.doTimer(1000, 1, () => this.touchEnabled = false, this);
    }

    public blink() {
        SoundManager.playEffect("transition_mp3");
        this.touchEnabled = true;
        egret.Tween.get(this.sprite).to({ alpha: 1 }, 500, egret.Ease.sineInOut)
            .to({ alpha: 0 }, 600, egret.Ease.sineInOut);
        TimerManager.doTimer(800, 1, () => this.touchEnabled = false, this);
    };
}
