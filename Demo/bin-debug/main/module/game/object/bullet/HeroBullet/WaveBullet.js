/**
 *
 * @author
 *
 */
var WaveBullet = (function (_super) {
    __extends(WaveBullet, _super);
    function WaveBullet($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=WaveBullet,p=c.prototype;
    p.init = function (id, creater, moveData) {
        _super.prototype.init.call(this, id, creater, moveData);
        _super.prototype.setImg.call(this, this.bulletData.img);
        this.width = this.bulletData.width;
        this.height = this.bulletData.height;
        this.img.scaleX = this.img.scaleY = 0.3;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        if (this.img.scaleX < 1) {
            this.img.scaleX = this.img.scaleY = Math.min(time / 1000 + this.img.scaleX, 1);
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
    };
    p.outScreen = function () {
        _super.prototype.outScreen.call(this);
    };
    d(p, "rect"
        ,function () {
            var width = this.width * this.img.scaleX;
            var height = this.height * this.img.scaleY;
            return new Rect(this.x + width * 0.4 * this.scaleX, this.y, width * 0.2, height, this.rotation);
        }
    );
    return WaveBullet;
}(HeroBullet));
egret.registerClass(WaveBullet,'WaveBullet');
