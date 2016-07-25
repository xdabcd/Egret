/**
 * Created by yangsong on 14-12-2.
 * GuideView
 */
var GuideView = (function (_super) {
    __extends(GuideView, _super);
    /**
     * 构造函数
     */
    function GuideView() {
        _super.call(this);
        this._objRec = new egret.Rectangle();
        this._objGlobalPoint = new egret.Point();
        this._bg = new GuideMaskBackgroud();
        this.addChild(this._bg);
        this._maskPic = StarlingSwfUtils.createS9Image("s9_guide_mask");
        this.addChild(this._maskPic);
        this._textBgPic = StarlingSwfUtils.createS9Image("s9_guide_txt");
        AnchorUtil.setAnchorY(this._textBgPic, 1);
        this.addChild(this._textBgPic);
        this._handPic = StarlingSwfUtils.createImage("img_hand");
        AnchorUtil.setAnchorX(this._handPic, 0.5);
        this.addChild(this._handPic);
        this._txt = new egret.TextField();
        this._txt.size = 26;
        this._txt.textColor = 0x575757;
        this._txt.lineSpacing = 4;
        AnchorUtil.setAnchorY(this._txt, 0.5);
        this.addChild(this._txt);
        egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
    }
    var d = __define,c=GuideView,p=c.prototype;
    /**
     * 屏幕大小改变时重置
     */
    p.onResize = function () {
        if (this.stage) {
            egret.setTimeout(this.refurbish, this, 500);
        }
    };
    /**
     * 刷新
     */
    p.refurbish = function () {
        this.setData(this._obj, this._data);
    };
    /**
     * 设置显示数据
     * @param obj
     * @param data
     */
    p.setData = function (obj, data) {
        if (obj == null) {
            return;
        }
        this._obj = obj;
        this._data = data;
        this._obj.localToGlobal(0, 0, this._objGlobalPoint);
        this._obj.getBounds(this._objRec);
        this._objGlobalPoint.x = Math.ceil(this._objGlobalPoint.x);
        this._objGlobalPoint.y = Math.ceil(this._objGlobalPoint.y);
        var tmpX = 15;
        var tmpy = 15;
        this._objRec.x = this._objGlobalPoint.x - tmpX;
        this._objRec.y = this._objGlobalPoint.y - tmpy;
        this._objRec.width += tmpX * 2;
        this._objRec.height += tmpy * 2;
        //不透明区域
        this._bg.init(egret.MainContext.instance.stage.stageWidth, egret.MainContext.instance.stage.stageHeight);
        this._bg.draw(this._objRec);
        //透明区域
        this._maskPic.cacheAsBitmap = false;
        this._maskPic.x = this._objRec.x;
        this._maskPic.y = this._objRec.y;
        this._maskPic.width = this._objRec.width;
        this._maskPic.height = this._objRec.height;
        this._maskPic.cacheAsBitmap = true;
        //handDir  1:下面 2:上面
        if (this._data.handDir == 1) {
            this._handPic.scaleY = 1;
            this._handPic.y = this._objRec.y + this._objRec.height - 20;
        }
        else if (this._data.handDir == 2) {
            this._handPic.scaleY = -1;
            this._handPic.y = this._objRec.y + 20;
        }
        this._handPic.x = this._objRec.x + this._objRec.width * 0.5;
        //文字显示
        this._txt.width = NaN;
        this._txt.height = NaN;
        this._txt.text = this._data.txt;
        if (this._txt.width > 320) {
            this._txt.text = "";
            this._txt.width = 320;
            this._txt.text = this._data.txt;
        }
        var temp = 15;
        this._textBgPic.cacheAsBitmap = false;
        this._textBgPic.width = this._txt.width + temp * 2 + 35;
        this._textBgPic.height = 114;
        //txtdir  箭头指向: 1:背景左箭头下 2:背景左箭头上 3:背景右箭头下 4:背景右箭头上
        if (this._data.txtdir == 1) {
            this._textBgPic.scaleX = -1;
            this._textBgPic.scaleY = 1;
            this._textBgPic.x = this._objRec.x;
        }
        else if (this._data.txtdir == 2) {
            this._textBgPic.scaleX = -1;
            this._textBgPic.scaleY = -1;
            this._textBgPic.x = this._objRec.x;
        }
        else if (this._data.txtdir == 3) {
            this._textBgPic.scaleX = 1;
            this._textBgPic.scaleY = 1;
            this._textBgPic.x = this._objRec.x + this._objRec.width;
        }
        else if (this._data.txtdir == 4) {
            this._textBgPic.scaleX = 1;
            this._textBgPic.scaleY = -1;
            this._textBgPic.x = this._objRec.x + this._objRec.width;
        }
        this.checkTextBgX();
        this._textBgPic.y = this._objRec.y + this._objRec.height * 0.5;
        this._txt.x = this._textBgPic.x - (this._textBgPic.scaleX == -1 ? this._textBgPic.width : -35) + temp;
        this._txt.y = this._textBgPic.y - this._textBgPic.scaleY * this._textBgPic.height * 0.5;
        this._textBgPic.cacheAsBitmap = true;
    };
    /**
     * 检测文本提示框是否出了边界
     */
    p.checkTextBgX = function () {
        if (this._textBgPic.scaleX == 1) {
            var stageW = egret.MainContext.instance.stage.stageWidth;
            if (this._textBgPic.x + this._textBgPic.width > stageW) {
                this._textBgPic.x = stageW - this._textBgPic.width;
            }
        }
        else if (this._textBgPic.scaleX == -1) {
            if (this._textBgPic.x - this._textBgPic.width < 0) {
                this._textBgPic.x = this._textBgPic.width;
            }
        }
    };
    return GuideView;
}(egret.Sprite));
egret.registerClass(GuideView,'GuideView');
