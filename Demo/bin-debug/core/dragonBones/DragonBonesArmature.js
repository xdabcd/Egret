/**
 * Created by yangsong on 15-1-14.
 * Armature封装类
 */
var DragonBonesArmature = (function (_super) {
    __extends(DragonBonesArmature, _super);
    /**
     * 构造函数
     * @param armature dragonBones.Armature | dragonBones.FastArmature
     * @param clock dragonBones.WorldClock
     */
    function DragonBonesArmature(armature, clock) {
        _super.call(this);
        this._armature = armature;
        this._clock = clock;
        this.addChild(this._armature.display);
        this._completeCalls = [];
        this._frameCalls = [];
        this._isPlay = false;
        this._playName = "";
    }
    var d = __define,c=DragonBonesArmature,p=c.prototype;
    /**
     * 添加事件监听
     */
    p.addListeners = function () {
        this._armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.completeHandler, this);
        if (this._armature.enableCache) {
            this._armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frameHandler, this);
        }
        else {
            this._armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.frameHandler, this);
        }
    };
    /**
     * 移除事件监听
     */
    p.removeListeners = function () {
        this._armature.removeEventListener(dragonBones.AnimationEvent.COMPLETE, this.completeHandler, this);
        if (this._armature.enableCache) {
            this._armature.removeEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frameHandler, this);
        }
        else {
            this._armature.removeEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.frameHandler, this);
        }
    };
    /**
     * 事件完成执行函数
     * @param e
     */
    p.completeHandler = function (e) {
        var animationName = e.animationName;
        if (e.armature instanceof dragonBones.Armature) {
            animationName = e.animationState.animationData.name;
        }
        for (var i = 0, len = this._completeCalls.length; i < len; i++) {
            var arr = this._completeCalls[i];
            arr[0].apply(arr[1], [e, animationName]);
        }
        if (animationName == this._playName) {
            this._playName = "";
        }
    };
    /**
     * 帧事件处理函数
     * @param e
     */
    p.frameHandler = function (e) {
        for (var i = 0, len = this._frameCalls.length; i < len; i++) {
            var arr = this._frameCalls[i];
            arr[0].apply(arr[1], [e]);
        }
    };
    /**
     * 播放名为name的动作
     * @param name 名称
     * @param playNum 指定播放次数，默认走动画配置
     */
    p.play = function (name, playNum) {
        if (playNum === void 0) { playNum = undefined; }
        if (this._playName == name) {
            return this._currAnimationState;
        }
        this._playName = name;
        this.start();
        if (playNum == undefined) {
            this._currAnimationState = this.getAnimation().gotoAndPlay(name);
        }
        else {
            this._currAnimationState = this.getAnimation().gotoAndPlay(name, undefined, undefined, playNum);
        }
        if (this._currAnimationState) {
            this._currAnimationState.autoTween = false;
        }
        return this._currAnimationState;
    };
    /**
     * 恢复播放
     */
    p.start = function () {
        if (!this._isPlay) {
            this._clock.add(this._armature);
            this._isPlay = true;
            this.addListeners();
        }
    };
    /**
     * 停止播放
     */
    p.stop = function () {
        if (this._isPlay) {
            this._clock.remove(this._armature);
            this._isPlay = false;
            this._playName = "";
            this.removeListeners();
        }
    };
    /**
     * 销毁
     */
    p.destroy = function () {
        this.stop();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.removeChildren();
        this._armature = null;
        this._clock = null;
        this._completeCalls = null;
        this._frameCalls = null;
    };
    /**
     * 添加动画完成函数
     * @param callFunc 函数
     * @param target 函数所属对象
     */
    p.addCompleteCallFunc = function (callFunc, target) {
        for (var i = 0; i < this._completeCalls.length; i++) {
            var arr = this._completeCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                return;
            }
        }
        this._completeCalls.unshift([callFunc, target]);
    };
    /**
     * 移除一个动画完成函数
     * @param callFunc 函数
     * @param target 函数所属对象
     */
    p.removeCompleteCallFunc = function (callFunc, target) {
        for (var i = 0; i < this._completeCalls.length; i++) {
            var arr = this._completeCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                this._completeCalls.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * 添加帧事件处理函数
     * @param callFunc 函数
     * @param target 函数所属对象
     */
    p.addFrameCallFunc = function (callFunc, target) {
        for (var i = 0; i < this._frameCalls.length; i++) {
            var arr = this._frameCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                return;
            }
        }
        this._frameCalls.push([callFunc, target]);
    };
    /**
     * 移除帧事件处理函数
     * @param callFunc 函数
     * @param target 函数所属对象
     */
    p.removeFrameCallFunc = function (callFunc, target) {
        for (var i = 0; i < this._frameCalls.length; i++) {
            var arr = this._frameCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                this._frameCalls.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * 移除舞台处理
     * @private
     */
    p.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        this.stop();
    };
    /**
     * 获取dragonBones.Armature | dragonBones.FastArmature
     * @returns {dragonBones.Armature | dragonBones.FastArmature}
     */
    p.getArmature = function () {
        return this._armature;
    };
    /**
     * 获取当前dragonBones.AnimationState | dragonBones.FastAnimationState
     * @returns {dragonBones.AnimationState | dragonBones.FastAnimationState}
     */
    p.getCurrAnimationState = function () {
        return this._currAnimationState;
    };
    /**
     * 获取所属dragonBones.WorldClock
     * @returns {dragonBones.WorldClock}
     */
    p.getClock = function () {
        return this._clock;
    };
    /**
     * 获取dragonBones.Animation
     * @returns {Animation}
     */
    p.getAnimation = function () {
        return this._armature.animation;
    };
    /**
     * 获取一个dragonBones.Bone | dragonBones.FastBone
     * @param boneName
     * @returns {dragonBones.Bone | dragonBones.FastBone}
     */
    p.getBone = function (boneName) {
        return this._armature.getBone(boneName);
    };
    /**
     * 当前正在播放的动作名字
     * @returns {string}
     */
    p.getPlayName = function () {
        return this._playName;
    };
    /**
     * 获取骨骼的display
     * @param bone
     * @returns {function(): any}
     */
    p.getBoneDisplay = function (bone) {
        return bone.slot.getDisplay();
    };
    /**
     * 替换骨骼插件
     * @param boneName
     * @param displayObject
     */
    p.changeBone = function (boneName, displayObject) {
        var bone = this.getBone(boneName);
        if (bone) {
            if (bone instanceof dragonBones.Bone) {
                bone.slot.display = displayObject;
            }
            else {
                bone.slot.setDisplay(displayObject);
            }
        }
    };
    return DragonBonesArmature;
}(egret.DisplayObjectContainer));
egret.registerClass(DragonBonesArmature,'DragonBonesArmature');
