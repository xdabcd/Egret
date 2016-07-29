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
        var heroData = GameManager.GetHeroData(id);
        this.width = heroData.width;
        this.height = heroData.height;
        //设置动画，并装上枪
        this.setAnim(heroData.anim);
        this.setGun(heroData.gun, heroData.gunX, heroData.gunY);
        this.upAs = heroData.upAs;
        this.downAs = heroData.downAs;
        this.isUp = false;
        this.speed = 0;
        //血条
        this.hp = 0;
        this.addHp(heroData.hp);
        this.state = HeroState.Idle;
    };
    p.SetAI = function (aiType) {
        this.aiType = aiType;
    };
    p.setAnim = function (anim) {
        if (this.anim == null) {
            this.anim = new egret.MovieClip();
            this.anim.anchorOffsetX = -this.width / 2;
            this.anim.anchorOffsetY = -this.height;
            this.addChild(this.anim);
        }
        var mcData = RES.getRes("hero_json");
        var mcTexture = RES.getRes("hero_png");
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
        var gunData = GameManager.GetGunData(id);
        this.gun.texture = RES.getRes(gunData.img);
        this.shootInterval = gunData.interval;
        this.shootCd = 0;
        this.bulletId = gunData.bullet;
        this.bulletX = gunData.bulletX;
        this.bulletY = gunData.bulletY;
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
    p.Shoot = function () {
        if (this.shootCd <= 0) {
            this.shootCd = this.shootInterval;
            var x = this.x + (this.gun.x + this.bulletX) * this.scaleX;
            var y = this.y + this.gun.y + this.bulletY;
            var moveData = new MoveData(0);
            App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.CeateBullet, this.bulletId, this.side, x, y, moveData);
        }
    };
    p.Hurt = function (damage) {
        App.ShockUtils.shock(App.ShockUtils.SPRITE, this, 1);
        this.state = HeroState.Hurt;
        this.hurtTime = 0.1;
        this.subHp(damage);
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        var t = time / 1000;
        if (this.shootCd > 0) {
            this.shootCd -= t;
        }
        if (this.state == HeroState.Hurt) {
            this.hurtTime -= t;
            if (this.hurtTime <= 0) {
                this.state = HeroState.Idle;
            }
            else {
                return;
            }
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
    return Hero;
}(BaseGameObject));
egret.registerClass(Hero,'Hero');
var HeroState;
(function (HeroState) {
    HeroState[HeroState["Idle"] = 0] = "Idle";
    HeroState[HeroState["Hurt"] = 1] = "Hurt";
})(HeroState || (HeroState = {}));
var AiType;
(function (AiType) {
    AiType[AiType["Follow"] = 0] = "Follow";
})(AiType || (AiType = {}));
