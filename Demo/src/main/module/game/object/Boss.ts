/**
 *
 * @author 
 *
 */
class Boss extends Unit {
    
    private bossData: BossData;
    private img: egret.Bitmap;
    private min: number;
    private max: number;
    private up: Boolean;
    private hpBg: egret.Shape;
    private hpArr: Array<egret.Shape> = [];
    private shootCd: number;
    
    public constructor($controller: BaseController) {
        super($controller);
    }

    public init(id: number,side: Side): void {
        super.init(id, side);
        this.alpha = 1;
        this.bossData = GameManager.GetBossData(id);
        this.width = this.bossData.width;
        this.height = this.bossData.height;
        this.setImg(this.bossData.img);
        
        this.min = this.gameController.GetPerY(0) + this.height * 0.6;
        this.max = this.gameController.GetPerY(1) - this.height * 0.6;
        this.up = false;
        //血条
        this.hp = 0;
        this.addHp(this.bossData.hp);
        this.state = UnitState.Idle;
        this.shootCd = this.bossData.shootInterval;
    }

    private setImg(img: string) {
        if(this.img == null) {
            this.img = new egret.Bitmap;
            this.addChild(this.img);
        }
        this.img.texture = RES.getRes(img);
        this.img.x = this.bossData.width / 2;
        this.img.y = this.bossData.height / 2;
        this.img.anchorOffsetX = this.img.width / 2;
        this.img.anchorOffsetY = this.img.height / 2;
    }

    protected addHp(value: number) {
        if(this.hpBg == null){
            this.hpBg =  new egret.Shape;
            this.hpBg.graphics.beginFill(0xffffff);
            this.hpBg.graphics.drawRect(0, 0, 30, 300);
            this.hpBg.graphics.endFill();
            this.hpBg.x = this.bossData.width + 30;
            this.hpBg.y = -(300 - this.bossData.height) / 2;
            this.addChild(this.hpBg);
        }
        
        var h = 295 / this.bossData.hp - 5;
        for(let i = this.hp;i < this.hp + value;i++) {
            
            let bar: egret.Shape;
            if(this.hpArr.length > i) {
                bar = this.hpArr[i];
            } else {
                bar = new egret.Shape();
                bar.graphics.beginFill(0xff6100);
                bar.graphics.drawRect(0,-h,20,h);
                bar.graphics.endFill();
                bar.x = this.hpBg.x + 5;
                bar.y = this.hpBg.y + 300 - 5 * (i + 1) -  h * i;
                this.addChild(bar);
                this.hpArr.push(bar);
            }
            egret.Tween.removeTweens(bar);
            bar.visible = true;
            bar.scaleX = bar.scaleY = 0.01;
            App.TimerManager.doTimer(50 * i,1,() => {
                egret.Tween.get(bar).to({ scaleX: 1,scaleY: 1 },300,egret.Ease.elasticOut)
            },this);
        }
        this.hp += value;
    }

    protected subHp(value: number) {
        for(let i = this.hp - 1;i >= Math.max(0,this.hp - value);i--) {
            let bar = this.hpArr[i];
            egret.Tween.removeTweens(bar);
            bar.visible = true;
            bar.scaleX = bar.scaleY = 1;
            App.TimerManager.doTimer(50 * (this.hp - 1 - i),1,() => {
                egret.Tween.get(bar).to({ scaleX: 0.01,scaleY: 0.01 },300,egret.Ease.elasticOut)
                    .call(() => {
                        bar.visible = false;
                    });
            },this);
        }
        this.hp = Math.max(0,this.hp - value);
        if(this.hp <= 0) {
            this.state = UnitState.Die;
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.BossDie);
        }
    }
    
    public Hurt(damage: number) {
        if(damage <= 0) {
            return;
        }
        this.subHp(damage);
    }
    
    private shoot(){
        var x = this.x - this.width / 2 - 100;
        var y = this.y;
        var per = (this.y - this.min) / (this.max - this.min);
        var min = - per * 60;
        var max = 60 - per * 60;
        for(var i = 0; i < 2; i++){
            let moveData = new MoveData(App.RandomUtils.limit(min, max));
            App.ControllerManager.applyFunc(ControllerConst.Game,GameConst.CeateBullet,1001,"BossWaveBullet",this,x,y,moveData);
        } 
    }

    public update(time: number) {
        super.update(time);
        var t = time / 1000;
        
        if(this.state == UnitState.Freez){
            this.freezTime -= t;
            if(this.freezTime <= 0) {
                this.state = UnitState.Idle;
                this.shootCd = this.bossData.shootInterval;
            }
            return;
        }
        
        if(this.shootCd < 0){
            this.shootCd = this.bossData.shootInterval;
            this.shoot();
        }else{
            this.shootCd -= t;
        }
        
        var speed: number = 200;
        if(this.up){
            if(this.y > this.min){
            }else{
                speed *= -1;
                this.up = false;
            }
        }else{
            if(this.y < this.max){
                speed *= -1;
            }else{
                this.up = true;
            }
        }
        this.y -= speed * t;
        

    }
    
    public get rect(): Rect {
        if(this.state == UnitState.Die) {
            return (new Rect(-10000,-10000,0,0,this.rotation));
        }
        return new Rect(this.x,this.y,this.width,this.height,this.rotation);
    }
}
