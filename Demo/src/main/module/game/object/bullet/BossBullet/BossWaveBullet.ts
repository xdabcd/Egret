/**
 *
 * @author 
 *
 */
class BossWaveBullet extends BossBullet{
    public get rect(): Rect {
        var width = this.width * this.img.scaleX;
        var height = this.height * this.img.scaleY;
        return new Rect(this.x + width * 0.4 * this.scaleX,this.y,width * 0.2,height,this.rotation);
    }
}
