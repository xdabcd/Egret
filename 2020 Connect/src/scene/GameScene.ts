/**
 *
 * 游戏界面
 *
 */
class GameScene extends BaseScene {

    /**
     * 初始化
     */
    protected init() {
        super.init();

        var sprite = DisplayUtils.createBitmap("cell_png");
        this.addChild(sprite);
        var colorMatrix = [
            1, 0, 0, 0, 255,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 255,
            0, 0, 0, 1, 0
        ];

        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        sprite.filters = [colorFlilter];
    }
}