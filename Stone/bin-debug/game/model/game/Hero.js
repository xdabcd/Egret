var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var Hero = (function () {
        function Hero() {
        }
        var d = __define,c=Hero,p=c.prototype;
        p.clone = function () {
            var hero = new Hero();
            hero.index = this.index;
            hero.id = this.id;
            hero.type = this.type;
            return hero;
        };
        return Hero;
    }());
    game.Hero = Hero;
    egret.registerClass(Hero,'game.Hero');
})(game || (game = {}));
