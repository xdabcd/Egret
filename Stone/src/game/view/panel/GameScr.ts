module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class GameScr extends egret.gui.SkinnableComponent {
        public constructor() {
            super();
            this.skinName = skins.GameScrSkin;
            this.addEventListener(egret.gui.UIEvent.CREATION_COMPLETE , this.createCompleteEvent, this);
        }
        
        public createCompleteEvent(event:egret.gui.UIEvent):void{
            this.removeEventListener(egret.gui.UIEvent.CREATION_COMPLETE , this.createCompleteEvent, this);
            AppFacade.getInstance().registerMediator( new GameScrMediator(this) );
        }
        
        public gridSceneUI: GridScene;
        public battleSceneUI: BattleScene;
	}
}
