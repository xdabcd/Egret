/**
 *
 * 绘图工具类
 *
 */
class DrawUtils {
    /**
     * 绘制矩形
     */
    public static drawRect(sprite: egret.Sprite, width: number, height: number, color: number) {
        var graphics = sprite.graphics;
        graphics.clear();
        graphics.beginFill(color);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();
    }

    /**
     * 绘制圆角矩形
     */
    public static drawRoundRect(sprite: egret.Sprite, width: number, height: number, ew: number, eh: number, color: number) {
        var graphics = sprite.graphics;
        graphics.clear();
        graphics.beginFill(color);
        graphics.drawRoundRect(0, 0, width, height, ew, eh);
        graphics.endFill();
    }

    /**
     * 绘制直线
     */
    public static drawLine(sprite: egret.Sprite, src: egret.Point, dest: egret.Point, thickness: number, color: number) {
        var graphics = sprite.graphics;
        graphics.clear();
        graphics.lineStyle(thickness, color);
        graphics.moveTo(src.x, src.y);
        graphics.lineTo(dest.x, dest.y);
        sprite.graphics.endFill();
    }
}
