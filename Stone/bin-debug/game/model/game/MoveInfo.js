var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var MoveInfo = (function () {
        function MoveInfo(gemstone, targetPos, duration) {
            this.gemstone = gemstone.clone();
            this.targetPos = targetPos;
            this.duration = duration;
        }
        var d = __define,c=MoveInfo,p=c.prototype;
        return MoveInfo;
    }());
    game.MoveInfo = MoveInfo;
    egret.registerClass(MoveInfo,'game.MoveInfo');
})(game || (game = {}));
