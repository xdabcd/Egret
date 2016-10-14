/**
 *
 * @author
 *
 */
var Item = (function (_super) {
    __extends(Item, _super);
    function Item($controller) {
        _super.call(this, $controller);
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
        this.img.texture = RES.getRes(img);
        this.img.x = 30;
        this.img.y = 30;
        this.img.anchorOffsetX = this.img.width / 2;
        this.img.anchorOffsetY = this.img.height / 2;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
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
            this.remove();
        }
    };
    p.ToHero = function (hero) {
        this.state = 2;
        this.speed = 1000;
        this.target = hero;
        this.setImg(this.itemData.drop);
    };
    p.remove = function () {
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.RemoveItem, this);
    };
    p.drawTrail = function (color) {
        if (this.tail == null) {
            this.tail = ObjectPool.pop("Tail");
            this.tail.init(Math.sqrt(this.height) * 3.5, color);
            this.parent.addChild(this.tail);
        }
        this.tail.addPoint(this.x, this.y);
    };
    p.clearTail = function () {
        this.tail.clear();
        this.tail = null;
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        if (this.tail != null) {
            this.clearTail();
        }
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
                return (new Rect(-10000, -10000, 0, 0, this.rotation));
            }
            return new Rect(this.x, this.y, width, height, this.rotation);
        }
    );
    return Item;
}(BaseGameObject));
egret.registerClass(Item,'Item');
//# sourceMappingURL=Item.js.map