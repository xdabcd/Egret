module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class StartScrMediator extends puremvc.Mediator implements puremvc.IMediator{
		public constructor(viewComponent : any) {
            super(StartScrMediator.NAME,viewComponent);
            
            this.startScr.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP , this.startButtonClick, this);
		}
		
        public static NAME: string = "StartScrMediator";
        
        private startButtonClick(event: egret.TouchEvent) { 
            this.sendNotification(GameCommand.START_GAME);   
        }
        
        public get startScr():StartScr{
            return <StartScr><any> (this.viewComponent);
        }
	}
}
