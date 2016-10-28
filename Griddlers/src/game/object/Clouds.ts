/**
 *
 * 云
 *
 */
class Clouds extends egret.DisplayObjectContainer {
    private clouds: Array<egret.Bitmap>;

    public constructor(){
        super();
        this.clouds = [];

        for (let i: number = 0; i < 8; i++) {
            let x: number = RandomUtils.limit(-1, 2) * StageUtils.stageW;
            let y: number = (i + 0.5) * StageUtils.stageH / 9;
            let img: string = "spritesheet.griddlers-cloud" + RandomUtils.limitInteger(1, 5);
            let clound = DisplayUtils.createBitmap(img);
            clound.x = x;
            clound.y = y;
            this.clouds.push(clound);
            this.addChild(clound);
            this.moveCloud(clound);
        }
    }

    private moveCloud(cloud: egret.Bitmap) {
        var w = StageUtils.stageW;
        if (cloud.x <= -w) {
            cloud.x = w * 2;
        }
        egret.Tween.get(cloud).to({ x: -w, y: cloud.y }, (cloud.x + w) * 20)
            .call(() => {
                this.moveCloud(cloud);
            }, this);
    }
}
