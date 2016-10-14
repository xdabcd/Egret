/**
 *
 * @author
 *
 */
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero($controller) {
        _super.call(this, $controller);
        this.aiDodgeInterval = 5;
        this.hpArr = [];
        this.posArr = [];
    }
    var d = __define,c=Hero,p=c.prototype;
    p.init = function (id, side) {
        _super.prototype.init.call(this, id, side);
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
        this.setImg(this.heroData.anim);
        this.setGun(this.heroData.gun);
        this.isUp = false;
        this.speed = 0;
        //血条
        this.hp = 0;
        this.addHp(this.heroData.hp);
        this.showFreez(false);
        this.rotation = 0;
    };
    p.setImg = function (img) {
        if (this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.texture = RES.getRes(img);
        this.img.x = this.heroData.width / 2;
        this.img.y = this.heroData.height / 2;
        this.img.anchorOffsetX = this.img.width / 2;
        this.img.anchorOffsetY = this.img.height / 2;
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
        this.shootCd = this.shootInterval;
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
            egret.Tween.removeTweens(bar);
            bar.visible = true;
            bar.scaleX = bar.scaleY = 0.01;
            App.TimerManager.doTimer(50 * i, 1, function () {
                egret.Tween.get(bar).to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.elasticOut);
            }, this_1);
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
            egret.Tween.removeTweens(bar);
            bar.visible = true;
            bar.scaleX = bar.scaleY = 1;
            App.TimerManager.doTimer(50 * (this_2.hp - 1 - i), 1, function () {
                egret.Tween.get(bar).to({ scaleX: 0.01, scaleY: 0.01 }, 300, egret.Ease.elasticOut)
                    .call(function () {
                    bar.visible = false;
                });
            }, this_2);
        };
        var this_2 = this;
        for (var i = this.hp - 1; i >= Math.max(0, this.hp - value); i--) {
            _loop_2(i);
        }
        this.hp = Math.max(0, this.hp - value);
        if (this.hp <= 0) {
            this.state = UnitState.Die;
            App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.HeroDie, this);
        }
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
    p.SetAI = function (aiType) {
        this.aiType = aiType;
    };
    p.SetPosArr = function (posX_1, posX_2) {
        this.posArr = [posX_1, posX_2];
    };
    p.ChangeGun = function (id) {
        this.setGun(id);
    };
    p.Entrance = function () {
        this.Move(new egret.Point(this.posArr[0], this.y));
        this.curPosIndex = 0;
    };
    p.Move = function (pos) {
        this.state = UnitState.Move;
        this.targetPos = pos;
    };
    p.ToIdle = function () {
        this.state = UnitState.Idle;
    };
    p.Hurt = function (damage) {
        if (damage <= 0) {
            return;
        }
        App.ShockUtils.shock(App.ShockUtils.SPRITE, this, 1);
        this.state = UnitState.Hurt;
        this.hurtTime = 0;
        this.subHp(damage);
    };
    p.Release = function (duration) {
        this.state = UnitState.Release;
        this.releaseTime = duration;
    };
    p.Dodge = function () {
        if (this.state != UnitState.Idle) {
            return false;
        }
        this.state = UnitState.Dodge;
        if (this.curPosIndex == 0) {
            this.curPosIndex = 1;
        }
        else {
            this.curPosIndex = 0;
        }
        this.targetPos = new egret.Point(this.posArr[this.curPosIndex], this.y);
        return true;
    };
    p.Shoot = function () {
        var _this = this;
        if (this.state != UnitState.Idle) {
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
                    this.shootCd = this.shootInterval;
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
        this.shootCd = this.shootInterval;
    };
    p.ResetGun = function () {
        this.ChangeGun(this.heroData.gun);
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        var t = time / 1000;
        switch (this.state) {
            case UnitState.Move:
                var xa = time / 2;
                var ya = xa * (this.targetPos.y - this.y) / (this.targetPos.x - this.x);
                var ra = time / 2;
                var r = 45;
                if (this.scaleX == 1) {
                    if (this.x < this.targetPos.x) {
                        this.x = Math.min(this.targetPos.x, this.x + xa);
                        if (this.rotation < r) {
                            this.rotation = Math.min(r, this.rotation + ra);
                        }
                    }
                    else {
                        this.rotation = Math.max(0, this.rotation - ra);
                        if (this.rotation == 0) {
                            this.state = UnitState.Idle;
                        }
                    }
                }
                else {
                    if (this.x > this.targetPos.x) {
                        this.x = Math.max(this.targetPos.x, this.x - xa);
                        if (this.rotation > -r) {
                            this.rotation = Math.max(-r, this.rotation - ra);
                        }
                    }
                    else {
                        this.rotation = Math.min(0, this.rotation + ra);
                        if (this.rotation == 0) {
                            this.state = UnitState.Idle;
                        }
                    }
                }
                if (this.y < this.targetPos.y) {
                    this.y = Math.min(this.y + Math.abs(ya), this.targetPos.y);
                }
                else if (this.y > this.targetPos.y) {
                    this.y = Math.max(this.y - Math.abs(ya), this.targetPos.y);
                }
                return;
            case UnitState.Dodge:
                var xa = time * 1.5;
                var ra = time * 1.5;
                var r = 45;
                if (this.x > this.targetPos.x) {
                    this.x = Math.max(this.targetPos.x, this.x - xa);
                    if (this.rotation > -r) {
                        this.rotation = Math.max(-r, this.rotation - ra);
                    }
                }
                else if (this.x < this.targetPos.x) {
                    this.x = Math.min(this.targetPos.x, this.x + xa);
                    if (this.rotation < r) {
                        this.rotation = Math.min(r, this.rotation + ra);
                    }
                }
                else {
                    if (this.rotation > 0) {
                        this.rotation = Math.max(0, this.rotation - ra);
                    }
                    else if (this.rotation < 0) {
                        this.rotation = Math.min(0, this.rotation + ra);
                    }
                    else {
                        this.state = UnitState.Idle;
                        this.speed = 0;
                    }
                }
                return;
            case UnitState.Idle:
                if (this.side == Side.Enemy) {
                    switch (this.aiType) {
                        case AiType.Follow:
                            this.followAi(t);
                            break;
                        default:
                            break;
                    }
                }
                break;
            case UnitState.Hurt:
                this.hurtTime -= t;
                if (this.hurtTime <= 0) {
                    this.state = UnitState.Idle;
                }
                break;
            case UnitState.Freez:
                this.isUp = false;
                this.freezTime -= t;
                this.showFreez(true);
                this.speed = 0;
                if (this.freezTime <= 0) {
                    this.state = UnitState.Idle;
                    this.showFreez(false);
                }
                break;
            case UnitState.Release:
                this.isUp = false;
                this.releaseTime -= t;
                this.speed = 0;
                if (this.releaseTime <= 0) {
                    this.state = UnitState.Idle;
                }
                break;
        }
        if (this.shootCd > 0) {
            if (this.aiType == AiType.Follow) {
                this.shootCd -= t * 0.5;
            }
            else {
                this.shootCd -= t;
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
    p.followAi = function (t) {
        if (this.aiDodgeCd == null) {
            this.aiDodgeCd = 0;
        }
        if (this.aiDodgeCd > 0) {
            this.aiDodgeCd -= t;
        }
        else {
            if (this.gameController.checkDanger(this, 100) && this.Dodge()) {
                this.aiDodgeCd = this.aiDodgeInterval;
                return;
            }
        }
        var safeArea = this.gameController.GetSafeArea(this);
        var target;
        var targetPos;
        if (safeArea.length > 0) {
            var idx = -1;
            var l = 2000;
            this.hitRect.graphics.clear();
            for (var i = 0; i < safeArea.length; i++) {
                var min = safeArea[i][0] + this.height / 2;
                var max = safeArea[i][1] - this.height / 2;
                //        	     if(this.speed > 0){
                //                     min += this.speed * 0.2;
                //        	     }else{
                //      max += this.speed * 0.2;
                //        	     }
                //                this.hitRect.graphics.lineStyle(10,0xff00000,0.5);
                //                this.hitRect.graphics.moveTo(this.x,min);
                //                this.hitRect.graphics.lineTo(this.x,max);
                if (this.y >= min && this.y <= max) {
                    targetPos = (max + min) / 2;
                    var near = this.gameController.GetNearestInArea(this, [min, max]);
                    if (near != null) {
                        target = near;
                        targetPos = near.y;
                    }
                    break;
                }
                else if (this.y <= min) {
                    if (min - this.y < l) {
                        targetPos = min;
                        l = min - this.y;
                    }
                }
                else {
                    if (this.y - max < l) {
                        targetPos = max;
                        l = this.y - max;
                    }
                }
            }
        }
        if (target != null) {
            if (Math.abs(targetPos - this.y) < 30) {
                this.Shoot();
            }
        }
        if (this.y > targetPos) {
            this.isUp = true;
        }
        else {
            this.isUp = false;
        }
    };
    p.GetState = function () {
        return this.state;
    };
    d(p, "rect"
        ,function () {
            if (this.state == UnitState.Move || this.state == UnitState.Die || this.state == UnitState.Dodge) {
                return (new Rect(-10000, -10000, 0, 0, this.rotation));
            }
            return new Rect(this.x, this.y, this.width, this.height, this.rotation);
        }
    );
    d(p, "shootInterval"
        ,function () {
            return this.gunData.interval;
        }
    );
    p.HaveItem = function () {
        return this.gunData.id != this.heroData.gun;
    };
    return Hero;
}(Unit));
egret.registerClass(Hero,'Hero');
var AiType;
(function (AiType) {
    AiType[AiType["Follow"] = 0] = "Follow";
})(AiType || (AiType = {}));
//# sourceMappingURL=Hero.js.map