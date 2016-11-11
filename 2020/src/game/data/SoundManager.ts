/**
 *
 * 声音管理器
 *
 */
class SoundManager {
    private static soundDic: { [name: string]: egret.Sound } = {};
    private static music: egret.SoundChannel;
    private static effectArr: Array<egret.SoundChannel> = [];
    private static volum: number = 1;

    /**
     * 播放背景音乐
     */
    public static playMusic(): void {
        if (!this.soundOn)
            return;

        if (!this.music) {
            var sound = this.getSound("music_mp3");
            if (!sound) {
                return;
            }
            sound.type = egret.Sound.MUSIC;
            this.music = sound.play(0, 0);
        }
    }

    /**
     * 停止背景音乐
     */
    public static stopMusic(): void {
        if (this.music) {
            this.music.stop();
            this.music = null;
        }
    }

    /**
     * 播放音效
     * @param effectName
     */
    public static playEffect(effectName: string): void {
        if (!this.soundOn)
            return;

        var sound = this.getSound(effectName);
        sound.type = egret.Sound.EFFECT;
        var channel = sound.play(0, 1);
        channel.volume = this.volum;
        this.effectArr.push(channel);
        channel.addEventListener(egret.Event.SOUND_COMPLETE, () => {
            ArrayUtils.remove(this.effectArr, channel);
        }, this);
    }

    public static setVolum(value: number) {
        this.volum = value;
        for (let i = 0; i < this.effectArr.length; i++) {
            this.effectArr[i].volume = value;
        }
        if(this.music){
            this.music.volume = value;
        }   
    }

    private static getSound(name: string): egret.Sound {
        var sound = this.soundDic[name];
        if (!sound) {
            sound = RES.getRes(name);
            this.soundDic[name] = sound;
        }
        return sound;
    }

    private static get soundOn(): boolean {
        return !PlayerDataManager.isMute;
    }
}