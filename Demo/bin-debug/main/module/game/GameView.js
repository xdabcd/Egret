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
        this.stones = [];
        this.sceneBullets = [];
        this.itemInterval = 5;
        this.itemCd = 0;
        this.stoneInterval = 6;
        this.stoneCd = 0;
        this.seInterval = 15;
        this.seCd = 0;
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
                if (this.isBossRound) {
                    this.createBoss();
                }
                else {
                    this.createEnemy(AiType.Follow);
                    this.seCd = App.RandomUtils.limit(this.seInterval / 2, this.seInterval);
                }
                this.setState(2);
                break;
            case 2:
                this.itemCd -= t;
                if (this.itemCd <= 0) {
                    this.createItem(App.RandomUtils.limitInteger(2, 8));
                    this.itemCd = this.itemInterval;
                }
                if (!this.isBossRound) {
                    this.stoneCd -= t;
                    if (this.stoneCd <= 0) {
                        this.createStone(App.RandomUtils.limitInteger(1, 2));
                        this.stoneCd = this.stoneInterval;
                    }
                    this.seCd -= t;
                    if (this.seCd <= 0) {
                        this.addSceneEffect();
                        this.seCd = this.seInterval;
                    }
                }
                break;
            case 3:
                this.transTime -= t;
                if (this.transTime <= 0) {
                    this.next();
                }
                break;
            case 4:
                var w = App.StageUtils.getWidth();
                if (this.hero != null && this.hero.GetState() == UnitState.Idle) {
                    this.hero.destory();
                    this.hero = null;
                }
                if (this.bgDis > w * 2 / 3) {
                    this.clearItems();
                    this.clearStones();
                    this.clearEffect();
                }
                if (this.bgDis > w * 4) {
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
                else if (this.bgSpeed < 6) {
                    this.bgSpeed += t;
                }
                this.bgContainer.x = (this.bgContainer.x - this.bgSpeed * time) % w;
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
        this.setState(3);
        this.transTime = 0;
    };
    d(p, "isBossRound"
        ,function () {
            return this.round % 3 == 0;
        }
    );
    p.next = function () {
        if (!this.isBossRound && this.wave < this.round % 3) {
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
    };
    p.setState = function (state) {
        if (this.state == 5) {
            return;
        }
        this.state = state;
    };
    p.addSceneEffect = function () {
        var se = ObjectPool.pop("SceneEffect", this.controller);
        var arr = [0, 180, 25, 155, -25, -155];
        se.init(Side.Middle, arr[App.RandomUtils.limitInteger(0, arr.length - 1)]);
        se.x = this.getPerXPos(0.5);
        se.y = this.getPerYPos(0.5);
        this.bgContainer.addChild(se);
        this.sceneEffet = se;
    };
    p.createHero = function () {
        this.hero = ObjectPool.pop("Hero", this.controller);
        this.hero.init(1, Side.Own);
        var heroPos = this.getPerPos(-0.1, 0.5);
        this.hero.x = heroPos.x;
        this.hero.y = heroPos.y;
        this.hero.SetPosArr(this.getHeroPos(0), this.getHeroPos(1));
        this.addChild(this.hero);
        this.hero.Entrance();
    };
    p.createEnemy = function (ai) {
        var enemy = ObjectPool.pop("Hero", this.controller);
        enemy.init(1, Side.Enemy);
        enemy.SetAI(ai);
        var pos = this.getPerPos(1.1, 0.4);
        enemy.x = pos.x;
        enemy.y = pos.y;
        enemy.SetPosArr(this.getHeroPos(3), this.getHeroPos(2));
        this.addChild(enemy);
        this.enemies.push(enemy);
        enemy.Entrance();
    };
    p.createBoss = function () {
        this.boss = ObjectPool.pop("Boss", this.controller);
        this.boss.init(1, Side.Enemy);
        var pos = this.getPerPos(0.8, 0.4);
        this.boss.x = pos.x;
        this.boss.y = pos.y;
        this.addChild(this.boss);
    };
    p.SetBossDie = function () {
        var _this = this;
        egret.Tween.get(this.boss).to({ alpha: 0.1 }, 600)
            .call(function () { _this.RemoveBoss(); }, this);
    };
    p.RemoveBoss = function () {
        this.boss.destory();
        this.boss = null;
        App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.AddScore, 5);
        this.trans();
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
            App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.AddScore, 1);
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
        else if (creater.side == Side.Middle) {
            this.sceneBullets.push(bullet);
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
        if (direction == 0) {
            item.y -= 50;
        }
        else {
            item.y += 50;
        }
        this.bgContainer.addChild(item);
        this.items.push(item);
    };
    p.RemoveItem = function (item) {
        var index = this.items.indexOf(item);
        this.items.splice(index, 1);
        item.destory();
    };
    p.createStone = function (id) {
        var stone = ObjectPool.pop("Stone", this.controller);
        var direction = App.RandomUtils.limitInteger(0, 1);
        stone.init(id, Side.Middle, direction);
        var pos = this.getPerPos(App.RandomUtils.limit(0.4, 0.6), direction);
        stone.x = pos.x;
        stone.y = pos.y;
        if (direction == 0) {
            stone.y -= 100;
        }
        else {
            stone.y += 100;
        }
        this.bgContainer.addChild(stone);
        this.stones.push(stone);
    };
    p.clearItems = function () {
        if (this.items.length > 0) {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].destory();
            }
            this.items = [];
        }
    };
    p.clearStones = function () {
        if (this.stones.length > 0) {
            for (var i = 0; i < this.stones.length; i++) {
                this.stones[i].destory();
            }
            this.stones = [];
        }
    };
    p.clearEffect = function () {
        if (this.sceneEffet != null) {
            this.sceneEffet.destory();
        }
    };
    p.RemoveStone = function (stone) {
        var index = this.stones.indexOf(stone);
        this.stones.splice(index, 1);
        stone.destory();
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
    p.Dodge = function () {
        if (this.hero != null) {
            this.hero.Dodge();
        }
    };
    p.GetDanger = function (side) {
        var arr = [];
        var a = this.hero;
        var b = this.enemies;
        var c = this.boss;
        if (side == Side.Own) {
            for (var i = 0; i < b.length; i++) {
                arr.push(b[i]);
            }
            if (c != null) {
                arr.push(c);
            }
        }
        else if (side == Side.Enemy) {
            if (a != null) {
                arr.push(a);
            }
        }
        else if (side == Side.Middle) {
            if (a != null) {
                arr.push(a);
            }
            for (var i = 0; i < b.length; i++) {
                arr.push(b[i]);
            }
            if (c != null) {
                arr.push(c);
            }
        }
        return arr;
    };
    p.GetDangerBullets = function (side) {
        var arr = [];
        var a = [];
        var b = this.sceneBullets;
        if (side == Side.Own) {
            a = this.enemyBullets;
        }
        else if (side == Side.Enemy) {
            a = this.ownBullets;
        }
        for (var i = 0; i < a.length; i++) {
            arr.push(a[i]);
        }
        for (var i = 0; i < b.length; i++) {
            arr.push(b[i]);
        }
        return arr;
    };
    p.GetItems = function () {
        return this.items;
    };
    p.GetStones = function () {
        return this.stones;
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
    p.getHeroPos = function (idx) {
        return this.getPerXPos(GameManager.GetHeroPos(idx));
    };
    p.getPerXPos = function (perX) {
        return (this.max_x - this.min_x) * perX + this.min_x;
    };
    p.getPerYPos = function (perY) {
        return (this.max_y - this.min_y) * perY + this.min_y;
    };
    p.getPerPos = function (perX, perY) {
        return new egret.Point(this.getPerXPos(perX), this.getPerYPos(perY));
    };
    return GameView;
}(BaseSpriteView));
egret.registerClass(GameView,'GameView');
