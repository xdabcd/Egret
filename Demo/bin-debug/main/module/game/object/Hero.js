/**
 *
 * @author
 *
 */
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=Hero,p=c.prototype;
    p.init = function (id) {
        _super.prototype.init.call(this);
        this.id = id;
        var heroData = GameManager.HeroDic[id];
        this.height = heroData.width;
        this.width = heroData.height;
        //设置动画，并装上枪
        this.setAnim(heroData.anim);
        this.setGun(heroData.gun, heroData.gunX, heroData.gunY);
        this.upAs = heroData.upAs;
        this.downAs = heroData.downAs;
        this.isUp = false;
        this.speed = 0;
    };
    p.setAnim = function (anim) {
        if (this.anim == null) {
            this.anim = new egret.MovieClip();
            this.anim.anchorOffsetX = -this.width / 2;
            this.anim.anchorOffsetY = -this.height;
            this.addChild(this.anim);
        }
        var mcData = RES.getRes(anim + "_json");
        var mcTexture = RES.getRes(anim + "_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim.movieClipData = mcDataFactory.generateMovieClipData(anim);
        this.anim.gotoAndPlay(1, -1);
    };
    p.setGun = function (id, x, y) {
        if (this.gun == null) {
            this.gun = new egret.Bitmap;
            this.gun.x = x;
            this.gun.y = y;
            this.addChild(this.gun);
        }
        var gunData = GameManager.GunDic[id];
        this.gun.texture = RES.getRes(gunData.img);
        this.shootInterval = gunData.interval;
        this.shootCd = 0;
        this.bulletId = gunData.bullet;
        this.bulletX = gunData.bulletX;
        this.bulletY = gunData.bulletY;
    };
    p.Shoot = function () {
        if (this.shootCd == 0) {
            this.shootCd = this.shootInterval;
        }
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        var t = time / 1000;
        var as = -this.downAs;
        if (this.isUp) {
            as += this.upAs;
        }
        this.y -= this.speed * t + as * t * t / 2;
        this.speed += as + t;
        if (this.gameController.CheckHeroOut(this)) {
            this.speed = 0;
        }
    };
    d(p, "IsUp",undefined
        ,function (value) {
            this.isUp = value;
        }
    );
    return Hero;
}(BaseGameObject));
egret.registerClass(Hero,'Hero');
var HeroState;
(function (HeroState) {
})(HeroState || (HeroState = {}));
