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
        this.state = 0;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        this.img.rotation += time;
        switch (this.state) {
            case 0:
                this.speed -= time * 0.9;
                if (this.speed <= 600) {
                    this.state = 1;
                    this.ignoreHeroes = [];
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
                if (this.rect.intersects(this.creater.rect)) {
                    this.remove();
                    this.creater.GunReturn();
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
    p.hitHero = function (heroes) {
        _super.prototype.hitHero.call(this, heroes);
        for (var i = 0; i < heroes.length; i++) {
            this.ignoreHeroes.push(heroes[i]);
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
}(Bullet));
egret.registerClass(BoomerangBullet,'BoomerangBullet');
