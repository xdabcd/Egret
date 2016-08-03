/**
 *
 * @author 
 *
 */
class BaseGameObject extends egret.DisplayObjectContainer {
    public controller: BaseController;
    private _side: Side;

    public constructor($controller: BaseController) {
        super();
        this.controller = $controller;
    }

    public init(side: Side, ...args: any[]): void {
        this._side = side;
        AnchorUtil.setAnchor(this, 0.5);
        App.TimerManager.doFrame(1,0,this.onFrame,this);
    }

    public destory(): void {
        App.TimerManager.remove(this.onFrame,this);
        App.DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }

    private onFrame(time: number): void {
        this.update(time);
    }
    
    public update(time: number): void {

    }

    public get gameController(): GameController {
        return <GameController>this.controller;
    }
    
    public get side(): Side{
        return this._side;
    }
    
    public get rect(): egret.Rectangle{
        return new egret.Rectangle(this.x - this.width / 2, this.y - this.width / 2, this.width, this.height);
    }
}

enum Side{
    Own,
    Enemy,
    Middle
}
