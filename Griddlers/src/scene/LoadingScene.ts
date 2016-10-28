/**
 *
 * 加载进度界面
 *
 */
class LoadingScene extends BaseScene {
    private logo: egret.Bitmap;
    private barBg: egret.Bitmap;
    private bar: egret.Bitmap;
    private m: egret.Sprite;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        this.logo = DisplayUtils.createBitmap("logo_softgames_png");
        this.logo.x = StageUtils.stageW / 2 - this.logo.width / 2;
        this.logo.y = StageUtils.stageH * 0.3;
        this.addChild(this.logo);

        this.barBg = DisplayUtils.createBitmap("loadingbar_bg_png");
        this.barBg.x = StageUtils.stageW / 2 - this.barBg.width / 2;
        this.barBg.y = StageUtils.stageH * 0.7;
        this.addChild(this.barBg);

        this.bar = DisplayUtils.createBitmap("loadingbar_png");
        this.bar.x = this.barBg.x + 13;
        this.bar.y = this.barBg.y + 12;
        this.addChild(this.bar);

        this.m = new egret.Sprite;
        DrawUtils.drawRect(this.m, this.bar.width, this.bar.height, 0x000000);
        this.m.x = this.bar.x - this.bar.width;
        this.m.y = this.bar.y;
        this.addChild(this.m);
        this.bar.mask = this.m;
    }

    /**
     * 更新
     */
    protected update(time: number) {
        super.update(time);

        var t = time / 1000;
    }

    /**
     * 设置进度
     */
    public setProgress(value: number, total: number) {
        this.m.x = this.bar.x - this.bar.width * (total - value) / total;
    }
}
