module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class StartScr extends egret.gui.SkinnableComponent {
		public constructor() {
            super();
            this.skinName = skins.StartScrSkin;
            this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE,this.createCompleteEvent,this);
		}
		
        public createCompleteEvent(event : egret.gui.UIEvent) : void { 
            this.removeEventListener(egret.gui.UIEvent.CREATION_COMPLETE,this.createCompleteEvent,this);
            AppFacade.getInstance().registerMediator(new StartScrMediator(this));   
        }        
        
        public startBtn: egret.gui.Button;
	}
}
