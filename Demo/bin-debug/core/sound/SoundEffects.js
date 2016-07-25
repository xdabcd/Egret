/**
 * Created by yangsong on 15-1-14.
 * 音效类
 */
var SoundEffects = (function (_super) {
    __extends(SoundEffects, _super);
    /**
     * 构造函数
     */
    function SoundEffects() {
        _super.call(this);
    }
    var d = __define,c=SoundEffects,p=c.prototype;
    /**
     * 播放一个音效
     * @param effectName
     */
    p.play = function (effectName) {
        var sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    };
    /**
     * 播放
     * @param sound
     */
    p.playSound = function (sound) {
        var channel = sound.play(0, 1);
        channel.volume = this._volume;
    };
    /**
     * 设置音量
     * @param volume
     */
    p.setVolume = function (volume) {
        this._volume = volume;
    };
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    p.loadedPlay = function (key) {
        this.playSound(RES.getRes(key));
    };
    return SoundEffects;
}(BaseSound));
egret.registerClass(SoundEffects,'SoundEffects');
