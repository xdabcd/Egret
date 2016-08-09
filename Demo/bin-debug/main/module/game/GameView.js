/**
 *
 * @author
 *
 */
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView($controller, $parent) {
        _super.call(this, $controller, $parent);
        this.ownBullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.items = [];
        this.itemInterval = 5;
        this.itemCd = 0;
        this.controller = $controller;
    }
    var d = __define,c=GameView,p=c.prototype;
    p.initUI = function () {
        _super.prototype.initUI.call(this);
        this.bgContainer = new egret.DisplayObjectContainer;
        this.addChild(this.bgContainer);
        var bg = App.DisplayUtils.createBitmap("bg_png");
        this.bgContainer.addChild(bg);
        var bg1 = App.DisplayUtils.createBitmap("bg_png");
        bg1.x = bg.width;
        this.bgContainer.addChild(bg1);
        this.width = App.StageUtils.getWidth();
        this.height = App.StageUtils.getHeight();
        this.roundText = new egret.TextField;
        this.roundText.width = 400;
        this.roundText.anchorOffsetX = 200;
        this.roundText.anchorOffsetY = 40;
        this.roundText.x = this.width / 2;
        this.roundText.y = this.height / 2 - 100;
        this.roundText.textAlign = "center";
        this.roundText.size = 80;
        this.roundText.bold = true;
        this.addChild(this.roundText);
        this.roundText.visible = false;
        this.setState(0);
        this.round = 1;
        this.wave = 1;
        App.TimerManager.doFrame(1, 0, this.update, this);
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
    };
    p.update = function (time) {
        var _this = this;
        var t = time / 1000;
        switch (this.state) {
            case 0:
                this.roundText.text = "ROUND " + this.round;
                this.roundText.scaleX = this.roundText.scaleY = 0.1;
                this.roundText.visible = true;
                this.roundText.alpha = 1;
                egret.Tween.get(this.roundText).to({ scaleX: 1, scaleY: 1 }, 400, egret.Ease.elasticOut)
                    .wait(500)
                    .to({ alpha: 0.1 }, 300).call(function () { _this.roundText.visible = false; });
                this.createHero();
                this.setState(1);
                break;
            case 1:
                this.createEnemy(AiType.Follow);
                this.setState(2);
                break;
            case 2:
                this.itemCd -= t;
                if (this.itemCd <= 0) {
                    this.createItem(App.RandomUtils.limitInteger(2, 8));
                    this.itemCd = this.itemInterval;
                }
                break;
            case 3:
                this.transTime -= t;
                if (this.transTime <= 0) {
                    this.next();
                }
                break;
            case 4:
                if (this.hero != null && this.hero.GetState() == HeroState.Idle) {
                    this.hero.destory();
                    this.hero = null;
                }
                if (this.bgDis > this.bgContainer.width * 4) {
                    if (this.bgSpeed <= 0.6) {
                        this.bgSpeed = 0.6;
                        if (this.bgContainer.x >= -30) {
                            this.setState(0);
                        }
                    }
                    else {
                        this.bgSpeed -= t;
                    }
                }
                else if (this.bgSpeed < 5) {
                    this.bgSpeed += t;
                }
                for (var i = 0; i < this.items.length; i++) {
                    this.items[i].x -= this.bgSpeed * time;
                }
                this.bgContainer.x = (this.bgContainer.x - this.bgSpeed * time) % (this.bgContainer.width / 2);
                this.bgDis += this.bgSpeed * time;
                break;
            case 5:
                break;
        }
    };
    p.gameOver = function () {
        if (this.over == null) {
            this.over = new egret.TextField;
            this.over.width = 600;
            this.over.anchorOffsetX = 300;
            this.over.anchorOffsetY = 40;
            this.over.x = this.width / 2;
            this.over.y = this.height / 2 - 100;
            this.over.textAlign = "center";
            this.over.size = 80;
            this.over.bold = true;
            this.over.text = "GAME OVER!";
            this.addChild(this.over);
        }
        this.setState(5);
        this.over.scaleX = this.roundText.scaleY = 0.1;
        this.over.visible = true;
        this.over.alpha = 1;
        egret.Tween.get(this.over).to({ scaleX: 1, scaleY: 1 }, 400, egret.Ease.elasticOut);
    };
    p.trans = function () {
        this.state = 3;
        this.transTime = 1;
    };
    p.next = function () {
        if (this.wave < this.round) {
            this.setState(2);
            this.createEnemy(AiType.Follow);
            this.wave += 1;
        }
        else {
            var targetPos = this.getPerPos(1.2, 0.5);
            this.hero.Move(targetPos);
            this.setState(4);
            this.round += 1;
            this.wave = 1;
            this.bgSpeed = 0;
            this.bgDis = 0;
        }
        //        App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.AddScore);
        //        egret.setTimeout(() => { this.createEnemy(AiType.Follow);}, this, 1000);
    };
    p.setState = function (state) {
        if (this.state == 5) {
            return;
        }
        this.state = state;
    };
    p.createHero = function () {
        this.hero = ObjectPool.pop("Hero", this.controller);
        this.hero.init(1, Side.Own);
        var heroPos = this.getPerPos(-0.1, 0.5);
        this.hero.x = heroPos.x;
        this.hero.y = heroPos.y;
        this.addChild(this.hero);
        var targetPos = this.getPerPos(0.2, 0.5);
        this.hero.Move(targetPos);
    };
    p.createEnemy = function (ai) {
        var enemy = ObjectPool.pop("Hero", this.controller);
        enemy.init(1, Side.Enemy);
        enemy.SetAI(ai);
        var pos = this.getPerPos(1.1, 0.4);
        enemy.x = pos.x;
        enemy.y = pos.y;
        this.addChild(enemy);
        this.enemies.push(enemy);
        var targetPos = this.getPerPos(0.8, 0.4);
        enemy.Move(targetPos);
    };
    p.SetHeroDie = function (hero) {
        var _this = this;
        var targetX;
        var targetY = this.getPerPos(0, 1.2).y;
        if (hero.side == Side.Own) {
            targetX = hero.x - 200;
        }
        else {
            targetX = hero.x + 200;
        }
        egret.Tween.get(hero).to({ x: targetX, y: targetY, rotation: targetY - hero.y }, targetY - hero.y)
            .call(function () { _this.RemoveHero(hero); }, this);
    };
    p.RemoveHero = function (hero) {
        hero.destory();
        if (hero.side == Side.Own) {
            this.gameOver();
        }
        else if (hero.side = Side.Enemy) {
            var index = this.enemies.indexOf(hero);
            this.enemies.splice(index, 1);
            App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.AddScore, this);
            if (this.enemies.length == 0) {
                this.trans();
            }
        }
    };
    p.CreateBullet = function (id, type, creater, x, y, moveData) {
        var bullet = ObjectPool.pop(type, this.controller);
        bullet.init(id, creater, moveData);
        bullet.x = x;
        bullet.y = y;
        if (creater.side == Side.Own) {
            this.ownBullets.push(bullet);
        }
        else if (creater.side == Side.Enemy) {
            this.enemyBullets.push(bullet);
        }
        this.addChild(bullet);
    };
    p.RemoveBullet = function (bullet) {
        if (bullet.side == Side.Own) {
            var index = this.ownBullets.indexOf(bullet);
            this.ownBullets.splice(index, 1);
        }
        else if (bullet.side = Side.Enemy) {
            var index = this.enemyBullets.indexOf(bullet);
            this.enemyBullets.splice(index, 1);
        }
        bullet.destory();
    };
    p.createItem = function (id) {
        var item = ObjectPool.pop("Item", this.controller);
        var direction = App.RandomUtils.limitInteger(0, 1);
        item.init(id, Side.Middle, direction);
        var pos = this.getPerPos(App.RandomUtils.limit(0.4, 0.6), direction);
        item.x = pos.x;
        item.y = pos.y;
        this.addChild(item);
        this.items.push(item);
    };
    p.RemoveItem = function (item) {
        var index = this.items.indexOf(item);
        this.items.splice(index, 1);
        item.destory();
    };
    p.Jump = function (up) {
        if (this.hero != null) {
            this.hero.IsUp = up;
        }
    };
    p.Shoot = function () {
        if (this.hero != null) {
            this.hero.Shoot();
        }
    };
    p.GetHero = function () {
        return this.hero;
    };
    p.GetOwnBullets = function () {
        return this.ownBullets;
    };
    p.GetEnemies = function () {
        return this.enemies;
    };
    p.GetEnemyBullets = function () {
        return this.enemyBullets;
    };
    p.GetItems = function () {
        return this.items;
    };
    d(p, "min_x"
        ,function () {
            return 0;
        }
    );
    d(p, "max_x"
        ,function () {
            return App.StageUtils.getWidth();
        }
    );
    d(p, "min_y"
        ,function () {
            return 0;
        }
    );
    d(p, "max_y"
        ,function () {
            return App.StageUtils.getHeight() - GameManager.UI_H;
        }
    );
    p.getPerPos = function (perX, perY) {
        var point = new egret.Point;
        point.x = (this.max_x - this.min_x) * perX + this.min_x;
        point.y = (this.max_y - this.min_y) * perY + this.min_y;
        return point;
    };
    return GameView;
}(BaseSpriteView));
egret.registerClass(GameView,'GameView');
