/**
 *
 * @author 
 *
 */
class BaseGameObject extends egret.DisplayObjectContainer {
    public controller: BaseController;
    private _side: Side;
    protected hitRect: egret.Shape;
    protected showRect: boolean = true;
    
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
        if(this.hitRect != null){
            App.DisplayUtils.removeFromParent(this.hitRect);
            this.hitRect = null;
        }
        
        ObjectPool.push(this);
    }

    private onFrame(time: number): void {
        this.update(time);
        if(this.showRect && this.parent != null){
            if(this.hitRect == null) {
                this.hitRect = new egret.Shape;
                this.parent.addChild(this.hitRect);
            } else {
                var arr: Array<egret.Point> = this.rect.getPoints();
                this.hitRect.graphics.clear();

                for(var i = 0;i < arr.length;i++) {
                    var cur = arr[i];
                    var next;
                    if(i < arr.length - 1) {
                        next = arr[i + 1];
                    } else {
                        next = arr[0];
                    }
                    this.hitRect.graphics.lineStyle(10,0xff00000,0.5);
                    this.hitRect.graphics.moveTo(cur.x,cur.y);
                    this.hitRect.graphics.lineTo(next.x,next.y);
                }
            }
        }
    }
    
    public update(time: number): void {

    }

    public get gameController(): GameController {
        return <GameController>this.controller;
    }
    
    public get side(): Side{
        return this._side;
    }
    
    public get rect(): Rect{
        return new Rect(this.x, this.y, this.width, this.height, this.rotation);
    }
}

enum Side{
    Own,
    Enemy,
    Middle
}
