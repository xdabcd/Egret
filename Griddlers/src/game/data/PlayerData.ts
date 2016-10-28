/**
 *
 * 玩家数据
 *
 */
class PlayerData {
    public stars: Array<Array<number>>;
    public mute: boolean;
    public tapControll: boolean;
    public availableHints: number;

    public setData(data: any) {
        this.stars = data.stars;
        this.mute = data.mute;
        this.tapControll = data.tapControll;
        this.availableHints = data.availableHints;
    }

    public getData() {
        return {
            stars: this.stars,
            mute: this.mute,
            tapControll: this.tapControll,
            availableHints: this.availableHints
        };
    }

    /**
     * 获取关卡星星数
     */
    public getStar(catNr: number, levelNr: number): number {
        if (this.stars && this.stars.length > catNr && this.stars[catNr].length > levelNr) {
            return this.stars[catNr][levelNr];
        }
        return 0;
    }

    /**
     * 设置关卡星星数
     */
    public setStar(catNr: number, levelNr: number, star: number) {
        if (!this.stars) {
            this.stars = [];
        }
        if (!this.stars[catNr]) {
            this.stars[catNr] = [];
        }
        this.stars[catNr][levelNr] = star;
    }

    /**
     * 获取该关卡类型总星星数
     */
    public getStarFromCatNr(catNr: number): number {
        if (this.stars && this.stars.length > catNr) {
            var sum = 0;
            this.stars[catNr].forEach(star => {
                sum += star;
            })
            return sum;
        }
        return 0;
    }

    /**
     * 获取总星星数
     */
    public getAllStar(): number {
        if (this.stars) {
            var sum = 0;
            var index = 0;
            this.stars.forEach(arr => {
                sum += this.getStarFromCatNr(index);
                index += 1;
            })
            return sum;
        }
        return 0;
    }
}