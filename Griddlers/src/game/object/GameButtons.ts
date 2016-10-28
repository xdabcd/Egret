/**
 *
 * 游戏按钮列表
 *
 */
class GameButtons extends egret.DisplayObjectContainer {
    private backBtn: Button;
    private soundBtn: Button;
    private controlBtn: Button;
    private pauseBtn: Button;
    private timeText: egret.TextField;

    public constructor() {
        super();
        let w = StageUtils.stageW;
        let h = StageUtils.stageH;
        this.y = h * 0.07;

        var backBtn: Button = ObjectPool.pop("Button");
        backBtn.init("spritesheet.griddlers-button-Levels");
        backBtn.x = 55;
        backBtn.y = 0;
        backBtn.setOnTap(() => {
            //TODO
            // if (s.EDITORMODE) {
            //     game.state.start("Editor", true, false, s.category, s.levelNr);
            // } else {
            //     s.goBackToMenu()
            // }
        });
        this.addChild(backBtn);
        this.backBtn = backBtn;

        var soundBtn: Button = ObjectPool.pop("Button");
        soundBtn.init("");
        PlayerDataManager.registerSoundBtn(soundBtn);
        soundBtn.x = w - 255;
        soundBtn.y = 0;
        soundBtn.setOnTap(() => {
            PlayerDataManager.setMute(!PlayerDataManager.isMute);
        });
        this.addChild(soundBtn);
        this.soundBtn = soundBtn;

        var controlBtn: Button = ObjectPool.pop("Button");
        controlBtn.init("spritesheet" +
            (PlayerDataManager.isTapControll ? "griddlers-button-SlideControl1" : "griddlers-button-SlideControl2"));
        controlBtn.x = w - 155;
        controlBtn.y = 0;
        controlBtn.setOnTap(() => {
            PlayerDataManager.setControll(!PlayerDataManager.isTapControll);
            controlBtn.setSprite(PlayerDataManager.isTapControll ? "griddlers-button-SlideControl1" : "griddlers-button-SlideControl2");
            //TODO
        });
        this.addChild(controlBtn);
        this.controlBtn = controlBtn;

        var pauseBtn: Button = ObjectPool.pop("Button");
        pauseBtn.init("spritesheet.griddlers-pause");
        pauseBtn.x = w - 55;
        pauseBtn.y = 0;
        pauseBtn.setOnTap(() => {
            //TODO
        });
        this.addChild(pauseBtn);
        this.pauseBtn = pauseBtn;

        var timeText = new egret.TextField;
        timeText.x = 220;
        timeText.y = 0;
        timeText.height = 56;
        timeText.size = 56;
        timeText.textColor = DataManager.HL_COLOR;
        timeText.bold = true;
        timeText.textAlign = "center";
        AnchorUtils.setAnchor(timeText, 0.5);
        this.addChild(timeText);
        this.timeText = timeText;
    }
}
