/**
 *
 * 按钮列表
 *
 */
class BtnList extends egret.DisplayObjectContainer {
    /** 按钮背景 */
    private _btnBgList: Array<egret.Bitmap>;
    /** 开始按钮 */
    private _startBtn: Button;
    /** 声音按钮 */
    private _soundBtn: Button;
    /** 更多游戏按钮 */
    private _moreBtn: Button;
    /** 重试按钮 */
    private _restryBtn: Button;
    /** 返回菜单按钮 */
    private _homeBtn: Button;

    public constructor() {
        super();
        this._btnBgList = [];
        var posArr = [[0, 0], [0, -173], [149, -83], [149, 83], [0, 173], [-149, 83], [-149, -83]];
        for (let i = 0; i < 7; i++) {
            let btnBg = DisplayUtils.createBitmap("hexabg_png");
            AnchorUtils.setAnchor(btnBg, 0.5);
            btnBg.x = posArr[i][0];
            btnBg.y = posArr[i][1];
            this.addChild(btnBg);
            this._btnBgList.push(btnBg);
        }
        this.addChild(this._startBtn = ObjectPool.pop("Button"));
        this.addChild(this._soundBtn = ObjectPool.pop("Button"));
        this.addChild(this._moreBtn = ObjectPool.pop("Button"));
        this.addChild(this._restryBtn = ObjectPool.pop("Button"));
        this.addChild(this._homeBtn = ObjectPool.pop("Button"));
        this._startBtn.init("red_png", "btn_play_png");
        this._startBtn.setSpriteOffset(7, 0);
        this._startBtn.x = posArr[0][0];
        this._startBtn.y = posArr[0][1];
        this._soundBtn.init("yellow_png", "");
        this._soundBtn.x = posArr[5][0];
        this._soundBtn.y = posArr[5][1];
        PlayerDataManager.registerSoundBtn(this._soundBtn);
        this._soundBtn.setOnTap(() => {
            if (PlayerDataManager.isMute) {
                MISO.trigger("soundOn", null);
            } else {
                MISO.trigger("soundOff", null);
            }
            PlayerDataManager.setMute(!PlayerDataManager.isMute);
        });
        this._moreBtn.init("yellow_png", "game_png");
        this._moreBtn.setSpriteOffset(3, 0);
        this._moreBtn.x = posArr[3][0];
        this._moreBtn.y = posArr[3][1];
        this._moreBtn.setOnTap(() => {
            MISO.trigger("moreGames", null);
        });
        this._restryBtn.init("yellow_png", "retry_png");
        this._restryBtn.x = posArr[4][0];
        this._restryBtn.y = posArr[4][1];
        this._homeBtn.init("yellow_png", "home_png");
        this._homeBtn.x = posArr[3][0];
        this._homeBtn.y = posArr[3][1];
    }

    public hide() {
        this._btnBgList.forEach(bg => {
            bg.visible = false;
        })
        this._startBtn.visible = false;
        this._soundBtn.visible = false;
        this._moreBtn.visible = false;
        this._restryBtn.visible = false;
        this._homeBtn.visible = false;
    }

    public show(scene: string, im: boolean = false) {
        var duration = 100;
        if (im) {
            duration = 0;
        }
        for (let i = 0; i < 7; i++) {
            let bg = this._btnBgList[i];
            TimerManager.doTimer(duration * i, 1, () => {
                bg.visible = true;
                bg.alpha = 0;
                egret.Tween.get(bg).to({ alpha: 1 }, duration * 2);
            }, this);
        }
        TimerManager.doTimer(duration * 8, 1, () => {
            this._startBtn.visible = true;
            this._startBtn.scaleX = this._startBtn.scaleY = 0;
            this._btnBgList[0].visible = false;
            egret.Tween.get(this._startBtn).to({ scaleX: 1, scaleY: 1 }, duration * 4, egret.Ease.elasticOut);
        }, this);
        TimerManager.doTimer(duration * 10, 1, () => {
            this._soundBtn.visible = true;
            this._soundBtn.scaleX = this._soundBtn.scaleY = 0;
            this._btnBgList[5].visible = false;
            egret.Tween.get(this._soundBtn).to({ scaleX: 1, scaleY: 1 }, duration * 4, egret.Ease.elasticOut);
        }, this);
        if (scene == "menu") {
            TimerManager.doTimer(duration * 12, 1, () => {
                this._moreBtn.visible = true;
                this._moreBtn.scaleX = this._moreBtn.scaleY = 0;
                this._btnBgList[3].visible = false;
                egret.Tween.get(this._moreBtn).to({ scaleX: 1, scaleY: 1 }, duration * 4, egret.Ease.elasticOut);
            }, this);
        } else if (scene = "pause") {
            TimerManager.doTimer(duration * 12, 1, () => {
                this._homeBtn.visible = true;
                this._homeBtn.scaleX = this._homeBtn.scaleY = 0;
                this._btnBgList[3].visible = false;
                egret.Tween.get(this._homeBtn).to({ scaleX: 1, scaleY: 1 }, duration * 4, egret.Ease.elasticOut);
            }, this);
            TimerManager.doTimer(duration * 14, 1, () => {
                this._restryBtn.visible = true;
                this._restryBtn.scaleX = this._restryBtn.scaleY = 0;
                this._btnBgList[4].visible = false;
                egret.Tween.get(this._restryBtn).to({ scaleX: 1, scaleY: 1 }, duration * 4, egret.Ease.elasticOut);
            }, this);
        }
    }

    public setStart(callBack: Function) {
        this._startBtn.setOnTap(() => {
            callBack();
        });
    }

    public setRetry(callBack: Function) {
        this._restryBtn.setOnTap(() => {
            callBack();
        });
    }

    public setHome(callBack: Function) {
        this._homeBtn.setOnTap(() => {
            callBack();
        });
    }
}
