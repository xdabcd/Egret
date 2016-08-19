/**
 *
 * @author
 *
 */
var GameController = (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        _super.call(this);
        //初始化数据
        GameManager.Init();
        //初始化UI
        this.gameView = new GameView(this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Game, this.gameView);
        this.gameUIView = new GameUIView(this, LayerManager.Game_UI);
        App.ViewManager.register(ViewConst.GameUI, this.gameUIView);
        this.registerFunc(GameConst.Jump, this.gameView.Jump, this.gameView);
        this.registerFunc(GameConst.Shoot, this.gameView.Shoot, this.gameView);
        this.registerFunc(GameConst.Dodge, this.gameView.Dodge, this.gameView);
        this.registerFunc(GameConst.CeateBullet, this.gameView.CreateBullet, this.gameView);
        this.registerFunc(GameConst.RemoveBullet, this.gameView.RemoveBullet, this.gameView);
        this.registerFunc(GameConst.RemoveItem, this.gameView.RemoveItem, this.gameView);
        this.registerFunc(GameConst.RemoveStone, this.gameView.RemoveStone, this.gameView);
        this.registerFunc(GameConst.HeroDie, this.gameView.SetHeroDie, this.gameView);
        this.registerFunc(GameConst.BossDie, this.gameView.SetBossDie, this.gameView);
        this.registerFunc(GameConst.AddScore, this.gameUIView.AddScore, this.gameUIView);
    }
    var d = __define,c=GameController,p=c.prototype;
    /**
     * 获取范围离英雄最近的敌人或道具
     */
    p.GetNearestInArea = function (hero, area) {
        var unitArr = this.gameView.GetDanger(hero.side);
        var itemArr = this.gameView.GetItems();
        var l = 2000;
        var min = area[0];
        var max = area[1];
        var obj;
        for (var i = 0; i < unitArr.length; i++) {
            var unit = unitArr[i];
            if (unit.y >= min && unit.y <= max) {
                if (Math.abs(unit.y - hero.y) < l) {
                    l = Math.abs(unit.y - hero.y);
                    obj = unit;
                }
            }
        }
        for (var i = 0; i < itemArr.length; i++) {
            var item = itemArr[i];
            if (item.y >= min && item.y <= max) {
                if (Math.abs(item.y - hero.y) < l) {
                    l = Math.abs(item.y - hero.y);
                    obj = item;
                }
            }
        }
        return obj;
    };
    /**
     * 获取安全区域
     */
    p.GetSafeArea = function (hero) {
        var dangerArr = [this.gameView.min_y, this.gameView.max_y];
        var safeArr = [];
        if (!hero.HaveItem()) {
            var bullets = this.gameView.GetDangerBullets(hero.side);
            for (var i = 0; i < bullets.length; i++) {
                var bullet = bullets[i];
                var dangerArea = bullet.GetDangerArea(hero.x, 0.6);
                for (var j = 0; j < dangerArea.length; j++) {
                    dangerArr.push(dangerArea[j]);
                }
            }
            dangerArr.sort(SortUtils.sortNum);
        }
        var l = hero.height * 1.5;
        for (var i = 0; i < dangerArr.length; i++) {
            if (i < dangerArr.length - 1) {
                var p1 = dangerArr[i];
                var p2 = dangerArr[i + 1];
                if (p2 - p1 > l) {
                    safeArr.push([p1, p2]);
                }
            }
        }
        return safeArr;
    };
    /**
     * 检测英雄是否即将受攻击
     */
    p.checkDanger = function (hero, range) {
        var arr = this.gameView.GetDangerBullets(hero.side);
        var rect1 = hero.rect;
        rect1.x -= range;
        var rect2 = hero.rect;
        rect2.x += range;
        var rect;
        for (var i = 0; i < arr.length; i++) {
            var bullet = arr[i];
            if (bullet.scaleX > 0) {
                rect = rect1;
            }
            else {
                rect = rect2;
            }
            if (rect.intersectTo(bullet.rect)) {
                return true;
            }
        }
        return false;
    };
    /**
     * 检测是否击中子弹
     */
    p.CheckHitBullet = function (bullet) {
        var bullets = [];
        var arr = this.gameView.GetDangerBullets(bullet.side);
        for (var i = 0; i < arr.length; i++) {
            var b = arr[i];
            if (this.hitTest(bullet.rect, b.rect)) {
                bullets.push(b);
            }
        }
        return bullets;
    };
    /**
     * 检测子弹是否击中单位
     */
    p.CheckHitUnit = function (bullet) {
        var hitUnits = [];
        var arr = this.gameView.GetDanger(bullet.side);
        for (var i = 0; i < arr.length; i++) {
            var unit = arr[i];
            if (unit != null && this.hitTest(bullet.rect, unit.rect)) {
                hitUnits.push(unit);
            }
        }
        return hitUnits;
    };
    /**
     * 检查是否击中道具
     */
    p.CheckHitItem = function (bullet) {
        var hitItems = [];
        var items = this.gameView.GetItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (this.hitTest(bullet.rect, item.rect)) {
                hitItems.push(item);
            }
        }
        return hitItems;
    };
    /**
     * 检查是否击中石头
     */
    p.CheckHitStone = function (bullet) {
        var hitStones = [];
        var stones = this.gameView.GetStones();
        for (var i = 0; i < stones.length; i++) {
            var stone = stones[i];
            if (this.hitTest(bullet.rect, stone.rect)) {
                hitStones.push(stone);
            }
        }
        return hitStones;
    };
    /**
     * 检测英雄是否超出范围(Y轴)
     */
    p.CheckHeroOut = function (hero) {
        if (hero.y - hero.anchorOffsetY < this.gameView.min_y) {
            hero.y = this.gameView.min_y + hero.anchorOffsetY;
            return true;
        }
        else if (hero.y - hero.anchorOffsetY + hero.height > this.gameView.max_y) {
            hero.y = this.gameView.max_y + hero.anchorOffsetY - hero.height;
            return true;
        }
        return false;
    };
    /**
     * 检测是否超出屏幕
     */
    p.CheckOutScreen = function (object) {
        var w = App.StageUtils.getWidth();
        var h = App.StageUtils.getHeight();
        return !this.hitTest(new Rect(object.x, object.y, object.width, object.height, object.rotation), new Rect(w / 2, h / 2, w + 200, h + 200, 0));
    };
    /**
     * 碰撞检测
     */
    p.hitTest = function (rect1, rect2) {
        return rect1.intersectTo(rect2);
    };
    /**
     * 获取游戏横向百分比
     */
    p.GetPerX = function (per) {
        return (this.gameView.max_x - this.gameView.min_x) * per + this.gameView.min_x;
    };
    /**
     * 获取游戏纵向百分比
     */
    p.GetPerY = function (per) {
        return (this.gameView.max_y - this.gameView.min_y) * per + this.gameView.min_y;
    };
    return GameController;
}(BaseController));
egret.registerClass(GameController,'GameController');
