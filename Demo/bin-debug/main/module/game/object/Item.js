/**
 *
 * @author
 *
 */
var Item = (function (_super) {
    __extends(Item, _super);
    function Item($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=Item,p=c.prototype;
    p.init = function (id, side, direction) {
        _super.prototype.init.call(this, side);
        this.id = id;
        this.direction = direction;
        var itemData = GameManager.GetItemData(id);
        this.speed = itemData.speed;
        this.awardGun = itemData.awardGun;
        this.width = 60;
        this.height = 60;
        var sh = new egret.Shape();
        sh.graphics.beginFill(0xffff00);
        sh.graphics.drawRect(0, 0, 60, 60);
        sh.graphics.endFill();
        this.addChild(sh);
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
        var t = time / 1000;
        if (this.direction == 0) {
            this.y += this.speed * t;
        }
        else {
            this.y -= this.speed * t;
        }
        if (this.gameController.CheckOutScreen(this)) {
            App.ControllerManager.applyFunc(ControllerConst.Game, GameConst.RemoveItem, this);
        }
    };
    p.GetAward = function () {
        return this.awardGun;
    };
    return Item;
}(BaseGameObject));
egret.registerClass(Item,'Item');
