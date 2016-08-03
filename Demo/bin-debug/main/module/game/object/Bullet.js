/**
 *
 * @author
 *
 */
var BulletState;
(function (BulletState) {
    BulletState[BulletState["Shoot"] = 0] = "Shoot";
    BulletState[BulletState["Go"] = 1] = "Go";
    BulletState[BulletState["Return"] = 2] = "Return";
    BulletState[BulletState["Fall"] = 3] = "Fall";
    BulletState[BulletState["Ready"] = 4] = "Ready";
})(BulletState || (BulletState = {}));
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet($controller) {
        _super.call(this, $controller);
        this.mPoints = [];
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
        this.rotation = moveData.direction;
        this.bulletData = GameManager.GetBulletData(id);
        this.setImg(this.bulletData.img);
        this.width = this.bulletData.width;
        this.height = this.bulletData.height;
        this.speed = this.bulletData.speed;
        switch (this.bulletData.type) {
            case BulletType.Normal:
                this.state = BulletState.Shoot;
                break;
            case BulletType.Spin:
                this.state = BulletState.Shoot;
                break;
            case BulletType.Boomerang:
                this.state = BulletState.Go;
                break;
            case BulletType.Laser:
                this.state = BulletState.Ready;
                break;
        }
        this.ignoreHeroes = [];
        if (this.sh == null) {
            this.sh = new egret.Shape();
            this.creater.parent.addChild(this.sh);
            this.mg = this.sh.graphics;
        }
    };
    p.setImg = function (img) {
        if (this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.rotation = 0;
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
        switch (this.state) {
            case BulletState.Shoot:
                break;
            case BulletState.Go:
                this.speed -= time * 0.9;
                if (this.speed <= 700) {
                    this.state = BulletState.Return;
                    this.ignoreHeroes = [];
                }
                break;
            case BulletState.Return:
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
            case BulletState.Fall:
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
            case BulletState.Ready:
                this.speed = 0;
                break;
        }
        var hitHeroes = this.gameController.CheckHitHero(this);
        var hitItem = this.gameController.CheckHitItem(this);
        var outScreen = this.gameController.CheckOutScreen(this);
        switch (this.bulletData.type) {
            case BulletType.Normal:
                if (hitHeroes.length > 0 || hitItem || outScreen) {
                    this.remove();
                }
                break;
            case BulletType.Spin:
                this.img.rotation += time;
                if (hitHeroes.length > 0 || hitItem || outScreen) {
                    this.remove();
                }
                break;
            case BulletType.Boomerang:
                this.img.rotation += time;
                if (hitItem) {
                    this.state = BulletState.Fall;
                }
                else if (outScreen) {
                    this.remove();
                }
                if (hitHeroes.length > 0) {
                    for (var i = 0; i < hitHeroes.length; i++) {
                        this.ignoreHeroes.push(hitHeroes[i]);
                    }
                }
                break;
        }
    };
    p.remove = function () {
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.RemoveBullet, this);
    };
    p.drawTrail = function (color) {
        var mPenSize = this.height * 0.5;
        var obj = { sx: this.x, sy: this.y, size: mPenSize };
        this.mPoints.push(obj);
        if (this.mPoints.length == 0)
            return;
        this.mg.clear();
        var _count = this.mPoints.length;
        for (var i = 0; i < _count; i++) {
            var pt = this.mPoints[i];
            pt.size -= 1;
            if (pt.size < 6) {
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
    p.clearMg = function () {
        this.mg.clear();
        this.mPoints = [];
    };
    p.destory = function () {
        _super.prototype.destory.call(this);
        this.clearMg();
    };
    p.CheckIgnore = function (hero) {
        return this.ignoreHeroes.indexOf(hero) >= 0;
    };
    p.GetDamage = function () {
        return this.bulletData.damage;
    };
    p.GetCreater = function () {
        return this.creater;
    };
    return Bullet;
}(BaseGameObject));
egret.registerClass(Bullet,'Bullet');
