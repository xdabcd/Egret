/**
 *
 * @author 
 *
 */
class Item extends BaseGameObject{
    
    private id: number;
    private speed: number;
    private awardGun: number;
    
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number,side: Side): void {
        super.init(side);
        this.id = id;
        
        var itemData = GameManager.GetItemData(id);
        this.speed = itemData.speed;
        this.awardGun = itemData.awardGun;
        
        this.width = 60;
        this.height = 60;
        
        var sh = new egret.Shape();
        sh.graphics.beginFill(0xffff00);
        sh.graphics.drawRect(0,0,60,60);
        sh.graphics.endFill();
        this.addChild(sh);
    }
    
    public update(time: number) {
        super.update(time);
        var t = time / 1000;
        this.y += this.speed * t;
        
        if(this.gameController.CheckOutScreen(this)) {
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.RemoveItem,this);
        }
    }
    
    public GetAward(): number{
        return this.awardGun;
    }
}
