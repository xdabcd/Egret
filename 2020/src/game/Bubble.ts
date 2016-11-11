/**
 * Created by huang.yaqing on 5/20/16.
 */
class Bubble extends egret.DisplayObjectContainer {

    private particleArray:Array<RecParticle>;

    // Settings
    // private particleMaxSpeed:number = 1.5;
    // private particleFadeSpeed:number = .05;
    private particleTotal:number = 1;
    private particleBirthRate:number = 30;
    private particleCurrentAmount:number = 0;
    private i:number=0;

    private particleGroup:egret.DisplayObjectContainer;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
    }

    private onAddToStage(event:egret.Event) {

        this.particleArray = [];
        this.particleGroup = new egret.DisplayObjectContainer;
        this.addChild(this.particleGroup);
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
    }

    private onEnterFrame(event:egret.Event):void
    {
    this.i++;
    if(this.i%this.particleBirthRate==0){
        this.createParticle();
        // console.log(this.particleCurrentAmount);
    }

    this.updateParticle();
}
    public createParticle(): void {
        //run for loop based on particleTotal
        for(var i: number = 0;i < this.particleTotal;i++) {
            var particle_mc: RecParticle = new RecParticle(2);
            //set position & rotation, alpha
            particle_mc.x = RandomUtils.limit(20,StageUtils.stageW-30);
            particle_mc.y = StageUtils.stageH;
            particle_mc.scaleX = particle_mc.scaleY = RandomUtils.limit(0.1,0.3);
            // particle_mc.alpha = Math.random() * .5 + .5;

            //set speed/direction of fragment
           // particle_mc.speedX = Math.random() * this.particleMaxSpeed - Math.random() * this.particleMaxSpeed;
           // particle_mc.speedY = Math.random() * this.particleMaxSpeed - Math.random() * this.particleMaxSpeed;
           particle_mc.speedX = RandomUtils.limit(-1,2);
           particle_mc.speedY = RandomUtils.limit(1,2);

           // particle_mc.speedX *= this.particleMaxSpeed;
           // particle_mc.speedY *= this.particleMaxSpeed;

            //set fade out speed
            // particle_mc.fadeSpeed = Math.random()*this.particleFadeSpeed;

            //just a visual particle counter
            this.particleCurrentAmount++;

            // add to array
            this.particleArray.push(particle_mc);

            // add to display list
            this.particleGroup.addChild(particle_mc);
        }
    }

    private updateParticle(): void {
        for(var i = 0;i < this.particleArray.length;i++) {
            var tempParticle: RecParticle = this.particleArray[i];

            //update alpha, x, y
            tempParticle.alpha += tempParticle.fadeSpeed;

            tempParticle.x += tempParticle.speedX;
            tempParticle.y -= tempParticle.speedY;
            tempParticle.rotation += 1;
            tempParticle.scaleX = tempParticle.scaleY = tempParticle.scaleX+0.002;

            // if fragment is invisible remove it
            if(tempParticle.x >= StageUtils.stageW+5||tempParticle.x <= -tempParticle.width||tempParticle.y <= -tempParticle.height) {
                this.destroyParticle(tempParticle);
            }
        }
    }

    private destroyParticle(particle: egret.DisplayObject): void {
        for(var i = 0;i < this.particleArray.length;i++) {
            var tempParticle: egret.DisplayObject = this.particleArray[i];
            if(tempParticle == particle) {
                this.particleCurrentAmount--;
                this.particleArray.splice(i,1);
                this.particleGroup.removeChild(tempParticle);
            }
        }
    }
}
