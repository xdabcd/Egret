/**
 *
 * @author
 *
 */
var Item = (function (_super) {
    __extends(Item, _super);
    function Item($controller) {
        _super.call(this, $controller);
        this.mPoints = [];
    }
    var d = __define,c=Item,p=c.prototype;
    p.init = function (id, side, direction) {
        _super.prototype.init.call(this, side);
        this.id = id;
        this.direction = direction;
        this.width = 60;
        this.height = 60;
        this.itemData = GameManager.GetItemData(id);
        this.speed = this.itemData.speed;
        this.setImg(this.itemData.img);
        this.state = 1;
    };
    p.setImg = function (img) {
        if (this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.rotation = 0;
        this.img.texture = RES.getRes(img);
        this.img.x = 30;
        this.img.y = 30;
        this.img.anchorOffsetX = this.img.width / 2;
        this.img.anchorOffsetY = this.img.height / 2;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        if (this.sh == null) {
            this.sh = new egret.Shape();
            this.parent.addChild(this.sh);
            this.mg = this.sh.graphics;
        }
        var t = time / 1000;
        switch (this.state) {
            case 1:
                if (this.direction == 0) {
                    this.y += this.speed * t;
                }
                else {
                    this.y -= this.speed * t;
                }
                break;
            case 2:
                this.drawTrail(0xffffff);
                this.speed += time * 0.9;
                var r = App.MathUtils.getRadian2(this.x, this.y, this.target.x, this.target.y);
                if (this.scaleX == -1) {
                    r = App.MathUtils.getRadian2(this.target.x, this.target.y, this.x, this.y);
                }
                var a = App.MathUtils.getAngle(r);
                this.rotation = a;
                this.x += this.speed * t * Math.cos(this.rotation / 180 * Math.PI) * this.scaleX;
                this.y += this.speed * t * Math.sin(this.rotation / 180 * Math.PI) * this.scaleX;
                if (App.MathUtils.getDistance(this.x, this.y, this.target.x, this.target.y) < 10) {
                    this.remove();
                    this.target.ChangeGun(this.itemData.awardGun);
                }
                break;
        }
        if (this.gameController.CheckOutScreen(this)) {
            App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.RemoveItem, this);
        }
    };
    p.ToHero = function (hero) {
        this.state = 2;
        this.speed = 1000;
        this.target = hero;
        this.setImg(this.itemData.drop);
    };
    p.drawTrail = function (color) {
        var mPenSize = Math.sqrt(this.height) * 3.5;
        var obj = { sx: this.x, sy: this.y, size: mPenSize };
        this.mPoints.push(obj);
        if (this.mPoints.length == 0)
            return;
        this.mg.clear();
        var _count = this.mPoints.length;
        for (var i = 0; i < _count; i++) {
            var pt = this.mPoints[i];
            pt.size -= 2;
            if (pt.size < 0) {
                this.mPoints.splice(i, 1);
                i--;
                _count = this.mPoints.length;
            }
        }
        _count = this.mPoints.length;
        var alpha = 0.1;
        for (i = 1; i < _count; i++) {
            var p = this.mPoints[i];
            var count = 5;
            var sx = this.mPoints[i - 1].sx;
            var sy = this.mPoints[i - 1].sy;
            var sx1 = p.sx;
            var sy1 = p.sy;
            var size = this.mPoints[i - 1].size;
            var size1 = p.size;
            for (var j = 0; j < count; j++) {
                this.mg.lineStyle(size + (size1 - size) / count * j, color, alpha);
                this.mg.moveTo(sx + (sx1 - sx) / count * j, sy + (sy1 - sy) / count * j);
                this.mg.lineTo(sx + (sx1 - sx) / count * (j + 1), sy + (sy1 - sy) / count * (j + 1));
                alpha += 0.002;
            }
        }
    };
    p.remove = function () {
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.RemoveItem, this);
    };
    p.clearMg = function () {
        this.mg.clear();
        this.mPoints = [];
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.clearMg();
    };
    d(p, "rect"
        ,function () {
            var width;
            var height;
            if (this.state == 1) {
                width = this.width;
                height = this.height;
            }
            else {
                return (new egret.Rectangle(-10000, -10000, 0, 0));
            }
            return new egret.Rectangle(this.x - width / 2, this.y - height / 2, width, height);
        }
    );
    return Item;
}(BaseGameObject));
egret.registerClass(Item,'Item');
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Stone"] = 0] = "Stone";
    ItemType[ItemType["Gun"] = 1] = "Gun";
})(ItemType || (ItemType = {}));
