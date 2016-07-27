var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var BattleSceneMediator = (function (_super) {
        __extends(BattleSceneMediator, _super);
        function BattleSceneMediator(viewComponent) {
            _super.call(this, BattleSceneMediator.NAME, viewComponent);
        }
        var d = __define,c=BattleSceneMediator,p=c.prototype;
        p.listNotificationInterests = function () {
            return [
                game.BattleProxy.HERO_CREATE,
                game.BattleProxy.ENEMY_CREATE,
                game.BattleProxy.HERO_ATTACK,
                game.BattleProxy.ENEMY_ATTACK,
                game.BattleProxy.UPDATE_ENEMY_ROUND,
                game.BattleProxy.UPDATE_ENEMY_HP_PER,
                game.BattleProxy.ENEMY_HURT
            ];
        };
        p.handleNotification = function (notification) {
            var data = notification.getBody();
            switch (notification.getName()) {
                case game.BattleProxy.HERO_CREATE: {
                    this.battleScene.createHeroUI(data);
                    break;
                }
                case game.BattleProxy.ENEMY_CREATE: {
                    this.battleScene.createEnemyUI(data);
                    break;
                }
                case game.BattleProxy.HERO_ATTACK: {
                    var arr = data;
                    this.battleScene.heroToAttack(arr[0], arr[1], arr[2]);
                    break;
                }
                case game.BattleProxy.ENEMY_ATTACK: {
                    this.battleScene.enemyToAttack(data);
                    break;
                }
                case game.BattleProxy.UPDATE_ENEMY_ROUND: {
                    var arr = data;
                    this.battleScene.updateEnemyRound(arr[0], arr[1]);
                    break;
                }
                case game.BattleProxy.UPDATE_ENEMY_HP_PER: {
                    var arr = data;
                    this.battleScene.updateEnemyHpPer(arr[0], arr[1]);
                    break;
                }
                case game.BattleProxy.ENEMY_HURT: {
                    this.battleScene.enemyHurt(data);
                    break;
                }
            }
        };
        d(p, "battleScene"
            ,function () {
                return (this.viewComponent);
            }
        );
        BattleSceneMediator.NAME = "BattleSceneMediator";
        return BattleSceneMediator;
    }(puremvc.Mediator));
    game.BattleSceneMediator = BattleSceneMediator;
    egret.registerClass(BattleSceneMediator,'game.BattleSceneMediator',["puremvc.IMediator","puremvc.INotifier"]);
})(game || (game = {}));
