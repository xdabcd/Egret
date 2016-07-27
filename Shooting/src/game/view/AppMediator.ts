/**
 *
 * @author 
 *
 */
class AppMediator extends puremvc.Mediator implements puremvc.IMediator {
    public constructor(viewComponent: any) {
        super(AppMediator.NAME,viewComponent);
    }

    public static NAME: string = "AppMediator";

    public listNotificationInterests(): Array<any> {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        switch(notification.getName()) {
        }
    }

    public get main(): AppContainer {
        return <AppContainer><any>(this.viewComponent);
    }
}