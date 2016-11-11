/**
 *
 * 暂停界面
 *
 */
class PauseScene extends BaseScene {
    /** 背景 */
    private _bg: egret.Bitmap;
    /** 标题 */
    private _title: egret.Bitmap;
    /** 按钮 */
    private _btnList: BtnList;

    /**
     * 初始化
     */
    protected init() {
        super.init();

        if (!this._bg) {
            this.addChild(this._bg = DisplayUtils.createBitmap("bg_png"));
            this._bg.touchEnabled = true;
        }

        if (!this._title) {
            this.addChild(this._title = DisplayUtils.createBitmap("pausetext_png"));
            AnchorUtils.setAnchor(this._title, 0.5);
        }

        if (!this._btnList) {
            this.addChild(this._btnList = ObjectPool.pop("BtnList"));
            this._btnList.setStart(() => { this.hide(); });
            this._btnList.setRetry(() => { this.retry(); });
            this._btnList.setHome(() => { this.home(); });
        }
        this.onResize();
        this._btnList.hide();
        this._btnList.show("pause", true);
    }

    protected onResize() {
        super.onResize();

        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        this._bg.width = w;
        this._bg.height = h;
        this._title.x = w / 2;
        this._title.y = 190;
        this._btnList.x = w / 2;
        this._btnList.y = h / 2;
    }

    public show() {
        SoundManager.playEffect("popup_mp3");
        this.visible = true;
        this._bg.alpha = 0;
        this._title.alpha = 0;
        egret.Tween.get(this._bg).to({ alpha: 1 }, 200);
        egret.Tween.get(this._title).to({ alpha: 1 }, 200);
        this._btnList.scaleX = this._btnList.scaleY = 0;
        egret.Tween.get(this._btnList).to({ scaleX: 1, scaleY: 1 }, 500, egret.Ease.elasticOut);
    }

    public hide() {
        this._bg.alpha = 1;
        this._title.alpha = 1;
        egret.Tween.get(this._btnList).to({ scaleX: 0, scaleY: 0 }, 500, egret.Ease.elasticIn).call(() => {
            this.visible = false;
        });
        TimerManager.doTimer(400, 1, () => {
            egret.Tween.get(this._bg).to({ alpha: 0 }, 200);
            egret.Tween.get(this._title).to({ alpha: 0 }, 200);
        }, this);
    }

    public retry() {
        this.hide();
        TimerManager.doTimer(300, 1, () => {
            let gameSene = SceneManager.curScene as GameScene;
            gameSene.restart();
        }, this);
    }

    public home() {
        this.hide();
        TimerManager.doTimer(300, 1, () => {
            SceneManager.enterScene(Scene.Menu);
        }, this);
    }
}