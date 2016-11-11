/**
 *
 * @author 
 *
 */
class Orbit extends egret.DisplayObjectContainer {
    private _arr: Array<egret.Bitmap> = [];
    private _target: egret.DisplayObject;
    private _flag: boolean;

    public start(target: egret.DisplayObject) {
        this._target = target;
        this.visible = true;
        this._flag = true;

        TimerManager.doTimer(20, 0, this.update, this);
    }

    private update(t: number) {
        var img: egret.Bitmap;
        if (this._arr.length > 0) {
            img = this._arr.pop();
        } else {
            img = DisplayUtils.createBitmap("smoke_png");
            AnchorUtils.setAnchor(img, 0.5);
            this.addChild(img);
        }
        img.visible = true;
        img.x = this._target.x + RandomUtils.limit(-10, 10);
        img.y = this._target.y + RandomUtils.limit(-10, 10);
        img.alpha = 1;
        img.scaleX = img.scaleY = 2.2;
        var s = 0.2;
        egret.Tween.get(img).to({ scaleX: s, scaleY: s, alpha: 0.4 }, 250).call(() => {
            img.visible = false;
            this._arr.push(img);
            if (!this._flag) {
                this.visible = false;
            }
        });
    }

    public end() {
        TimerManager.remove(this.update, this);
        this._flag = false;
    }
}
