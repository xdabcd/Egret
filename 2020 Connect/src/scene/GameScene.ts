/**
 *
 * 游戏界面
 *
 */
class GameScene extends BaseScene {
    private lockers: Array<string>;
    private upcoming;
    private board: Board;
    private uiLayer: egret.DisplayObjectContainer;
    private boostersPlace: egret.DisplayObjectContainer;
    private upcomingLayer: egret.DisplayObjectContainer;
    private hand: egret.Bitmap;
    private pauseBtn: Button;
    private boostersHint: egret.TextField;
    private boosterBtn: Button;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        this.lockers = ['start'];
        this.upcoming = [];

        this.addChild(this.board = new Board(this));
        this.board.x = w / 2;
        this.board.y = 120;

        this.addChild(this.uiLayer = new egret.DisplayObjectContainer);
        this.addChild(this.boostersPlace = new egret.DisplayObjectContainer);
        this.boostersPlace.alpha = 0;
        this.addChild(this.upcomingLayer = new egret.DisplayObjectContainer);
        this.addChild(this.hand = DisplayUtils.createBitmap('hand_png'));
        this.hand.alpha = 0;

        this.uiLayer.addChild(this.pauseBtn = ObjectPool.pop("Button"));
        this.pauseBtn.init("btn_pause_png", this.showPause);
        AnchorUtils.setAnchor(this.pauseBtn, 0.5);
        this.pauseBtn.x = 60;
        this.pauseBtn.y = h - 60;

        this.uiLayer.addChild(this.boostersHint = new egret.TextField);
        this.uiLayer.addChild(this.boosterBtn = ObjectPool.pop("Button"));
        this.boosterBtn.init("btn_png", this.showHideBoosters);
        AnchorUtils.setAnchorX(this.boosterBtn, 0.5);
        this.boosterBtn.x = w;
        this.boosterBtn.y = 90;


    }


    private showPause() {

    }

    private showHideBoosters() {

    }
}