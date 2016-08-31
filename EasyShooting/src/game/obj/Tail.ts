/**
 *
 * 拖尾效果
 *
 */
class Tail extends egret.Shape {
    /** 轨迹点数组 */
    private mPoints: any[] = [];
    /** 宽度 */
    private size: number;
    /** 颜色 */
    private color: number;
    /** 状态 1: normal 2: clear */
    private state: number;

    public constructor() {
        super();
    }

    /**
     * 初始化
     */ 
    public init(size: number,color: number) {
        this.size = size;
        this.color = color;
        this.state = 1;
        TimerManager.doFrame(1,0,this.update,this);
    }

    /**
     * 添加轨迹点
     */ 
    public addPoint(x: number,y: number) {
        var obj = { sx: x,sy: y,size: this.size };
        this.mPoints.push(obj);
    }
    
    /**
     * 清除
     */ 
    public clear() {
        this.state = 2;
    }

    /**
     * 更新
     */ 
    private update(time: number) {
        if(this.mPoints.length == 0) return;
        /** 清除状态：逐帧清点，清完摧毁 */
        if(this.state == 2) {
            this.mPoints.splice(i,1);
            if(this.mPoints.length == 0) {
                this.destory();
            }
        }
        var mg: egret.Graphics = this.graphics;
        mg.clear();
        
        /** 定义轨迹宽度，清除多余点 */
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

        /** 画出轨迹 */
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
                mg.lineStyle(size + (size1 - size) / count * j,this.color,alpha);
                mg.moveTo(sx + (sx1 - sx) / count * j,sy + (sy1 - sy) / count * j);
                mg.lineTo(sx + (sx1 - sx) / count * (j + 1),sy + (sy1 - sy) / count * (j + 1));
                alpha += 0.002;
            }
        }
    }

    /**
     * 摧毁
     */ 
    public destory(): void {
        TimerManager.remove(this.update,this);
        DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    }
}
