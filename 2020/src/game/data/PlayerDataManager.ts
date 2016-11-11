/**
 *
 * 玩家数据管理器
 *
 */
class PlayerDataManager {
    private static playerData: PlayerData;
    private static soundBtnList: Array<Button> = [];
    private static _score: number;
    private static _getScore: number;
    private static _getCoin: number;
    private static _connected: number;
    private static _cnt: number;
    private static _hs: boolean;

    public static reset() {
        this._score = 0;
        this._getScore = 0;
        this._getCoin = 0;
        this._connected = 0;
        this._cnt = 0;
        this._hs = false;
    }

    public static save() {
        egret.localStorage.setItem('hex_2020_data', JSON.stringify(this.playerData));
    }

    public static load() {
        var item = egret.localStorage.getItem('hex_2020_data');
        if (item) {
            this.playerData = JSON.parse(item);
        } else {
            this.playerData = new PlayerData();
        }
    }

    public static addScore(value: number): boolean {
        this._score += value;
        if (this._score > this.playerData.record) {
            this.playerData.record = this._score;
            this.save();
            if (!this._hs) {
                SoundManager.playEffect("highscore_mp3");
                this._hs = true;
                return true;
            }
        }
        return false;
    }

    public static get score(): number {
        return this._score;
    }

    public static addCoin(value: number): boolean {
        if (this.playerData.coin + value < 0) {
            return false;
        }
        this.playerData.coin += value;
        this.save();
        return true;
    }

    public static checkExtra(): number {
        if (this._cnt + 1 == 3) {
            return 10;
        } else if (this._cnt + 1 == 5) {
            return 20;
        }
        return 0;
    }

    public static get coin() {
        return this.playerData.coin;
    }

    public static get record() {
        return this.playerData.record;
    }

    public static connect(blockValue: number, cnt: number): Array<number> {
        if (this._cnt >= 5) {
            this._cnt = 0;
        }
        this._cnt += 1;
        var score = 0;
        var coin = 0;
        score += blockValue * cnt;
        coin += cnt - 3;
        if (this._cnt == 3) {
            score += 32;
            coin += 5;
        } else if (this._cnt == 5) {
            score += 128;
            coin += 15;
        }

        this._getScore += score;
        this._getCoin += coin;
        this._connected += 1;
        return [score, coin];
    }

    public static clearCnt() {
        this._cnt = 0;
    }

    public static getResult() {
        return [this._getScore, this.playerData.record, this._connected, this._getCoin];
    }

    public static setMute(mute: boolean) {
        this.playerData.mute = mute;
        this.soundBtnList.forEach(btn => {
            btn.setSprite(mute ? "soundoff_png" : "soundon_png");
        });
        if (mute) {
            SoundManager.stopMusic();
        } else {
            SoundManager.playMusic();
        }
        this.save();
    }

    public static get isMute(): boolean {
        return this.playerData.mute;
    }

    public static get isFirstTime(): boolean {
        return this.playerData.firstTime;
    }

    public static tutorialOver() {
        this.playerData.firstTime = false;
        this.save();
    }

    public static registerSoundBtn(btn: Button) {
        if (this.soundBtnList.indexOf(btn) < 0) {
            this.soundBtnList.push(btn);
            this.setMute(this.playerData.mute);
        }
    }
}