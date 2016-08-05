/**
 *
 * 手榴弹
 *
 */
var GrenadeBullet = (function (_super) {
    __extends(GrenadeBullet, _super);
    function GrenadeBullet($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=GrenadeBullet,p=c.prototype;
    p.init = function (id, creater, moveData) {
        _super.prototype.init.call(this, id, creater, moveData);
        _super.prototype.setImg.call(this, this.bulletData.img);
        this.width = this.bulletData.width;
        this.height = this.bulletData.height;
        var info = this.bulletData.info;
        this.releaseTime = info.releaseTime;
        this.stayTime = info.stayTime;
        this.displayTime = info.displayTime;
        this.setBombImg(info.bombImg);
        this.bombImg.visible = false;
        this.targetX = this.gameController.GetPerX(0.5 + 0.3 * this.scaleX);
        this.targetY = null;
        this.state = 1;
        this.img.visible = true;
    };
    p.setBombImg = function (img) {
        if (this.bombImg == null) {
            this.bombImg = new egret.Bitmap;
            this.addChild(this.bombImg);
        }
        this.bombImg.texture = RES.getRes(img);
        this.bombImg.x = this.bulletData.width / 2;
        this.bombImg.y = this.bulletData.height / 2;
        this.bombImg.anchorOffsetX = this.bombImg.width / 2;
        this.bombImg.anchorOffsetY = this.bombImg.height / 2;
    };
    p.update = function (time) {
        if (this.targetY == null) {
            this.targetY = this.y;
            this.flyTime = Math.abs(this.targetX - this.x) / this.speed;
            this.rotationChange = -this.rotation * 2 / this.flyTime;
        }
        this.speed /= Math.cos(this.rotation / 180 * Math.PI);
        _super.prototype.update.call(this, time);
        var t = time / 1000;
        switch (this.state) {
            case 1:
                this.flyTime -= t;
                if (this.flyTime <= 0) {
                    this.bomb();
                }
                else {
                    this.rotation += t * this.rotationChange;
                    this.speed = this.bulletData.speed;
                }
                break;
            case 2:
                this.bombImg.scaleX = this.bombImg.scaleY += t * (0.8 / this.releaseTime);
                if (this.bombImg.scaleX >= 1) {
                    this.state = 3;
                }
                break;
            case 3:
                this.stayTime -= t;
                if (this.stayTime <= 0) {
                    this.state = 4;
                }
                break;
            case 4:
                this.bombImg.scaleX = this.bombImg.scaleY -= t * (0.5 / this.displayTime);
                if (this.bombImg.scaleX <= 0.5) {
                    this.remove();
                }
                break;
        }
    };
    p.bomb = function () {
        this.speed = 0;
        this.state = 2;
        this.img.visible = false;
        this.bombImg.visible = true;
        this.bombImg.scaleX = this.bombImg.scaleY = 0.2;
    };
    p.hitHero = function (heroes) {
        _super.prototype.hitHero.call(this, heroes);
        if (this.state == 1) {
            this.bomb();
        }
        else {
            for (var i = 0; i < heroes.length; i++) {
                this.ignoreHeroes.push(heroes[i]);
            }
        }
    };
    p.hitItems = function (items) {
        _super.prototype.hitItems.call(this, items);
        if (this.state == 1) {
            this.bomb();
        }
    };
    p.outScreen = function () {
        if (this.state != 1) {
            _super.prototype.outScreen.call(this);
        }
    };
    p.getDamage = function () {
        if (this.state == 1) {
            return 0;
        }
        return this.bulletData.damage;
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
                width = this.bombImg.width * this.bombImg.scaleX;
                height = this.bombImg.height * this.bombImg.scaleY;
            }
            return new egret.Rectangle(this.x - width / 2, this.y - width / 2, width, height);
        }
    );
    return GrenadeBullet;
}(Bullet));
egret.registerClass(GrenadeBullet,'GrenadeBullet');
