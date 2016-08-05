/**
 *
 * @author
 *
 */
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero($controller) {
        _super.call(this, $controller);
        this.hpArr = [];
    }
    var d = __define,c=Hero,p=c.prototype;
    p.init = function (id, side) {
        _super.prototype.init.call(this, side);
        this.id = id;
        if (this.side == Side.Own) {
            this.scaleX = 1;
        }
        else if (this.side == Side.Enemy) {
            this.scaleX = -1;
        }
        this.heroData = GameManager.GetHeroData(id);
        this.width = this.heroData.width;
        this.height = this.heroData.height;
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
        //设置动画，并装上枪
        this.setAnim(this.heroData.anim);
        this.setGun(this.heroData.gun);
        this.isUp = false;
        this.speed = 0;
        //血条
        this.hp = 0;
        this.addHp(this.heroData.hp);
        this.state = HeroState.Idle;
    };
    p.SetAI = function (aiType) {
        this.aiType = aiType;
    };
    p.ChangeGun = function (id) {
        this.setGun(id);
    };
    p.setAnim = function (anim) {
        if (this.anim == null) {
            this.anim = new egret.MovieClip();
            this.anim.scaleX = this.anim.scaleY = 0.8;
            this.anim.anchorOffsetX = -this.width / 2 / 0.8;
            this.anim.anchorOffsetY = -this.height / 0.8;
            this.addChild(this.anim);
        }
        var mcData = RES.getRes("hero_json");
        var mcTexture = RES.getRes("hero_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.anim.movieClipData = mcDataFactory.generateMovieClipData(anim);
        this.anim.gotoAndPlay(1, -1);
    };
    p.setGun = function (id) {
        if (this.gun == null) {
            this.gun = new egret.Bitmap;
            this.gun.x = this.heroData.gunX;
            this.gun.y = this.heroData.gunY;
            this.addChild(this.gun);
        }
        this.gun.visible = true;
        this.gunData = GameManager.GetGunData(id);
        this.gun.texture = RES.getRes(this.gunData.img);
        this.shootCd = this.gunData.interval;
    };
    p.addHp = function (value) {
        var _loop_1 = function(i) {
            var bar;
            if (this_1.hpArr.length > i) {
                bar = this_1.hpArr[i];
            }
            else {
                bar = new egret.Shape();
                bar.graphics.beginFill(0xff00ff);
                bar.graphics.drawRect(0, 0, 20, 15);
                bar.graphics.endFill();
                bar.x = -40;
                bar.y = i * 25;
                this_1.addChild(bar);
                this_1.hpArr.push(bar);
            }
            bar.visible = true;
            bar.scaleX = bar.scaleY = 0.01;
            egret.setTimeout(function () {
                egret.Tween.get(bar).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.elasticOut);
            }, this_1, 200 * i);
        };
        var this_1 = this;
        for (var i = this.hp; i < this.hp + value; i++) {
            _loop_1(i);
        }
        this.hp += value;
    };
    p.subHp = function (value) {
        var _loop_2 = function(i) {
            var bar = this_2.hpArr[i];
            egret.setTimeout(function () {
                egret.Tween.get(bar).to({ scaleX: 0.01, scaleY: 0.01 }, 300, egret.Ease.elasticOut)
                    .call(function () {
                    bar.visible = false;
                });
            }, this_2, 200 * (this_2.hp - 1 - i));
        };
        var this_2 = this;
        for (var i = this.hp - 1; i >= Math.max(0, this.hp - value); i--) {
            _loop_2(i);
        }
        this.hp = Math.max(0, this.hp - value);
    };
    p.showFreez = function (v) {
        if (this.freezImg == null) {
            this.freezImg = App.DisplayUtils.createBitmap("freez_png");
            this.addChild(this.freezImg);
            this.freezImg.anchorOffsetX = this.freezImg.width / 2;
            this.freezImg.anchorOffsetY = this.freezImg.height / 2;
        }
        this.freezImg.x = this.width / 2;
        this.freezImg.y = this.height / 2;
        this.freezImg.visible = v;
    };
    p.Shoot = function () {
        var _this = this;
        if (this.state != HeroState.Idle) {
            return;
        }
        if (this.shootCd <= 0) {
            var bulletId = this.gunData.bullet;
            var createFunc = function (type, direction) {
                var x = _this.x + (_this.gun.x + _this.gunData.bulletX - _this.anchorOffsetX) * _this.scaleX;
                var y = _this.y - _this.anchorOffsetY + _this.gun.y + _this.gunData.bulletY;
                var moveData = new MoveData(direction);
                App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.CeateBullet, bulletId, type, _this, x, y, moveData);
            };
            switch (this.gunData.type) {
                case GunType.Normal:
                    createFunc("NormalBullet", 0);
                    this.shootCd = this.gunData.interval;
                    break;
                case GunType.Running:
                    var info = this.gunData.info;
                    var count = info.count;
                    var interval = info.interval * 1000;
                    App.TimerManager.doTimer(interval, count, function () { return createFunc("NormalBullet", 0); }, this);
                    this.ResetGun();
                    break;
                case GunType.Shot:
                    var info = this.gunData.info;
                    var count = info.count;
                    var angle = info.angle;
                    var ini_angle = -(count - 1) / 2 * angle;
                    for (var i = 0; i < count; i++) {
                        createFunc("NormalBullet", ini_angle + i * angle);
                    }
                    this.ResetGun();
                    break;
                case GunType.Boomerang:
                    this.gun.visible = false;
                    createFunc("BoomerangBullet", 0);
                    this.shootCd = 100;
                    break;
                case GunType.Laser:
                    createFunc("LaserBullet", 0);
                    this.shootCd = 100;
                    break;
                case GunType.Freez:
                    createFunc("FreezBullet", 0);
                    this.ResetGun();
                    break;
                case GunType.Grenade:
                    var info = this.gunData.info;
                    var direction = info.direction;
                    createFunc("GrenadeBullet", direction);
                    this.ResetGun();
                    break;
                case GunType.Wave:
                    createFunc("WaveBullet", direction);
                    this.ResetGun();
                    break;
                default:
                    break;
            }
        }
    };
    p.GunReturn = function () {
        this.gun.visible = true;
        this.shootCd = this.gunData.interval;
    };
    p.ResetGun = function () {
        this.ChangeGun(this.heroData.gun);
    };
    p.Hurt = function (damage) {
        if (damage <= 0) {
            return;
        }
        App.ShockUtils.shock(App.ShockUtils.SPRITE, this, 1);
        this.state = HeroState.Hurt;
        this.hurtTime = 0;
        this.subHp(damage);
    };
    p.Freez = function (duration) {
        this.state = HeroState.Freez;
        this.freezTime = duration;
    };
    p.Release = function (duration) {
        this.state = HeroState.Release;
        this.releaseTime = duration;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        var t = time / 1000;
        if (this.shootCd > 0) {
            this.shootCd -= t;
        }
        if (this.side == Side.Enemy) {
            switch (this.aiType) {
                case AiType.Follow:
                    this.followAi();
                    break;
                default:
                    break;
            }
        }
        if (this.state == HeroState.Hurt) {
            this.hurtTime -= t;
            if (this.hurtTime <= 0) {
                this.state = HeroState.Idle;
            }
        }
        if (this.state == HeroState.Freez) {
            this.isUp = false;
            this.freezTime -= t;
            this.showFreez(true);
            this.speed = 0;
            if (this.freezTime <= 0) {
                this.state = HeroState.Idle;
                this.showFreez(false);
            }
        }
        if (this.state == HeroState.Release) {
            this.isUp = false;
            this.releaseTime -= t;
            this.speed = 0;
            if (this.releaseTime <= 0) {
                this.state = HeroState.Idle;
            }
        }
        var as = this.heroData.downAs;
        if (this.isUp) {
            as = this.heroData.upAs;
        }
        var s = this.speed;
        this.speed = Math.max(Math.min(this.speed + as * t, this.heroData.maxSpeed), this.heroData.minSpeed);
        this.y -= (s + this.speed) / 2 * t;
        if (this.gameController.CheckHeroOut(this)) {
            this.speed = 0;
        }
    };
    d(p, "IsUp",undefined
        ,function (value) {
            this.isUp = value;
        }
    );
    p.followAi = function () {
        var r = this.gameController.CheckEnemyPosByHero(this);
        if (r > 0) {
            this.isUp = true;
        }
        else {
            this.isUp = false;
            if (r == 0) {
                this.Shoot();
            }
        }
    };
    p.GetState = function () {
        return this.state;
    };
    return Hero;
}(BaseGameObject));
egret.registerClass(Hero,'Hero');
var HeroState;
(function (HeroState) {
    HeroState[HeroState["Idle"] = 0] = "Idle";
    HeroState[HeroState["Hurt"] = 1] = "Hurt";
    HeroState[HeroState["Freez"] = 2] = "Freez";
    HeroState[HeroState["Release"] = 3] = "Release";
})(HeroState || (HeroState = {}));
var AiType;
(function (AiType) {
    AiType[AiType["Follow"] = 0] = "Follow";
})(AiType || (AiType = {}));
