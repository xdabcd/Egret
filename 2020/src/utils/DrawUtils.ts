/**
 *
 * 绘图工具类
 *
 */
class DrawUtils {
    /**
     * 绘制圆角六边形
     */
    public static drawRoundHexagon(sprite: egret.Sprite, r: number, e: number, color) {
        var graphics = sprite.graphics;
        graphics.clear();

        graphics.lineStyle(e, color);
        graphics.beginFill(color);

        r -= Math.ceil(e / 2);
        graphics.moveTo(- r / 2, - r * Math.sqrt(3) / 2);
        graphics.lineTo(r / 2, - r * Math.sqrt(3) / 2);
        graphics.lineTo(r, 0);
        graphics.lineTo(r / 2, r * Math.sqrt(3) / 2);
        graphics.lineTo(- r / 2, r * Math.sqrt(3) / 2);
        graphics.lineTo(-r, 0);
        graphics.lineTo(- r / 2, - r * Math.sqrt(3) / 2);
        sprite.graphics.endFill();
    }
}
