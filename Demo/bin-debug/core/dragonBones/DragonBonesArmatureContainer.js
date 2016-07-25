/**
 * Created by yangsong on 15-1-16.
 * DragonBonesArmature容器类，用于一个动画使用多个DragonBonesArmature的情况
 */
var DragonBonesArmatureContainer = (function (_super) {
    __extends(DragonBonesArmatureContainer, _super);
    /**
     * 构造函数
     */
    function DragonBonesArmatureContainer() {
        _super.call(this);
        this.armatures = new Array();
        this.actions = {};
        this.cacheBones = {};
    }
    var d = __define,c=DragonBonesArmatureContainer,p=c.prototype;
    /**
     * 注册缩需要的DragonBonesArmature
     * @param $armature DragonBonesArmature
     * @param $actions 当前DragonBonesArmature所有的动作
     */
    p.register = function ($armature, $actions) {
        this.armatures.push($armature);
        for (var i = 0, len = $actions.length; i < len; i++) {
            this.actions[$actions[i]] = this.armatures.length - 1;
        }
    };
    d(p, "armature"
        /**
         * 当前正在使用的armature
         * @returns {DragonBonesArmature}
         */
        ,function () {
            return this.armatures[this.currArmatureIndex];
        }
    );
    /**
     * 获取Bone
     * @param boneName
     * @returns {any}
     */
    p.getCacheBone = function (boneName) {
        if (!this.cacheBones[boneName]) {
            this.cacheBones[boneName] = [];
            for (var i = 0, len = this.armatures.length; i < len; i++) {
                var arm = this.armatures[i];
                this.cacheBones[boneName].push(arm.getBone(boneName));
            }
        }
        return this.cacheBones[boneName][this.currArmatureIndex];
    };
    /**
     * 播放动作
     * @param action
     * @param playNum
     */
    p.play = function (action, playNum) {
        if (playNum === void 0) { playNum = undefined; }
        if (this.actions[action] == null) {
            Log.trace("DragonBonesArmatureContainer不存在动作：", action);
            return;
        }
        var armatureIndex = this.actions[action];
        if (armatureIndex != this.currArmatureIndex) {
            this.remove();
        }
        var newArm = this.armatures[armatureIndex];
        if (newArm) {
            this.addChild(newArm);
            this.currArmatureIndex = armatureIndex;
            return newArm.play(action, playNum);
        }
        return null;
    };
    /**
     * 停止当前DragonBonesArmature
     */
    p.stop = function () {
        var currArm = this.armatures[this.currArmatureIndex];
        if (currArm) {
            currArm.stop();
        }
    };
    /**
     * 播放
     */
    p.start = function () {
        var currArm = this.armatures[this.currArmatureIndex];
        if (currArm) {
            currArm.start();
        }
    };
    /**
     * 移除上一个DragonBonesArmature
     */
    p.remove = function () {
        var oldArm = this.armatures[this.currArmatureIndex];
        if (oldArm) {
            oldArm.stop();
            App.DisplayUtils.removeFromParent(oldArm);
            this.currArmatureIndex = null;
        }
    };
    /**
     * 添加播放完成处理函数
     * @param callFunc
     * @param target
     */
    p.addCompleteCallFunc = function (callFunc, target) {
        for (var i = 0, len = this.armatures.length; i < len; i++) {
            var arm = this.armatures[i];
            arm.addCompleteCallFunc(callFunc, target);
        }
    };
    /**
     * 移除播放完成处理函数
     * @param callFunc
     * @param target
     */
    p.removeCompleteCallFunc = function (callFunc, target) {
        for (var i = 0, len = this.armatures.length; i < len; i++) {
            var arm = this.armatures[i];
            arm.removeCompleteCallFunc(callFunc, target);
        }
    };
    /**
     * 添加帧事件处理函数
     * @param callFunc
     * @param target
     */
    p.addFrameCallFunc = function (callFunc, target) {
        for (var i = 0, len = this.armatures.length; i < len; i++) {
            var arm = this.armatures[i];
            arm.addFrameCallFunc(callFunc, target);
        }
    };
    /**
     * 移除帧事件处理函数
     * @param key
     * @param callFunc
     * @param target
     */
    p.removeFrameCallFunc = function (callFunc, target) {
        for (var i = 0, len = this.armatures.length; i < len; i++) {
            var arm = this.armatures[i];
            arm.removeFrameCallFunc(callFunc, target);
        }
    };
    /**
     * 清空
     */
    p.clear = function () {
        while (this.armatures.length) {
            var arm = this.armatures.pop();
            App.DisplayUtils.removeFromParent(arm);
            arm.destroy();
        }
        this.cacheBones = {};
        this.actions = {};
    };
    /**
     * 销毁
     */
    p.destroy = function () {
        this.clear();
        this.armatures = null;
        this.cacheBones = null;
        this.actions = null;
    };
    return DragonBonesArmatureContainer;
}(egret.DisplayObjectContainer));
egret.registerClass(DragonBonesArmatureContainer,'DragonBonesArmatureContainer');
