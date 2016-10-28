/**
 *
 * 关卡类型数据
 *
 */
class ErrParticle extends particle.GravityParticleSystem {
    constructor(){
        var texture = RES.getRes("spritesheet.particles-red-star");
        var config = RES.getRes("err_particles_json");
        super(texture, config);
        this.scaleX = this.scaleY = 3;
    }


}