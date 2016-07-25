/**
 * Created by yangsong on 15-1-14.
 * 背景音乐类
 */
var SoundBg = (function (_super) {
    __extends(SoundBg, _super);
    /**
     * 构造函数
     */
    function SoundBg() {
        _super.call(this);
        this._currBg = "";
    }
    var d = __define,c=SoundBg,p=c.prototype;
    /**
     * 停止当前音乐
     */
    p.stop = function () {
        if (this._currSoundChannel) {
            this._currSoundChannel.stop();
        }
        this._currSoundChannel = null;
        this._currSound = null;
        this._currBg = "";
    };
    /**
     * 播放某个音乐
     * @param effectName
     */
    p.play = function (effectName) {
        if (this._currBg == effectName)
            return;
        this.stop();
        this._currBg = effectName;
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
        this._currSound = sound;
        this._currSoundChannel = this._currSound.play(0, 1);
        this._currSoundChannel.volume = this._volume;
    };
    /**
     * 设置音量
     * @param volume
     */
    p.setVolume = function (volume) {
        this._volume = volume;
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    };
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    p.loadedPlay = function (key) {
        if (this._currBg == key) {
            this.playSound(RES.getRes(key));
        }
    };
    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
    p.checkCanClear = function (key) {
        return this._currBg != key;
    };
    return SoundBg;
}(BaseSound));
egret.registerClass(SoundBg,'SoundBg');
