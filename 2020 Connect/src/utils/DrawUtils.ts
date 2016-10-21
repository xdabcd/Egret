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
        graphics.endFill();
    }

    /**
     * 绘制矩形
     */
    public static drawRect(sprite: egret.Sprite, w: number, h: number, color) {
        var graphics = sprite.graphics;
        graphics.clear();

        graphics.beginFill(color);
        graphics.drawRect(0, 0, w, h);
        graphics.endFill();
    }

    /**
     * 绘制圆形
     */
    public static drawCircle(sprite: egret.Sprite, r: number, color) {
        var graphics = sprite.graphics;
        graphics.clear();

        graphics.beginFill(color);
        graphics.drawCircle(0, 0, r);
        graphics.endFill();
    }
}
