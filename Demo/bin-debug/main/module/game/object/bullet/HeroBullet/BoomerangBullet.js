/**
 *
 * 回旋镖
 *
 */
var BoomerangBullet = (function (_super) {
    __extends(BoomerangBullet, _super);
    function BoomerangBullet($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=BoomerangBullet,p=c.prototype;
    p.init = function (id, creater, moveData) {
        _super.prototype.init.call(this, id, creater, moveData);
        _super.prototype.setImg.call(this, this.bulletData.img);
        this.width = this.bulletData.width;
        this.height = this.bulletData.height;
        this.targetX = this.gameController.GetPerX(0.5 + 0.45 * this.scaleX);
        this.state = 0;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        this.img.rotation += time;
        switch (this.state) {
            case 0:
                this.speed -= time * 0.9;
                if (this.scaleX > 0 && this.x >= this.targetX || this.scaleX < 0 && this.x <= this.targetX) {
                    this.state = 1;
                    this.ignoreUnits = [];
                    this.ignoreStones = [];
                }
                break;
            case 1:
                this.speed += time * 0.9;
                var r = App.MathUtils.getRadian2(this.x, this.y, this.creater.x, this.creater.y);
                if (this.scaleX == -1) {
                    r = App.MathUtils.getRadian2(this.creater.x, this.creater.y, this.x, this.y);
                }
                var a = App.MathUtils.getAngle(r);
                this.rotation = a;
                var rect = new Rect(this.creater.x, this.creater.y, this.creater.width, this.creater.height, 0);
                if (this.rect.intersectTo(rect)) {
                    this.remove();
                    this.createHero.GunReturn();
                }
                break;
            case 2:
                this.speed += time;
                var targetR = 90;
                var curR = this.rotation;
                if (this.rotation < 0) {
                    curR += 360;
                }
                if (this.scaleX == -1) {
                    targetR = -90;
                    if (curR > 180) {
                        targetR = 270;
                    }
                }
                if (curR > targetR) {
                    this.rotation = Math.max(targetR, curR - time / 5);
                }
                else {
                    this.rotation = Math.min(targetR, curR + time / 5);
                }
                break;
        }
    };
    p.hitUnit = function (units) {
        _super.prototype.hitUnit.call(this, units);
        for (var i = 0; i < units.length; i++) {
            this.ignoreUnits.push(units[i]);
        }
    };
    p.hitItems = function (items) {
        _super.prototype.hitItems.call(this, items);
        this.state = 2;
    };
    p.outScreen = function () {
        _super.prototype.outScreen.call(this);
    };
    return BoomerangBullet;
}(HeroBullet));
egret.registerClass(BoomerangBullet,'BoomerangBullet');
