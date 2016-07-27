/**
 *
 * @author 
 *
 */
class ModelPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand {
    public constructor() {
        super();
    }

    public execute(notifica: puremvc.INotification): void {
        this.facade.registerProxy(new GameProxy());


    }
}