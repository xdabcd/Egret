/**
 *
 * 声音管理器
 *
 */
class SoundManager {
    private static music: egret.SoundChannel;
    private static musicIsPlay: boolean = false;
    private static position: number = 0;

    public static playMusic() {
        if(PlayerDataManager.isMute) return;
        if (this.music) return;
        var sound: egret.Sound = RES.getRes("music_sfx_mp3");
        sound.type = egret.Sound.MUSIC;
        this.music = sound.play(this.position, 0);
        this.musicIsPlay = true;
    }

    public static stopMusic() {
        if (this.music) {
            this.position = this.music.position;
            this.music.stop();
        }
        this.music = null;
        this.musicIsPlay = false;
    }

    public static playEffect(name: string) {
        if(PlayerDataManager.isMute) return;
        var sound: egret.Sound = RES.getRes(name);
        sound.type = egret.Sound.EFFECT;
        var effect: egret.SoundChannel = sound.play(0, 1);
    }


    public static get isPlayMusic(): boolean {
        return this.musicIsPlay;
    }
}