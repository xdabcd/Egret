/**
 *
 * @author 
 *
 */
class RecParticle extends egret.DisplayObjectContainer {
   
    public boundryLeft:number = 0;
    public boundryTop:number = 0;
    public boundryRight: number = 0;
    public boundryBottom: number = 0;
    public speedX:number = 0;
    public speedY:number = 0;
    public fadeSpeed:number = 0;
    public rec:egret.Shape;
    private _size:number
    public constructor(size:number) {
        super();
        this._size=size;
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }
    private onAddToStage(event: egret.Event) {
        var rr=Math.random();
        this.rec = new egret.Shape();
        if(rr<0.3)
            this.rec.graphics.beginFill(0xffbcc0,1);
        else if(rr<0.7)
            this.rec.graphics.beginFill(0x50d3f2,1);
        else
            this.rec.graphics.beginFill(0xfff9bc,1);
        this.rec.graphics.drawRect(0,0,this._size*16,this._size*9);
        this.rec.graphics.endFill();

        this.addChild(this.rec);
    }
    
}



    
		
	