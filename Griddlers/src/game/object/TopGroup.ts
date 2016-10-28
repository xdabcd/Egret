/**
 *
 * 顶端列表
 *
 */
class TopGroup extends egret.DisplayObjectContainer {
    private backBtn: Button;
    private moreBtn: Button;
    private soundBtn: Button;
    private starCounter: egret.TextField;
    private starCon: egret.DisplayObjectContainer;

    public constructor() {
        super();
        let w = StageUtils.stageW;
        let h = StageUtils.stageH;
        this.y = h * 0.1;

        var backBtn: Button = ObjectPool.pop("Button");
        backBtn.init("spritesheet.griddlers-back");
        backBtn.y = 0;
        this.addChild(backBtn);
        this.backBtn = backBtn;

        var moreBtn: Button = ObjectPool.pop("Button");
        moreBtn.init("spritesheet.griddlers-buttonMoreGames");
        moreBtn.y = 0;
        this.addChild(moreBtn);
        this.moreBtn = moreBtn;

        var soundBtn: Button = ObjectPool.pop("Button");
        soundBtn.init("");
        PlayerDataManager.registerSoundBtn(soundBtn);
        soundBtn.y = 0;
        soundBtn.setOnTap(() => {
            PlayerDataManager.setMute(!PlayerDataManager.isMute);
        });
        this.addChild(soundBtn);
        this.soundBtn = soundBtn;

        var starCon = new egret.DisplayObjectContainer;
        starCon.x = w * 0.58;
        var hl = DisplayUtils.createBitmap("spritesheet.txt_hl");
        hl.x = 0;
        hl.y = 10;
        AnchorUtils.setAnchorY(hl, 0.5);
        starCon.addChild(hl);
        var starCounter = new egret.TextField;
        starCounter.x = 0;
        starCounter.y = 0;
        starCounter.height = 56;
        starCounter.size = 56;
        starCounter.textColor = DataManager.HL_COLOR;
        starCounter.bold = true;
        AnchorUtils.setAnchorX(starCounter, 1);
        AnchorUtils.setAnchorY(starCounter, 0.5);
        starCon.addChild(starCounter);
        var icon = DisplayUtils.createBitmap("spritesheet.griddlers-miniStar");
        icon.x = 5;
        icon.y = -2;
        AnchorUtils.setAnchorY(icon, 0.5);
        starCon.addChild(icon);
        this.addChild(starCon);
        this.starCon = starCon;
        this.starCounter = starCounter;
        this.updateStar();

        this.hide(true);
    }

    private updateStar() {
        this.starCounter.text = PlayerDataManager.getAllStar().toString();
        var hl = this.starCon.getChildAt(0);
        hl.width = this.starCounter.text.length * 45 + 120;
        hl.x = hl.width * -((hl.width - 100) / hl.width);
    }

    private move(obj: egret.DisplayObject, x: number, immediately: boolean) {
        if (immediately) {
            obj.x = x;
        } else {
            egret.Tween.get(obj).to({ x: x }, 1000, egret.Ease.sineInOut);
        }
    }

    private setAlpha(obj: egret.DisplayObject, alpha: number) {
        egret.Tween.get(obj).to({ alpha: alpha }, 1000, egret.Ease.sineInOut);
    }

    public show(immediately: boolean) {
        this.updateStar();

        this.move(this.backBtn, 90, immediately);
        this.move(this.moreBtn, 200, immediately);
        this.move(this.soundBtn, StageUtils.stageW - 90, immediately);
        if (immediately) {
            this.backBtn.alpha = 1;
            this.moreBtn.alpha = 1;
            this.soundBtn.alpha = 1;
            this.starCon.alpha = 1;
        } else {
            this.backBtn.alpha = 0;
            this.setAlpha(this.backBtn, 1);
            this.moreBtn.alpha = 0;
            this.setAlpha(this.moreBtn, 1);
            this.soundBtn.alpha = 0;
            this.setAlpha(this.soundBtn, 1);
            this.starCon.alpha = 0;
            this.setAlpha(this.starCon, 1);
        }
        this.backBtn.touchEnabled = true;
        this.moreBtn.touchEnabled = true;
        this.soundBtn.touchEnabled = true;
    }

    public hide(immediately: boolean) {
        this.move(this.backBtn, Math.floor(-this.backBtn.width * 0.6), immediately);
        this.move(this.moreBtn, Math.floor(-this.moreBtn.width * 0.6), immediately);
        this.move(this.soundBtn, Math.floor(StageUtils.stageW + this.soundBtn.width * 0.6), immediately);
        if (immediately) {
            this.backBtn.alpha = 0;
            this.moreBtn.alpha = 0;
            this.soundBtn.alpha = 0;
            this.starCon.alpha = 0;
        } else {
            this.backBtn.alpha = 1;
            this.setAlpha(this.backBtn, 0);
            this.moreBtn.alpha = 1;
            this.setAlpha(this.moreBtn, 0);
            this.soundBtn.alpha = 1;
            this.setAlpha(this.soundBtn, 0);
            this.starCon.alpha = 1;
            this.setAlpha(this.starCon, 0);
        }
        this.backBtn.touchEnabled = false;
        this.moreBtn.touchEnabled = false;
        this.soundBtn.touchEnabled = false;
    }

    public setBack(callBack: Function) {
        this.backBtn.setOnTap(callBack);
    }
}
