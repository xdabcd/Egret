var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var GemstoneEffect = (function () {
        function GemstoneEffect() {
        }
        var d = __define,c=GemstoneEffect,p=c.prototype;
        GemstoneEffect.NONE = 0;
        GemstoneEffect.HOR = 1;
        GemstoneEffect.VER = 2;
        GemstoneEffect.SCOPE = 3;
        return GemstoneEffect;
    }());
    game.GemstoneEffect = GemstoneEffect;
    egret.registerClass(GemstoneEffect,'game.GemstoneEffect');
})(game || (game = {}));
