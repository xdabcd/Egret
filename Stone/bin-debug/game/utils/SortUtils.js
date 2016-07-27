var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var SortUtils = (function () {
        function SortUtils() {
        }
        var d = __define,c=SortUtils,p=c.prototype;
        SortUtils.sortNum = function (a, b) {
            return a - b;
        };
        SortUtils.random = function (a, b) {
            return Math.random() - 0.5;
        };
        return SortUtils;
    }());
    game.SortUtils = SortUtils;
    egret.registerClass(SortUtils,'game.SortUtils');
})(game || (game = {}));
