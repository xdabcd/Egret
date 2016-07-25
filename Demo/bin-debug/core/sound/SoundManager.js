/**
 * Created by yangsong on 15-1-14.
 * Sound管理类
 */
var SoundManager = (function (_super) {
    __extends(SoundManager, _super);
    /**
     * 构造函数
     */
    function SoundManager() {
        _super.call(this);
        this.bgOn = true;
        this.effectOn = true;
        this.bgVolume = 0.5;
        this.effectVolume = 0.5;
        this.bg = new SoundBg();
        this.bg.setVolume(this.bgVolume);
        this.effect = new SoundEffects();
        this.effect.setVolume(this.effectVolume);
    }
    var d = __define,c=SoundManager,p=c.prototype;
    /**
     * 播放音效
     * @param effectName
     */
    p.playEffect = function (effectName) {
        if (!this.effectOn)
            return;
        this.effect.play(effectName);
    };
    /**
     * 播放背景音乐
     * @param key
     */
    p.playBg = function (bgName) {
        this.currBg = bgName;
        if (!this.bgOn)
            return;
        this.bg.play(bgName);
    };
    /**
     * 停止背景音乐
     */
    p.stopBg = function () {
        this.bg.stop();
    };
    /**
     * 设置音效是否开启
     * @param $isOn
     */
    p.setEffectOn = function ($isOn) {
        this.effectOn = $isOn;
    };
    /**
     * 设置背景音乐是否开启
     * @param $isOn
     */
    p.setBgOn = function ($isOn) {
        this.bgOn = $isOn;
        if (!this.bgOn) {
            this.stopBg();
        }
        else {
            if (this.currBg) {
                this.playBg(this.currBg);
            }
        }
    };
    /**
     * 设置背景音乐音量
     * @param volume
     */
    p.setBgVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.bgVolume = volume;
        this.bg.setVolume(this.bgVolume);
    };
    /**
     * 获取背景音乐音量
     * @returns {number}
     */
    p.getBgVolume = function () {
        return this.bgVolume;
    };
    /**
     * 设置音效音量
     * @param volume
     */
    p.setEffectVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.effectVolume = volume;
        this.effect.setVolume(this.effectVolume);
    };
    /**
     * 获取音效音量
     * @returns {number}
     */
    p.getEffectVolume = function () {
        return this.effectVolume;
    };
    /**
     * 音乐文件清理时间
     * @type {number}
     */
    SoundManager.CLEAR_TIME = 3 * 60 * 1000;
    return SoundManager;
}(BaseClass));
egret.registerClass(SoundManager,'SoundManager');
