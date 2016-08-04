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
        var bg = App.DisplayUtils.createBitmap("bg_png");
        this.addChild(bg);
        this.width = App.StageUtils.getWidth();
        this.height = App.StageUtils.getHeight();
        this.createHero();
        this.createEnemy(AiType.Follow);
        App.TimerManager.doFrame(1, 0, this.update, this);
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
    };
    p.update = function (time) {
        var t = time / 1000;
        this.itemCd -= t;
        if (this.itemCd <= 0) {
            this.createItem(App.RandomUtils.limitInteger(1, 5));
            this.itemCd = this.itemInterval;
        }
    };
    p.createHero = function () {
        this.hero = ObjectPool.pop("Hero", this.controller);
        this.hero.init(1, Side.Own);
        var heroPos = this.getPerPos(0.18, 0.3);
        this.hero.x = heroPos.x;
        this.hero.y = heroPos.y;
        this.addChild(this.hero);
    };
    p.createEnemy = function (ai) {
        var enemy = ObjectPool.pop("Hero", this.controller);
        enemy.init(1, Side.Enemy);
        enemy.SetAI(ai);
        var pos = this.getPerPos(0.82, 0.3);
        enemy.x = pos.x;
        enemy.y = pos.y;
        this.addChild(enemy);
        this.enemies.push(enemy);
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
        this.hero.IsUp = up;
    };
    p.Shoot = function () {
        this.hero.Shoot();
    };
    p.GetHero = function () {
        return this.hero;
    };
    p.GetEnemies = function () {
        return this.enemies;
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
