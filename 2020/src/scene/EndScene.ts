/**
 *
 * 结束界面
 *
 */
class EndScene extends BaseScene {
    private _initFlag: boolean = false;
    private _callBack: Function;
    private _giveupFunc: Function;
    private _title: egret.TextField;
    private _items: Array<egret.DisplayObjectContainer>;
    private _labels: Array<egret.TextField>;
    private _nums: Array<egret.TextField>;
    private _coin: egret.TextField;
    private _coinIcon: egret.Bitmap;
    private _giveUp: Button;
    private _addTime: number = 1000;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        this.alpha = 0;
        this.visible = false;

        if (!this._initFlag) {
            this._initFlag = true;
            var title = new Label;
            this.addChild(title);
            title.size = 45;
            title.textColor = 0xfce058;
            title.text = "Use a booster to continue!";
            this._title = title;

            this._items = [];
            for (let i = 3; i <= 4; i++) {
                let con = new egret.DisplayObjectContainer;
                this.addChild(con);
                let btn: Button = ObjectPool.pop("Button");
                con.addChild(btn);
                btn.init("itemBg_png", "item" + i + "_png");
                btn.setSpriteOffset(0, -15);
                btn.setOnTap(() => { this._callBack(i) });
                let price = new Label;
                con.addChild(price);
                price.size = 30;
                price.text = DataManager.getItemPrice(i) + "";
                price.x = 20;
                price.y = 63;
                this._items.push(con);
            }

            var textArr = ["Score", "Record", "Connected"];
            this._labels = [];
            this._nums = [];
            for (let i = 0; i < 3; i++) {
                let label = new Label;
                label.size = 35;
                label.text = textArr[i];
                this.addChild(label);
                this._labels.push(label);

                let num = new Label;
                num.size = 35;
                num.textColor = 0xfce058;
                this.addChild(num);
                this._nums.push(num);
            }

            var icon: egret.Bitmap = DisplayUtils.createBitmap("coin_png");
            AnchorUtils.setAnchorX(icon, 1);
            AnchorUtils.setAnchorY(icon, 0.5);
            this.addChild(icon);
            this._coinIcon = icon;

            this.addChild(this._coin = new Label);
            this._coin.textAlign = "Left";
            AnchorUtils.setAnchorX(this._coin, 0);
            this._coin.size = 35;

            var giveup: Button = ObjectPool.pop("Button");
            this.addChild(giveup);
            giveup.init("giveup_png", "");
            giveup.setOnTap(() => {
                MISO.trigger("gameEnd", null);
                this._giveupFunc()
            });
            this._giveUp = giveup;

            this.onResize();
        }
    }

    protected onResize() {
        super.onResize();

        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        this._title.x = w / 2;
        this._title.y = 280;

        for (let i = 0; i < this._items.length; i++) {
            this._items[i].x = w / 2 + (i - 0.5) * 240;
            this._items[i].y = 430;
        }

        for (let i = 0; i < this._labels.length; i++) {
            var label = this._labels[i];
            var num = this._nums[i];
            label.x = (w / 2) + (i - 1) * 200;
            label.y = 580;
            num.x = label.x;
            num.y = label.y + 60;
        }

        this._coinIcon.x = w / 2 - 15;
        this._coinIcon.y = h - 350;
        this._coin.x = w / 2;
        this._coin.y = this._coinIcon.y;

        this._giveUp.x = w / 2;
        this._giveUp.y = h - 200;
    }

    public setCallBack(call: Function) {
        this._callBack = call;
    }

    public setGiveup(call: Function) {
        this._giveupFunc = call;
    }

    public show() {
        PlayerDataManager.addCoin(200)
        SoundManager.playEffect("blocked_mp3");
        this.visible = true;
        this.alpha = 0;
        egret.Tween.get(this).to({ alpha: 1 }, 250);

        var arr = [this._nums[0], this._nums[1], this._nums[2], this._coin];

        for (let i = 0; i < 4; i++) {
            arr[i].text = "0";
        }

        this._addTime = 0;
    }

    public hide() {
        egret.Tween.get(this).to({ alpha: 0 }, 250).call(() => {
            this.visible = false;
        });
    }

    /**
     * 更新
     */
    protected update(time: number) {
        if (this._addTime >= 1000) {
            return;
        }
        this._addTime += time;

        var arr = [this._nums[0], this._nums[1], this._nums[2], this._coin];
        var result = PlayerDataManager.getResult();
        for (let i = 0; i < 4; i++) {
            arr[i].text = Math.floor(result[i] * Math.min(this._addTime, 1000) / 1000) + "";
        }
    }
}