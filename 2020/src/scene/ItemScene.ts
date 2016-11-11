/**
 *
 * 道具界面
 *
 */
class ItemScene extends BaseScene {
    private _initFlag = false;
    private _callBack: Function;

    /**
     * 初始化
     */
    protected init() {
        super.init();
        this.alpha = 0;

        if (!this._initFlag) {
            this._initFlag = true;
            var textArr = [
                "Change\nupcoming\ncells",
                "Clear\none cell",
                "Clear 5\nRandom\ncells",
                "Clear\ntype"
            ];
            for (let i = 1; i <= 4; i++) {
                var con = new egret.DisplayObjectContainer;
                this.addChild(con);
                con.x = -90;
                con.y = 280 + 170 * (i - 1);
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
                let label = new Label;
                con.addChild(label);
                label.size = 40;
                label.text = textArr[i - 1];
                label.x = -170;
                label.y = 0;
            }
            this.visible = false;
            this.onResize();
        }
    }

    protected onResize() {
        super.onResize();

        var w = StageUtils.stageW;
        var h = StageUtils.stageH;

        if (this.visible && this.alpha == 1) {
            this.x = w
        } else if(!this.visible && this.alpha == 0){
            this.x = w + 400;
        }
    }

    public setCallBack(call: Function) {
        this._callBack = call;
    }

    public show() {
        this.visible = true;
        egret.Tween.get(this).to({ x: StageUtils.stageW }, 350, egret.Ease.backOut);
        egret.Tween.get(this).to({ alpha: 1 }, 250);
    }

    public hide() {
        this.visible = false;
        egret.Tween.get(this).to({ x: StageUtils.stageW + 400 }, 350, egret.Ease.backIn);
        egret.Tween.get(this).to({ alpha: 0 }, 250);
    }
}