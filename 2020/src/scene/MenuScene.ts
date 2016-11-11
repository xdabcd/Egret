/**
 *
 * 菜单界面
 *
 */
class MenuScene extends BaseScene {
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
        }

        this.addChild(new Bubble());

        if (!this._title) {
            this.addChild(this._title = DisplayUtils.createBitmap("Hexagonal_png"));
            AnchorUtils.setAnchor(this._title, 0.5);
        }

        if (!this._btnList) {
            this.addChild(this._btnList = ObjectPool.pop("BtnList"));
            this._btnList.setStart(() => { SceneManager.enterScene(Scene.Game) });
        }
        this._btnList.hide();
        TimerManager.doTimer(200, 1, () => { this._btnList.show("menu"); }, this);

        this.onResize();
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
}