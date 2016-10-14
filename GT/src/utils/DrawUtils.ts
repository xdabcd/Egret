/**
 *
 * 绘图工具类
 *
 */
class DrawUtils {
	/**
     * 绘制矩形
     */
    public static drawRect(width: number, height: number, color: number, fillColor?: number, fillAlpha?: number): egret.Sprite {
        if (fillColor == null) {
            fillColor = color;
        }
        if (fillAlpha == null) {
            fillAlpha = 1;
        }
        var sprite = new egret.Sprite;
        var graphics = sprite.graphics;
        graphics.lineStyle(2, color);
        graphics.beginFill(fillColor, fillAlpha);

        graphics.moveTo(0, 0);
        graphics.lineTo(width, 0);
        graphics.lineTo(width, height);
        graphics.lineTo(0, height);
        graphics.lineTo(0, 0);

        sprite.graphics.endFill();
        return sprite;
    }
}
