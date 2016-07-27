module game {
	/**
	 *
	 * @author 
	 *
	 */
    export class GridSceneMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "GridSceneMediator";

        public constructor(viewComponent: any) {
            super(GridSceneMediator.NAME,viewComponent);
        }

        public listNotificationInterests(): Array<any> {
            return [
                GridProxy.GEMSTONE_CREATE,
                GridProxy.GEMSTONE_SELECT,
                GridProxy.GEMSTONE_MOVE,
                GridProxy.GEMSTONE_UNSELECT,
                GridProxy.GEMSTONE_REMOVE,
                GridProxy.GEMSTONE_CHANGE_EFFECT
            ];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch(notification.getName()) {
                case GridProxy.GEMSTONE_CREATE: {
                    this.gridScene.createGemstoneUI(<Gemstone><any> data);
                    break;
                }
                case GridProxy.GEMSTONE_SELECT: {
                    this.gridScene.selectGemstoneUI(<Vector2><any> data);
                    break;
                }
                case GridProxy.GEMSTONE_UNSELECT: {
                    this.gridScene.unGemstoneUI(<Vector2><any> data);
                    break;
                }
                case GridProxy.GEMSTONE_MOVE: {
                    this.gridScene.moveGemstone(<MoveInfo><any> data);
                    break;
                }
                case GridProxy.GEMSTONE_REMOVE: {
                    this.gridScene.removeGemstone(<Vector2><any> data);
                    break;
                }
                case GridProxy.GEMSTONE_CHANGE_EFFECT: {
                    this.gridScene.changeGemstoneEffect(<Gemstone><any> data);
                    break;
                }
            }
        }

        public get gridScene(): GridScene {
            return <GridScene><any> (this.viewComponent);
        }
    }
}
