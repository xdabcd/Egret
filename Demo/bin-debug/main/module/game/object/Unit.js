/**
 *
 * @author
 *
 */
var Unit = (function (_super) {
    __extends(Unit, _super);
    function Unit($controller) {
        _super.call(this, $controller);
    }
    var d = __define,c=Unit,p=c.prototype;
    p.init = function (id, side) {
        _super.prototype.init.call(this, side);
        this.id = id;
    };
    p.addHp = function (value) {
    };
    p.subHp = function (value) {
    };
    p.Hurt = function (damage) {
    };
    p.Freez = function (duration) {
        this.state = UnitState.Freez;
        this.freezTime = duration;
    };
    p.update = function (time) {
        _super.prototype.update.call(this, time);
    };
    return Unit;
}(BaseGameObject));
egret.registerClass(Unit,'Unit');
var UnitState;
(function (UnitState) {
    UnitState[UnitState["Move"] = 0] = "Move";
    UnitState[UnitState["Idle"] = 1] = "Idle";
    UnitState[UnitState["Dodge"] = 2] = "Dodge";
    UnitState[UnitState["Hurt"] = 3] = "Hurt";
    UnitState[UnitState["Freez"] = 4] = "Freez";
    UnitState[UnitState["Release"] = 5] = "Release";
    UnitState[UnitState["Die"] = 6] = "Die";
})(UnitState || (UnitState = {}));
//# sourceMappingURL=Unit.js.map