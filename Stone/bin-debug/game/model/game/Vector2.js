var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var Vector2 = (function () {
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
        }
        var d = __define,c=Vector2,p=c.prototype;
        p.clone = function () {
            return new Vector2(this.x, this.y);
        };
        p.equalTo = function (pos) {
            if (pos.x == this.x && pos.y == this.y) {
                return true;
            }
            return false;
        };
        p.borderUpon = function (pos) {
            if (Math.abs(pos.x - this.x) + Math.abs(pos.y - this.y) == 1) {
                return true;
            }
            return false;
        };
        return Vector2;
    }());
    game.Vector2 = Vector2;
    egret.registerClass(Vector2,'game.Vector2');
})(game || (game = {}));
