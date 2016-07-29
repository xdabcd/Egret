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
        if (this.side == Side.Own) {
            this.scaleX = 1;
        }
        else if (this.side == Side.Enemy) {
            this.scaleX = -1;
        }
        this.moveData = moveData;
        var bulletData = GameManager.GetBulletData(id);
        this.setImg(bulletData.img);
        this.speed = bulletData.speed;
        this.width = bulletData.width;
        this.height = bulletData.height;
        this.damage = bulletData.damage;
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
        this.x += this.speed * t * this.scaleX;
        //        var bm = new egret.Bitmap(this.img.texture);
        //        bm.scaleX = bm.scaleY = this.img.scaleX;
        //        bm.scaleX *= this.scaleX;
        //        bm.anchorOffsetX = bm.width / 2;
        //        bm.anchorOffsetY = bm.height / 2;
        //        bm.x = this.x + bm.anchorOffsetX * this.scaleX;
        //        bm.y = this.y + bm.anchorOffsetY;
        //        this.parent.addChild(bm);
        //        egret.Tween.get(bm).to({scaleX: this.scaleX * 0.01, scaleY: 0.01, alpha: 0.01}, 200).call(()=>bm.parent.removeChild(bm), this);
        if (this.gameController.CheckHurt(this) || this.gameController.CheckOutScreen(this)) {
            App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.RemoveBullet, this);
        }
    };
    p.GetDamage = function () {
        return this.damage;
    };
    return Bullet;
}(BaseGameObject));
egret.registerClass(Bullet,'Bullet');
