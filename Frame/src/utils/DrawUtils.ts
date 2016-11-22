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
     * 绘制圆矩形
     */
    public static drawRoundRect(sprite: egret.Sprite, w: number, h: number, xel: number, yel: number, color) {
        var graphics = sprite.graphics;
        graphics.clear();

        graphics.beginFill(color);
        graphics.drawRoundRect(0, 0, w, h, xel, yel);
        graphics.endFill();
    }

    /**
     * 绘制空心矩形
     */
    public static drawHollowRect(sprite: egret.Sprite, w: number, h: number, thickness: number, color) {
        var graphics = sprite.graphics;
        graphics.clear();

        graphics.lineStyle(thickness, color);

        graphics.moveTo(thickness / 2, thickness / 2);
        graphics.lineTo(w + thickness / 2, thickness / 2);
        graphics.lineTo(w + thickness / 2, h + thickness / 2);
        graphics.lineTo(thickness / 2, h + thickness / 2);
        graphics.lineTo(thickness / 2, thickness / 2);
    }

    /**
     * 绘制米形
     */
    public static drawMi(sprite: egret.Sprite, length: number, thickness: number, color) {
        var graphics = sprite.graphics;
        graphics.clear();

        graphics.lineStyle(thickness, color);

        graphics.moveTo(thickness / 2, length / 2 + thickness / 2);
        graphics.lineTo(length + thickness / 2, length / 2 + thickness / 2);
        graphics.moveTo(length / 2 + thickness / 2, thickness / 2);
        graphics.lineTo(length / 2 + thickness / 2, length + thickness / 2);
        var a = Math.sin(Math.PI / 4);
        graphics.moveTo(length / 2 * (1 - a) + thickness / 2, length / 2 * (1 - a) + thickness / 2);
        graphics.lineTo(length / 2 * (1 + a) + thickness / 2, length / 2 * (1 + a) + thickness / 2);
        graphics.moveTo(length / 2 * (1 - a) + thickness / 2, length / 2 * (1 + a) + thickness / 2);
        graphics.lineTo(length / 2 * (1 + a) + thickness / 2, length / 2 * (1 - a) + thickness / 2);
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
