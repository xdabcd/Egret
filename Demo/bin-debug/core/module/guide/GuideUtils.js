/**
 * Created by yangsong on 14-12-2.
 * 引导工具类，根据每个项目重写实现可重写实现
 */
var GuideUtils = (function (_super) {
    __extends(GuideUtils, _super);
    function GuideUtils() {
        _super.apply(this, arguments);
        //handDir  1:下面 2:上面
        //txtdir  箭头指向: 1:背景左箭头下 2:背景左箭头上 3:背景右箭头下 4:背景右箭头上
        this.configData = {
            "1": {
                "1": {
                    "txt": "点击这里，去设置宠物出战",
                    "txtdir": 1,
                    "handDir": 1
                },
                "2": {
                    "txt": "点击选择一个宠物出战",
                    "txtdir": 3,
                    "handDir": 1
                },
                "3": {
                    "txt": "点击宠物出战",
                    "txtdir": 3,
                    "handDir": 1
                }
            },
            "2": {
                "1": {
                    "txt": "更多宠物，可以抽取获得哦！",
                    "txtdir": 1,
                    "handDir": 2
                },
                "2": {
                    "txt": "点击抽取宠物",
                    "txtdir": 1,
                    "handDir": 1
                }
            },
            "3": {
                "1": {
                    "txt": "点击选择另一个宠物",
                    "txtdir": 1,
                    "handDir": 1
                },
                "2": {
                    "txt": "点击宠物出战",
                    "txtdir": 3,
                    "handDir": 1
                }
            },
            "4": {
                "1": {
                    "txt": "点击查看宠物属性",
                    "txtdir": 4,
                    "handDir": 1
                },
                "2": {
                    "txt": "点击宠物升级",
                    "txtdir": 1,
                    "handDir": 2
                },
                "3": {
                    "txt": "点击选择升级材料",
                    "txtdir": 3,
                    "handDir": 1
                },
                "4": {
                    "txt": "选择一个宠物或卡牌作为材料",
                    "txtdir": 3,
                    "handDir": 1
                },
                "5": {
                    "txt": "选择材料后点击确定回到升级界面",
                    "txtdir": 1,
                    "handDir": 2
                },
                "6": {
                    "txt": "点击完成升级",
                    "txtdir": 1,
                    "handDir": 2
                }
            },
            "5": {
                "1": {
                    "txt": "现在立刻享受\n炫酷的飞行吧",
                    "txtdir": 1,
                    "handDir": 2
                },
                "2": {
                    "txt": "每天前3次购买免费",
                    "txtdir": 1,
                    "handDir": 1
                },
                "3": {
                    "txt": "开始战斗吧",
                    "txtdir": 1,
                    "handDir": 2
                }
            },
            "6": {
                "1": {
                    "txt": "点击这里查看战机",
                    "txtdir": 1,
                    "handDir": 1
                },
                "2": {
                    "txt": "点击升级战机，\n可以提高战力",
                    "txtdir": 1,
                    "handDir": 2
                }
            }
        };
        /**
         * 大步骤
         * @type {number}
         */
        this.currPart = 0;
        /**
         * 小步骤
         * @type {number}
         */
        this.currStep = 0;
    }
    var d = __define,c=GuideUtils,p=c.prototype;
    /**
     * 下一步
     */
    p.next = function () {
        if (this.view == null || this.view.parent == null) {
            return;
        }
        this.currStep++;
        if (!this.configData[this.currPart][this.currStep]) {
            //下一部分
            this.currPart++;
            this.currStep = 1;
        }
        if (!this.configData[this.currPart]) {
            //所有引导结束
            this.currPart = 0;
            this.currStep = 0;
        }
        this.hide();
    };
    /**
     * 显示
     */
    p.show = function (obj, targetPart, targetStep) {
        if (this.currPart == targetPart && this.currStep == targetStep) {
            if (this.view == null) {
                this.view = new GuideView();
            }
            this.view.setData(obj, this.configData[this.currPart][this.currStep]);
            egret.MainContext.instance.stage.addChild(this.view);
        }
    };
    /**
     * 隐藏
     */
    p.hide = function () {
        App.DisplayUtils.removeFromParent(this.view);
    };
    /**
     * 引导是否显示
     */
    p.isShow = function () {
        return this.view != null && this.view.parent != null;
    };
    return GuideUtils;
}(BaseClass));
egret.registerClass(GuideUtils,'GuideUtils');
