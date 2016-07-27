module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class ViewPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand {
		public constructor() {
            super();
		}
		
        public execute(notifica : puremvc.INotification) : void { 
            var main: AppContainer = notifica.getBody();
            this.facade.registerMediator(new AppMediator(main));
        }
	}
}
