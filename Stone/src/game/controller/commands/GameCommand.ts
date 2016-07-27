module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class GameCommand extends puremvc.SimpleCommand implements puremvc.ICommand {
		public constructor() {
            super();
		}
		
        public static NAME: string = "GameCommand";
        
        /** 开始游戏 */
        public static START_GAME:string = "start_game";
        
        /** 点击宝石 */
        public static CLICK_GEMSTONE:string = "click_gemstone";
        
        /** 操作结束 */
        public static HANDLE_COMPLETE: string = "handle_complete";
        
        /** 去操作 */
        public static TO_HANDLE: string = "to_handle";
        
        /** 结束游戏 */
        public static FINISH_GAME:string = "finish_game";
        
        /*
         * 注册消息
         */ 
        public register() : void { 
            this.facade.registerCommand(GameCommand.START_GAME , GameCommand);
            this.facade.registerCommand(GameCommand.CLICK_GEMSTONE , GameCommand);
            this.facade.registerCommand(GameCommand.HANDLE_COMPLETE,GameCommand);
            this.facade.registerCommand(GameCommand.TO_HANDLE,GameCommand);
            this.facade.registerCommand(GameCommand.FINISH_GAME , GameCommand);
        }
        
        public execute(notifica : puremvc.INotification): void { 
            var battleProxy: BattleProxy = <BattleProxy><any> (this.facade.retrieveProxy(BattleProxy.NAME));
            var gridProxy:GridProxy = <GridProxy><any> (this.facade.retrieveProxy(GridProxy.NAME));
            var data:any = notifica.getBody();
            switch(notifica.getName()){
                case GameCommand.START_GAME:{
                    this.sendNotification(SceneCommand.CHANGE,SceneId.Game);
                    battleProxy.reset();
                    gridProxy.reset();
                    battleProxy.start();
                    break;
                }
                
                case GameCommand.CLICK_GEMSTONE:{
                    gridProxy.clickGemstone(<Vector2><any> data);
                    break;
                }
                
                case GameCommand.HANDLE_COMPLETE: {
                    battleProxy.doHandleEffect(<Array<Array<number>>><any> data);
                    break;
                }
              
                case GameCommand.TO_HANDLE: {
                    gridProxy.toIdle();
                    break;
                }
                
                case GameCommand.FINISH_GAME:{
                   
                }
            }
        }
	}
}
