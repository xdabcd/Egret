/**
 *
 * 按钮列表
 *
 */
class ButtonGroup extends egret.DisplayObjectContainer {
    private moreBtn: Button;
    private playBtn: Button;
    private soundBtn: Button;

    public constructor() {
        super();
        let w = StageUtils.stageW;
        let h = StageUtils.stageH;
        this.y = h * 0.85;

        var moreBtn: Button = ObjectPool.pop("Button");
        moreBtn.init("spritesheet.griddlers-buttonMoreGames");
        moreBtn.x = 90;
        moreBtn.y = 0;
        moreBtn.setOnTap(() => {
            //TODO
        });
        this.addChild(moreBtn);
        this.moreBtn = moreBtn;

        var playBtn: Button = ObjectPool.pop("Button");
        playBtn.init("spritesheet.Button_Middle");
        playBtn.x = w / 2;
        playBtn.y = 0;
        playBtn.setTextLabel(DataManager.getTxt("PLAY"));
        this.addChild(playBtn);
        this.playBtn = playBtn;

        var soundBtn: Button = ObjectPool.pop("Button");
        soundBtn.init("");
        PlayerDataManager.registerSoundBtn(soundBtn);
        soundBtn.x = w - 90;
        soundBtn.y = 0;
        soundBtn.setOnTap(()=>{
            PlayerDataManager.setMute(!PlayerDataManager.isMute);
        });
        this.addChild(soundBtn);
        this.soundBtn = soundBtn;
    }

    private moveTo(y: number, immediately: boolean) {
        if (immediately) {
            this.y = y;
        } else {
            egret.Tween.get(this).to({ y: y }, 1000, egret.Ease.sineInOut);
        }
    }

    public show(immediately: boolean) {
        this.moveTo(StageUtils.stageH * 0.85, immediately);
    }

    public hide(immediately: boolean) {
        this.moveTo(StageUtils.stageH * 1.2, immediately)
    }

    public setPlay(callBack: Function){
        this.playBtn.setOnTap(callBack);
    }
}
