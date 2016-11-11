/**
 * Created by huang.yaqing on 5/20/16.
 */
class Burst extends egret.DisplayObjectContainer {

    private particleArray:Array<RecParticle>;

    private particleMaxSpeed:number = 3;
    private particleFadeSpeed:number = 0.5;
    private particleTotal:number = 25;
    private particleRange:number = 300;


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

    public show(){
        this.createExplosion();
    }   

    /**
     * createExplosion(target X position, target Y position)
     */
    private createExplosion(targetX:number = 0, targetY:number = 0):void
    {
        //run for loop based on particleTotal
        for (var i:number = 0; i<this.particleTotal; i++) {
            //attach bitmap from the library with the linked name "adobe_flash"
            this.createParticle(targetX,targetY);



        }
    }


    private onEnterFrame(event:egret.Event):void
    {

        this.updateParticle();
    }
    public createParticle(targetX,targetY): void {
        //run for loop based on particleTotal
        for(var i: number = 0;i < this.particleTotal;i++) {
            var particle_mc: RecParticle = new RecParticle(1);

            //set position & rotation, alpha
            particle_mc.x = targetX
            particle_mc.y = targetY
            particle_mc.rotation = Math.random()*360;
            particle_mc.alpha = Math.random()*0.5+0.5;

            //set particle boundry
            particle_mc.boundryLeft = targetX - this.particleRange;
            particle_mc.boundryTop = targetY - this.particleRange;
            particle_mc.boundryRight = targetX + this.particleRange;
            particle_mc.boundryBottom = targetY + this.particleRange;

            //set speed/direction of fragment
            particle_mc.speedX = Math.random()*this.particleMaxSpeed-Math.random()*this.particleMaxSpeed;
            particle_mc.speedY = Math.random()*this.particleMaxSpeed-Math.random()*this.particleMaxSpeed;
           // particle_mc.speedX *= this.particleMaxSpeed
           // particle_mc.speedY *= this.particleMaxSpeed

            //set fade out speed
            particle_mc.fadeSpeed = Math.random()*this.particleFadeSpeed;

            // add to array
            this.particleArray.push(particle_mc);

            // add to display list
            this.particleGroup.addChild(particle_mc);
        }
    }

    private updateParticle(): void {
        for(var i = 0;i < this.particleArray.length;i++) {
            var tempParticle: RecParticle = this.particleArray[i];

            tempParticle.speedY+=1;
            tempParticle.alpha -= tempParticle.fadeSpeed;
            tempParticle.x += tempParticle.speedX*4;
            tempParticle.y += tempParticle.speedY;
            //if fragment is invisible or out of bounds, remove it
            if (tempParticle.alpha <= 0 ||	tempParticle.x < tempParticle.boundryLeft || tempParticle.x > tempParticle.boundryRight || tempParticle.y < tempParticle.boundryTop || tempParticle.y > tempParticle.boundryBottom)
            {
                this.destroyParticle(tempParticle);

            }



        }
    }

    private destroyParticle(particle: egret.DisplayObject): void {
        for(var i = 0;i < this.particleArray.length;i++) {
            var tempParticle: egret.DisplayObject = this.particleArray[i];
            if(tempParticle == particle) {
                this.particleArray.splice(i,1);
                this.particleGroup.removeChild(tempParticle);
            }
        }
    }
}




