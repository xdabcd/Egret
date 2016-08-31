/**
 *
 * 消息中心
 *
 */
class GameMessageCenter {
    /**  消息处理者 */
    private static _handler: GameScene;
	
    /**
     * 注册消息处理者
     */ 
    public static register(handler: any) {
        this._handler = handler;
    }
    
    /**
     * 处理消息
     */ 
    public static handleMessage(message: GameMessage, data: any){
	    this._handler.handleMessage(message, data);
	}
}

enum GameMessage{
    /** 创建子弹 */
    CreateBullet = 1,
    /** 移除子弹 */
    RemoveBullet = 2
}