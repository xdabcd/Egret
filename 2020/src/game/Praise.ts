/**
 *
 * 称赞
 *
 */
class Praise extends egret.DisplayObjectContainer {
    private text: Label;


    public constructor() {
        super();
        this.addChild(this.text = new Label);
        this.text.stroke = 2;
        this.text.strokeColor = 0x000000;
        this.text.size = 45;
    }

    public show(cnt: number, pos: egret.Point): number {
        var s = "";
        this.text.textColor = 0xFFFFFF;
        switch (cnt) {
            case 5:
                s = "Good!";
                break;
            case 6:
                s = "Cool!";
                break;
            case 7:
                s = "Perfect!";
                break;
            case 8:
                s = "Amazing!";
                break;
            case 9:
                s = "Godlike!";
                break;
            case 10:
                s = "Extra!";
                this.text.textColor = 0xFFF236;
                SoundManager.playEffect("extra1_mp3");
                break;
            case 20:
                s = "Extra!";
                this.text.textColor = 0xF44336;
                SoundManager.playEffect("extra2_mp3");
                break;
        }
        if (s == "") {
            return 0;
        }
        if(this.text.textColor == 0xFFFFFF){
            SoundManager.playEffect("shout_mp3");
        }
        this.visible = true;
        this.x = pos.x;
        this.y = pos.y;
        this.text.text = s;
        this.scaleX = this.scaleY = 0;
        this.alpha = 0;
        egret.Tween.get(this).to({ alpha: 1, scaleX: 1, scaleY: 1 }, 350, egret.Ease.backOut)
            .wait(500)
            .to({ alpha: 0, scaleX: 0, scaleY: 0 }, 350, egret.Ease.backIn)
            .call(() => {
                this.visible = false;
            });
        return 1200;
    }
}
