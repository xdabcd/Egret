/**
 * 
 * 游戏界面
 * 
 */
class GameScene extends BaseScene {
    public constructor() {
        super();
        this._controller = new GameController(this);
    }

    private _grid: Grid;

    /**
     * 初始化
     */
    protected init() {
        this.addChild(this._grid = new Grid);
    }

    /**
     * 屏幕尺寸变化时调用
     */
    protected onResize(): void {
        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        this._grid.x = w / 2;
        this._grid.y = h / 2;
    }

    /**
     * 打开
     */
    public open(...param: any[]): void {
        super.open();
        this.onResize();

        this.applyControllerFunc(ControllerID.Grid, GameCmd.GAME_START);
    }

    /**
     * 关闭
     */
    public close(...param: any[]): void {
        super.close();

    }
}