/**
 *
 * @author 
 *
 */
class BaseGameObject extends egret.DisplayObjectContainer {
    private originX: number = 0;
    private originY: number = 0;

    public controller: BaseController;

    public constructor($controller: BaseController) {
        super();
        this.controller = $controller;
    }

    public init(...args: any[]): void {
        App.TimerManager.doFrame(1,0,this.onFrame,this);
    }

    public destory(): void {
        App.TimerManager.remove(this.onFrame,this);
        App.DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }

    private onFrame(time: number): void {
        this.update(time);
        this.setPos();
    }

    public setPos(): void {
        if(this.$getX() != this.originX) {
            this.$setX(this.originX);
        }

        if(this.$getY() != this.originY) {
            this.$setY(this.originY);
        }
    }

    public update(time: number): void {

    }

    public set x(value: number) {
        this.originX = value;
    }

    public set y(value: number) {
        this.originY = value;
    }
    
    public get x(): number {
        return this.originX;
    }

    public get y(): number {
        return this.originY;
    }

    public get gameController(): GameController {
        return <GameController>this.controller;
    }
}
