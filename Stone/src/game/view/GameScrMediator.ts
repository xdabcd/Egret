module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class GameScrMediator extends puremvc.Mediator implements puremvc.IMediator{
    	public constructor(viewComponent : any) {
        	super(StartScrMediator.NAME,viewComponent);
    	}
    			
    	public static NAME: string = "GameScrMediator";
	}
}
