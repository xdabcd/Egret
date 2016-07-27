module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class ModelPrepCommand extends puremvc.SimpleCommand implements puremvc.ICommand{
		public constructor() {
            super();
		}
		
        public execute(notifica : puremvc.INotification) : void { 
            this.facade.registerProxy(new BattleProxy());
            this.facade.registerProxy(new GridProxy());
            
            
        }
	}
}
