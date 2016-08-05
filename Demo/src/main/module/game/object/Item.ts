/**
 *
 * @author 
 *
 */
class Item extends BaseGameObject{
    
    private id: number;
    private itemData: ItemData;
    private speed: number;
    private direction: number;
    private img: egret.Bitmap;
    /** 1:正常 2:飞向英雄 */
    private state: number;
    private target: Hero;

    private sh: egret.Shape;
    private mg: egret.Graphics;
    private mPoints: any[] = [];
    
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number,side: Side, direction: number): void {
        super.init(side);
        this.id = id;
        this.direction = direction;
        
        this.width = 60;
        this.height = 60;
        this.itemData = GameManager.GetItemData(id);
        this.speed = this.itemData.speed;
        this.setImg(this.itemData.img);
        this.state = 1;
    }
    
    protected setImg(img: string) {
        if(this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.rotation = 0;
        this.img.texture = RES.getRes(img);
        this.img.x = 30;
        this.img.y = 30;
        this.img.anchorOffsetX = this.img.width / 2;
        this.img.anchorOffsetY = this.img.height / 2;
    }
    
    public update(time: number) {
        super.update(time);
        if(this.sh == null) {
            this.sh = new egret.Shape();
            this.parent.addChild(this.sh);
            this.mg = this.sh.graphics;
        }
        
        var t = time / 1000;
        switch(this.state){
            case 1:
                if(this.direction == 0) {
                    this.y += this.speed * t;
                } else {
                    this.y -= this.speed * t;
                }
                break;
            case 2:
                this.drawTrail(0xffffff);
                this.speed += time * 0.9;
                var r = App.MathUtils.getRadian2(this.x,this.y, this.target.x,this.target.y);
                if(this.scaleX == -1) {
                    r = App.MathUtils.getRadian2(this.target.x,this.target.y,this.x,this.y);
                }
                var a = App.MathUtils.getAngle(r);
                this.rotation = a;
                this.x += this.speed * t * Math.cos(this.rotation / 180 * Math.PI) * this.scaleX;
                this.y += this.speed * t * Math.sin(this.rotation / 180 * Math.PI) * this.scaleX;  
                if(App.MathUtils.getDistance(this.x, this.y, this.target.x, this.target.y) < 10) {
                    this.remove();
                    this.target.ChangeGun(this.itemData.awardGun);
                }
                
                break;
        }       
        
        if(this.gameController.CheckOutScreen(this)) {
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.RemoveItem,this);
        }
    }
    
    public ToHero(hero: Hero){
        this.state = 2;
        this.speed = 1000;
        this.target = hero;
        this.setImg(this.itemData.drop);
    }
    
    private drawTrail(color: number) {
        var mPenSize = this.height * 0.5;
        var obj = { sx: this.x,sy: this.y,size: mPenSize };
        this.mPoints.push(obj);
        if(this.mPoints.length == 0) return;
        this.mg.clear();
        var _count: number = this.mPoints.length;

        for(var i: number = 0;i < _count;i++) {
            var pt = this.mPoints[i];
            pt.size -= 1;
            if(pt.size < this.height * 0.2) {
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
                this.mg.lineStyle(size + (size1 - size) / count * j,color,alpha);
                this.mg.moveTo(sx + (sx1 - sx) / count * j,sy + (sy1 - sy) / count * j);
                this.mg.lineTo(sx + (sx1 - sx) / count * (j + 1),sy + (sy1 - sy) / count * (j + 1));
                alpha += 0.002;
            }
        }
    }
    
    private remove() {
        App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.RemoveItem,this);
    }
    
    private clearMg() {
        this.mg.clear();
        this.mPoints = [];
    }
    
    public destory(): void {
        super.destory();
        this.clearMg();
    }
    
    public get rect(): egret.Rectangle {
        var width: number;
        var height: number;
        if(this.state == 1) {
            width = this.width;
            height = this.height;
        } else {
            return(new egret.Rectangle(-10000, -10000, 0,0));
        }
        return new egret.Rectangle(this.x - width / 2,this.y - width / 2,width,height);
    }
}
