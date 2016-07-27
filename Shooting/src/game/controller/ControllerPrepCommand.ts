/**
 *
 * @author 
 *
 */
class ControllerPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand {
    public constructor() {
        super();
    }

    public execute(notifica: puremvc.INotification): void {
        (new GameCommand()).register();
        (new SceneCommand()).register();
    }
}