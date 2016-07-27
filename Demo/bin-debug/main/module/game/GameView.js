/**
 *
 * @author
 *
 */
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView($controller, $parent) {
        _super.call(this, $controller, $parent);
        this.controller = $controller;
    }
    var d = __define,c=GameView,p=c.prototype;
    p.initUI = function () {
        _super.prototype.initUI.call(this);
        this.hero = ObjectPool.pop("Hero", this.controller);
        this.hero.init(1);
        var heroPos = this.getPerPos(0.1, 0.3);
        this.hero.x = heroPos.x;
        this.hero.y = heroPos.y;
        this.addChild(this.hero);
    };
    p.initData = function () {
        _super.prototype.initData.call(this);
    };
    p.SetHeroUp = function (up) {
        this.hero.IsUp = up;
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
            return App.StageUtils.getHeight() - GameManager.Bottom_H;
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
