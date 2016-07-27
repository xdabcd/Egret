var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var GemstoneType = (function () {
        function GemstoneType() {
        }
        var d = __define,c=GemstoneType,p=c.prototype;
        d(GemstoneType, "random"
            ,function () {
                return Math.ceil(Math.random() * 5);
            }
        );
        GemstoneType.PINK = 1;
        GemstoneType.RED = 2;
        GemstoneType.GREEN = 3;
        GemstoneType.YELLOW = 4;
        GemstoneType.BLUE = 5;
        return GemstoneType;
    }());
    game.GemstoneType = GemstoneType;
    egret.registerClass(GemstoneType,'game.GemstoneType');
})(game || (game = {}));
