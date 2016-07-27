module game {
	/**
	 *
	 * @author 
	 *
	 */
	export class SceneCommand extends puremvc.SimpleCommand implements puremvc.ICommand{
		public constructor() {
            super();
		}
		
        public static NAME: string = "SceneCommand";
        
        /**
        * 切换场景
        */
        public static CHANGE:string = "scene_change";
                
        
        /*
         * 注册消息
         */ 
        public register(): void { 
            this.facade.registerCommand(SceneCommand.CHANGE , SceneCommand);
        }
        
        public execute(notifica: puremvc.INotification): void { 
            var data:any = notifica.getBody();
            var appMediator:AppMediator =
            <AppMediator><any>this.facade.retrieveMediator(AppMediator.NAME);
            
            switch(notifica.getName()){
                case SceneCommand.CHANGE:
                    switch(data){
                        case SceneId.Start: 
                            appMediator.main.enterStartScreen();
                            break;
                        case SceneId.Game:
                            appMediator.main.enterGameScreen();
                    }
                    break;
            }
        }
	}
}
