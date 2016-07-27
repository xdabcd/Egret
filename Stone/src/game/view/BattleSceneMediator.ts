module game {
	/**
	 *
	 * @author 
	 *
	 */
    export class BattleSceneMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "BattleSceneMediator";

        public constructor(viewComponent: any) {
            super(BattleSceneMediator.NAME,viewComponent);
        }

        public listNotificationInterests(): Array<any> {
            return [
                BattleProxy.HERO_CREATE,
                BattleProxy.ENEMY_CREATE,
                BattleProxy.HERO_ATTACK,
                BattleProxy.ENEMY_ATTACK,
                BattleProxy.UPDATE_ENEMY_ROUND,
                BattleProxy.UPDATE_ENEMY_HP_PER,
                BattleProxy.ENEMY_HURT
            ];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch(notification.getName()) {
                case BattleProxy.HERO_CREATE: {
                    this.battleScene.createHeroUI(<Hero><any> data);
                    break;
                }
                case BattleProxy.ENEMY_CREATE: {
                    this.battleScene.createEnemyUI(<Enemy><any> data);
                    break;
                }
                case BattleProxy.HERO_ATTACK: {
                    var arr: Array<number> = <Array<number>><any> data;
                    this.battleScene.heroToAttack(arr[0], arr[1], arr[2]);
                    break;
                }
                case BattleProxy.ENEMY_ATTACK: {
                    this.battleScene.enemyToAttack(<number><any> data);
                    break;
                }
                case BattleProxy.UPDATE_ENEMY_ROUND: {
                    var arr: Array<number> = <Array<number>><any> data;
                    this.battleScene.updateEnemyRound(arr[0], arr[1]);
                    break;
                }
                case BattleProxy.UPDATE_ENEMY_HP_PER: {
                    var arr: Array<number> = <Array<number>><any> data;
                    this.battleScene.updateEnemyHpPer(arr[0],arr[1]);
                    break;
                }
                case BattleProxy.ENEMY_HURT: {
                    this.battleScene.enemyHurt(<number><any> data);
                    break;
                }
            }
        }

        public get battleScene(): BattleScene {
            return <BattleScene><any> (this.viewComponent);
        }
    }
}
