/**
 *
 * 关卡类型列表
 *
 */
class CatsGroup extends egret.DisplayObjectContainer {
    private htpBtn: Button;
    private catBtns: Array<CatButton>;

    public constructor() {
        super();
        let w = StageUtils.stageW;
        let h = StageUtils.stageH;
        this.x = w / 2;
        this.y = h * 0.3;

        var htpBtn: Button = ObjectPool.pop("Button");
        htpBtn.init("spritesheet.how_to_play_button");
        htpBtn.setTextLabel(DataManager.getTxt("How to play?"));
        htpBtn.x = w;
        htpBtn.y = 0;
        htpBtn.setOnTap(() => {
            //TODO
        });
        this.addChild(htpBtn);
        this.htpBtn = htpBtn;

        var usedIndex = 1;
        var cats = DataManager.getCats();
        this.catBtns = [];
        cats.forEach(cat => {
            if (cat.active) {
                let catBtn: CatButton = ObjectPool.pop("CatButton");
                catBtn.initBtn(cat);
                catBtn.x = w;
                catBtn.y = usedIndex * 120;
                usedIndex++;
                this.addChild(catBtn);
                this.catBtns.push(catBtn);
            }
        });

        this.$children.forEach(child => {
            child.touchEnabled = false;
            if (DeviceUtils.IsPC) {
                child.alpha = 0;
            }
        });

    }

    private moveTo(x: number, immediately: boolean) {
        if (immediately) {
            this.$children.forEach(btn => {
                btn.x = x;
            });
        } else {
            var delayIncrease = Math.floor(250 / this.$children.length);
            var delay = 250;
            this.$children.forEach(btn => {
                egret.Tween.get(btn).wait(delay).to({ x: x }, 500, egret.Ease.sineInOut);
                delay += delayIncrease;
            });
        }
    };

    public show(immediately: boolean) {
        this.moveTo(0, immediately);

        var delayIncrease = Math.floor(250 / this.$children.length);
        var delay = 250;
        this.$children.forEach(btn => {
            btn.touchEnabled = true;

            if (immediately) {
                btn.alpha = 1;
            } else {
                btn.alpha = 0;
                egret.Tween.get(btn).wait(delay).to({ alpha: 1 }, 500, egret.Ease.sineInOut);
                delay += delayIncrease;
            }

        });

    }

    public hideRight(immediately: boolean) {
        var w = StageUtils.stageW;
        this.moveTo(w, immediately);

        var delayIncrease = Math.floor(250 / this.$children.length);
        var delay = 250;
        this.$children.forEach(btn => {
            btn.touchEnabled = false;

            if (immediately) {
                btn.alpha = 0;
            } else {
                btn.alpha = 1;
                egret.Tween.get(btn).wait(delay).to({ alpha: 0 }, 500, egret.Ease.sineInOut);
                delay += delayIncrease;
            }
        });
    }

    public hideLeft(immediately: boolean) {
        var w = StageUtils.stageW;
        this.moveTo(-w, immediately);

        var delayIncrease = Math.floor(250 / this.$children.length);
        var delay = 250;
        this.$children.forEach(btn => {
            btn.touchEnabled = false;

            if (immediately) {
                btn.alpha = 0;
            } else {
                btn.alpha = 1;
                egret.Tween.get(btn).wait(delay).to({ alpha: 0 }, 500, egret.Ease.sineInOut);
                delay += delayIncrease;
            }
        });
    }

    public setCatTap(callBack: Function){
        this.catBtns.forEach(btn=>{
            btn.setOnTap(()=>{
                callBack(btn.catData);
            });
        })
    }
}
