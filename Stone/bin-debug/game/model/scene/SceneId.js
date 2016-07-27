var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var SceneId = (function () {
        function SceneId() {
        }
        var d = __define,c=SceneId,p=c.prototype;
        SceneId.Start = 1;
        SceneId.Game = 2;
        return SceneId;
    }());
    game.SceneId = SceneId;
    egret.registerClass(SceneId,'game.SceneId');
})(game || (game = {}));
