var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var Enemy = (function () {
        function Enemy() {
        }
        var d = __define,c=Enemy,p=c.prototype;
        p.clone = function () {
            var enemy = new Enemy();
            enemy.rounds = this.rounds;
            enemy.cur_round = this.cur_round;
            enemy.index = this.index;
            enemy.id = this.id;
            return enemy;
        };
        return Enemy;
    }());
    game.Enemy = Enemy;
    egret.registerClass(Enemy,'game.Enemy');
})(game || (game = {}));
