module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class AppContainer extends egret.gui.UIStage {
		public constructor() {
            super();
		}
		
        public startScr: StartScr = new StartScr();
        public gameScr: GameScr = new GameScr();
        
        /**
        * 进入开始页面
        */
        public enterStartScreen():void{
            this.removeAllElements();
            this.addElement(this.startScr);
        }
        
        /**
        * 进入游戏页面
        */
        public enterGameScreen():void{
            this.removeAllElements();
            this.addElement(this.gameScr);
            if(!this.gameScr.initialized)
            {
                //在第一次进入游戏页面时立即验证，保证Mediator的注册是及时的，
                //防止注册不及时导致无法接受消息的情况
                this.gameScr.validateNow();
            }
        }
	}
}
