/**
 *
 * 动画效果管理器
 *
 */
class EffectManager {
    public static getEffect(name: string): egret.MovieClip {
        var data = RES.getRes("effect_json");
        var txtr = RES.getRes("effect_png");
        var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
        var mc1: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData(name));
        return mc1;
    }
}