/**
 *
 * @author
 *
 */
var HeroBullet = (function (_super) {
    __extends(HeroBullet, _super);
    function HeroBullet() {
        _super.apply(this, arguments);
    }
    var d = __define,c=HeroBullet,p=c.prototype;
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        var hitItems = this.gameController.CheckHitItem(this);
        var hitStones = this.gameController.CheckHitStone(this);
        if (hitItems.length > 0) {
            this.hitItems(hitItems);
        }
        if (this.hitStones.length > 0) {
            this.hitStones(hitStones);
        }
    };
    p.hitItems = function (items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.ToHero(this.createHero);
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
                stone.Hit(Math.sqrt(this.damage) * 100, direction);
                this.ignoreStones.push(stone);
            }
        }
    };
    p.checkIgnoreStone = function (stone) {
        return this.ignoreStones.indexOf(stone) >= 0;
    };
    d(p, "createHero"
        ,function () {
            return this.creater;
        }
    );
    return HeroBullet;
}(Bullet));
egret.registerClass(HeroBullet,'HeroBullet');
//# sourceMappingURL=HeroBullet.js.map