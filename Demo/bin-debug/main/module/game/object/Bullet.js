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
        this.moveData = moveData;
        this.rotation = moveData.direction * this.scaleX;
        this.bulletData = GameManager.GetBulletData(id);
        this.speed = this.bulletData.speed;
        this.ignoreHeroes = [];
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
        var hitHeroes = this.gameController.CheckHitHero(this);
        var hitItems = this.gameController.CheckHitItem(this);
        var outScreen = this.gameController.CheckOutScreen(this);
        var hitStones = this.gameController.CheckHitStone(this);
        if (hitHeroes.length > 0) {
            this.hitHero(hitHeroes);
        }
        if (hitItems.length > 0) {
            this.hitItems(hitItems);
        }
        if (outScreen) {
            this.outScreen();
        }
        if (this.hitStones.length > 0) {
            this.hitStones(hitStones);
        }
    };
    p.hitHero = function (heroes) {
        for (var i = 0; i < heroes.length; i++) {
            var hero = heroes[i];
            if (!this.checkIgnoreHero(hero)) {
                hero.Hurt(this.damage);
                this.doEffect(hero);
            }
        }
    };
    p.hitItems = function (items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.ToHero(this.creater);
        }
    };
    p.hitStones = function (stones) {
        for (var i = 0; i < stones.length; i++) {
            var stone = stones[i];
            if (!this.checkIgnoreStone(stone)) {
                if (this.priority == 1) {
                    this.remove();
                }
                var direction = App.MathUtils.getAngle(App.MathUtils.getRadian2(this.x, this.y, stone.x, stone.y));
                stone.Hit(Math.sqrt(this.damage) * 50, direction);
                this.ignoreStones.push(stone);
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
    p.checkIgnoreHero = function (hero) {
        return this.ignoreHeroes.indexOf(hero) >= 0;
    };
    p.checkIgnoreStone = function (stone) {
        return this.ignoreStones.indexOf(stone) >= 0;
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
    p.doEffect = function (hero) {
    };
    return Bullet;
}(BaseGameObject));
egret.registerClass(Bullet,'Bullet');
