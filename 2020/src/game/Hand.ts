/**
 *
 * 手
 *
 */
class Hand extends egret.DisplayObjectContainer {
    private hand: egret.Bitmap;

    public constructor() {
        super();
        this.addChild(this.hand = DisplayUtils.createBitmap("hand_png"));
        this.hand.width /= 2;
        this.hand.height /= 2;
    }

    public show(start: egret.Point, end: egret.Point): number {
        this.visible = true;
        this.hand.x = start.x;
        this.hand.y = start.y;
        var dis = MathUtils.getDistance(start.x, start.y, end.x, end.y);
        var t = dis * 2;
        this.hand.alpha = 0;
        egret.Tween.get(this.hand).to({ alpha: 1 }, 250)
            .to({ scaleX: 0.9, scaleY: 0.9, x: start.x - 5, y: start.y - 5 }, 200)
            .to({ scaleX: 1, scaleY: 1, x: start.x, y: start.y }, 200)
            .to({ x: end.x, y: end.y }, t)
            .to({ scaleX: 0.9, scaleY: 0.9, x: end.x - 5, y: end.y - 5 }, 200)
            .to({ scaleX: 1, scaleY: 1, x: end.x, y: end.y }, 200)
            .to({ alpha: 0 }, 250)
            .call(() => {
                this.visible = false;
            });
        return 1300 + t;
    }
}
