/**
 *
 * @author 
 *
 */
class GameSceneMediator extends puremvc.Mediator implements puremvc.IMediator {
    public static NAME: string = "GameSceneMediator";

    public constructor(viewComponent: any) {
        super(GameSceneMediator.NAME,viewComponent);
    }


    public listNotificationInterests(): Array<any> {
        return [
            GameProxy.INIT
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        var data: any = notification.getBody();
        switch(notification.getName()) {
            case GameProxy.INIT: {
                this.gameScene.init(data.width,data.height,data.uiHeight);
                break;
            }
        }
    }

    public get gameScene(): GameScene {
        return <GameScene><any>(this.viewComponent);
    }
}