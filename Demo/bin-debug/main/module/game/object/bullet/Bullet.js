/**
 *
 * @author
 *
 */
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=Bullet,p=c.prototype;
    p.init = function (id, creater, moveData) {
        _super.prototype.init.call(this, creater.side);
        this.id = id;
        this.creater = creater;
        if (this.side == Side.Own) {
            this.scaleX = 1;
        }
        else if (this.side == Side.Enemy) {
            this.scaleX = -1;
        }
        else if (this.side == Side.Middle) {
            this.scaleX = 1;
        }
        this.moveData = moveData;
        this.rotation = moveData.direction * this.scaleX;
        this.bulletData = GameManager.GetBulletData(id);
        this.speed = this.bulletData.speed;
        this.ignoreUnits = [];
        this.ignoreStones = [];
    };
    p.setImg = function (img) {
        if (this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.texture = RES.getRes(img);
        this.img.x = this.bulletData.width / 2;
        this.img.y = this.bulletData.height / 2;
        this.img.anchorOffsetX = this.img.width / 2;
        this.img.anchorOffsetY = this.img.height / 2;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        if (this.bulletData.trail != null) {
            this.drawTrail(this.bulletData.trail);
        }
        var t = time / 1000;
        this.x += this.speed * t * Math.cos(this.rotation / 180 * Math.PI) * this.scaleX;
        this.y += this.speed * t * Math.sin(this.rotation / 180 * Math.PI) * this.scaleX;
        if (this.priority == 1) {
            var hitBullets = this.gameController.CheckHitBullet(this);
            if (hitBullets.length > 0) {
                this.remove();
                for (var i = 0; i < hitBullets.length; i++) {
                    var b = hitBullets[i];
                    if (b.priority == 1) {
                        b.remove();
                    }
                }
            }
        }
        var hitUnits = this.gameController.CheckHitUnit(this);
        var outScreen = this.gameController.CheckOutScreen(this);
        if (hitUnits.length > 0) {
            this.hitUnit(hitUnits);
        }
        if (outScreen) {
            this.outScreen();
        }
    };
    p.hitUnit = function (units) {
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            if (!this.checkIgnoreUnit(unit)) {
                unit.Hurt(this.damage);
                this.doEffect(unit);
            }
        }
    };
    p.outScreen = function () {
        this.remove();
    };
    p.remove = function () {
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.RemoveBullet, this);
    };
    p.drawTrail = function (color) {
        if (this.tail == null) {
            this.tail = ObjectPool.pop("Tail");
            this.tail.init(Math.sqrt(this.height) * 3.5, color);
            this.creater.parent.addChild(this.tail);
            this.parent.swapChildren(this.tail, this);
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
    p.checkIgnoreUnit = function (unit) {
        return this.ignoreUnits.indexOf(unit) >= 0;
    };
    d(p, "priority"
        ,function () {
            return this.bulletData.priority;
        }
    );
    d(p, "damage"
        ,function () {
            return this.bulletData.damage;
        }
    );
    p.doEffect = function (unit) {
    };
    p.GetDangerArea = function (targetX, time) {
        var arr = [];
        var s = (targetX - this.x) / Math.cos(this.rotation) - this.width / 2;
        var t = s / this.speed;
        if (t >= 0 && t < time) {
            var targetY = this.y + (targetX - this.x) * Math.tan(this.rotation * Math.PI / 180);
            var min = targetY - this.height / 2 / Math.abs(Math.cos(this.rotation));
            var max = targetY + this.height / 2 / Math.abs(Math.cos(this.rotation));
            arr = [min, max];
        }
        return arr;
    };
    return Bullet;
}(BaseGameObject));
egret.registerClass(Bullet,'Bullet');
//# sourceMappingURL=Bullet.js.map