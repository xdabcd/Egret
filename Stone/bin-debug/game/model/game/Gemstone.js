var game;
(function (game) {
    /**
    *
    * @author
    *
    */
    var Gemstone = (function () {
        function Gemstone() {
            /** 宝石效果 */
            this.effect = game.GemstoneEffect.NONE;
        }
        var d = __define,c=Gemstone,p=c.prototype;
        p.clone = function () {
            var gs = new Gemstone();
            gs.position = this.position.clone();
            gs.type = this.type;
            gs.prePosition = this.prePosition;
            gs.effect = this.effect;
            return gs;
        };
        return Gemstone;
    }());
    game.Gemstone = Gemstone;
    egret.registerClass(Gemstone,'game.Gemstone');
})(game || (game = {}));
