/**
 *
 * @author
 *
 */
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero(id) {
        _super.call(this);
        this.id = id;
        var heroData = GameManager.HeroDic[id];
        this.height = heroData.width;
        this.width = heroData.height;
        this.createAnim(heroData.anim);
        this.upAs = heroData.upAs;
        this.downAs = heroData.downAs;
        this.isUp = false;
        this.speed = 0;
    }
    var d = __define,c=Hero,p=c.prototype;
    p.createAnim = function (anim) {
        var mcData = RES.getRes(anim + "_json");
        var mcTexture = RES.getRes(anim + "_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        this.heroAni = new egret.MovieClip(mcDataFactory.generateMovieClipData(anim));
        this.heroAni.gotoAndPlay(1, -1);
        this.addChild(this.heroAni);
        this.heroAni.anchorOffsetX = -this.width / 2;
        this.heroAni.anchorOffsetY = -this.height;
    };
    p.setGun = function (id) {
    };
    p.Update = function (deltaTime) {
        var as = -this.downAs;
        if (this.isUp) {
            as += this.upAs;
        }
    };
    return Hero;
}(egret.DisplayObjectContainer));
egret.registerClass(Hero,'Hero');
var HeroState;
(function (HeroState) {
})(HeroState || (HeroState = {}));
