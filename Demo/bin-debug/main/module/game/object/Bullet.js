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
    p.init = function (id, side, moveData) {
        _super.prototype.init.call(this, side);
        this.id = id;
        this.moveData = moveData;
        var bulletData = GameManager.GetBulletData(id);
        this.setImg(bulletData.img);
        this.speed = bulletData.speed;
        this.width = bulletData.width;
        this.height = bulletData.height;
    };
    p.setImg = function (img) {
        if (this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.texture = RES.getRes(img);
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        var t = time / 1000;
        this.x += this.speed * t;
        if (this.gameController.CheckOutScreen(this)) {
            App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.RemoveBullet, this);
        }
    };
    return Bullet;
}(BaseGameObject));
egret.registerClass(Bullet,'Bullet');
