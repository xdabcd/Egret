/**
 *
 * @author 
 *
 */
class Tail extends egret.Shape{
    private mg: egret.Graphics;
    private mPoints: any[] = [];
    private size: number;
    private color: number;
    /** 1: normal 2: clear */
    private state: number;
    
    public constructor() {
        super();
        this.mg = this.graphics;
    }
    
    public init(size: number, color: number){
        this.size = size;
        this.color = color;
        this.state = 1;
        App.TimerManager.doFrame(1,0,this.update,this);
    }
   
    public addPoint(x: number, y: number){
        var obj = { sx: x, sy: y, size: this.size };
        this.mPoints.push(obj);
    }
    
    public clear(){
        this.state = 2;
    }
    
    private update(time: number){
        if(this.mPoints.length == 0) return;
        if(this.state == 2){
            this.mPoints.splice(i,1);
            if(this.mPoints.length == 0){
                this.destory();
            }
        }
        this.mg.clear();
        var _count: number = this.mPoints.length;

        for(var i: number = 0;i < _count;i++) {
            var pt = this.mPoints[i];
            pt.size -= 2;
            if(pt.size < 0) {
                this.mPoints.splice(i,1);
                i--;
                _count = this.mPoints.length;
            }
        }
        _count = this.mPoints.length;

        var alpha = 0.1;
        for(i = 1;i < _count;i++) {
            var p = this.mPoints[i];
            var count = 5;
            var sx = this.mPoints[i - 1].sx;
            var sy = this.mPoints[i - 1].sy;
            var sx1 = p.sx;
            var sy1 = p.sy;
            var size = this.mPoints[i - 1].size;
            var size1 = p.size;
            for(var j = 0;j < count;j++) {
                this.mg.lineStyle(size + (size1 - size) / count * j, this.color,alpha);
                this.mg.moveTo(sx + (sx1 - sx) / count * j,sy + (sy1 - sy) / count * j);
                this.mg.lineTo(sx + (sx1 - sx) / count * (j + 1),sy + (sy1 - sy) / count * (j + 1));
                alpha += 0.002;
            }
        }
    }
    
    public destory(): void {
        App.TimerManager.remove(this.update,this);
        App.DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}
