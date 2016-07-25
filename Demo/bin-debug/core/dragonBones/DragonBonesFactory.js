/**
 * Created by egret on 15-1-14.
 * DragonBones工厂类
 */
var DragonBonesFactory = (function (_super) {
    __extends(DragonBonesFactory, _super);
    /**
     * 构造函数
     */
    function DragonBonesFactory() {
        _super.call(this);
        this.averageUtils = new AverageUtils();
        this.factory = new dragonBones.EgretFactory();
        this.clocks = new Array();
        this.clocksLen = 0;
        this.files = [];
        //默认开启
        this.start();
    }
    var d = __define,c=DragonBonesFactory,p=c.prototype;
    /**
     * 初始化一个动画文件
     * @param skeletonData 动画描述文件
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    p.initArmatureFile = function (skeletonData, texture, textureData) {
        if (this.files.indexOf(skeletonData.name) != -1) {
            return;
        }
        this.addSkeletonData(skeletonData);
        this.addTextureAtlas(texture, textureData);
        this.files.push(skeletonData.name);
    };
    /**
     * 初始化一个动画文件
     * @param skeletonData 动画描述文件
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    p.initArmatureMoreFile = function (skeletonData) {
        this.factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        var textureList = skeletonData.textureList;
        var sheetList = skeletonData.sheetList;
        var atlas = new EgretTextureAtlasMore(RES.getRes(textureList[0]), RES.getRes(sheetList[0]), skeletonData.name);
        var len = textureList.length;
        for (var i = 1; i < len; i++) {
            atlas.register(RES.getRes(textureList[i]), RES.getRes(sheetList[i]));
        }
        this.factory.addTextureAtlas(atlas);
    };
    /**
     * 移除动画文件
     * @param name
     */
    p.removeArmatureFile = function (name) {
        var index = this.files.indexOf(name);
        if (index != -1) {
            this.removeSkeletonData(name);
            this.removeTextureAtlas(name);
            this.files.splice(index, 1);
        }
    };
    /**
     * 清空所有动画
     */
    p.clear = function () {
        while (this.files.length) {
            this.removeArmatureFile(this.files[0]);
        }
    };
    /**
     * 添加动画描述文件
     * @param skeletonData
     */
    p.addSkeletonData = function (skeletonData) {
        this.factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
    };
    /**
     * 添加动画所需资源
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    p.addTextureAtlas = function (texture, textureData) {
        this.factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
    };
    /**
     * 移除动画描述文件
     * @param skeletonData
     */
    p.removeSkeletonData = function (name) {
        this.factory.removeSkeletonData(name);
    };
    /**
     * 移除动画所需资源
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    p.removeTextureAtlas = function (name) {
        this.factory.removeTextureAtlas(name);
    };
    /**
     * 创建一个动画
     * @param name 动作名称
     * @param fromDragonBonesDataName 动画文件名称
     * @returns {Armature}
     */
    p.makeArmature = function (name, fromDragonBonesDataName, playSpeed) {
        if (playSpeed === void 0) { playSpeed = 1; }
        var armature = this.factory.buildArmature(name, fromDragonBonesDataName);
        if (armature == null) {
            Log.trace("不存在Armature： " + name);
            return null;
        }
        var clock = this.createWorldClock(playSpeed);
        var result = new DragonBonesArmature(armature, clock);
        return result;
    };
    /**
     * 创建一个动画（急速模式）
     * @param name 动作名称
     * @param fromDragonBonesDataName 动画文件名称
     * @returns {Armature}
     */
    p.makeFastArmature = function (name, fromDragonBonesDataName, playSpeed) {
        if (playSpeed === void 0) { playSpeed = 1; }
        var armature = this.factory.buildFastArmature(name, fromDragonBonesDataName);
        if (armature == null) {
            Log.trace("不存在Armature： " + name);
            return null;
        }
        armature.enableAnimationCache(30);
        var clock = this.createWorldClock(playSpeed);
        var result = new DragonBonesArmature(armature, clock);
        return result;
    };
    /**
     * 创建WorldClock
     * @param playSpeed
     * @returns {dragonBones.WorldClock}
     */
    p.createWorldClock = function (playSpeed) {
        for (var i = 0; i < this.clocksLen; i++) {
            if (this.clocks[i].timeScale == playSpeed) {
                return this.clocks[i];
            }
        }
        var newClock = new dragonBones.WorldClock();
        newClock.timeScale = playSpeed;
        this.clocks.push(newClock);
        this.clocksLen = this.clocks.length;
        return newClock;
    };
    /**
     * dragonBones体系的每帧刷新
     * @param advancedTime
     */
    p.onEnterFrame = function (advancedTime) {
        this.averageUtils.push(advancedTime);
        var time = this.averageUtils.getValue() * 0.001;
        for (var i = 0; i < this.clocksLen; i++) {
            var clock = this.clocks[i];
            clock.advanceTime(time);
        }
    };
    /**
     * 停止
     */
    p.stop = function () {
        if (this.isPlay) {
            App.TimerManager.remove(this.onEnterFrame, this);
            this.isPlay = false;
        }
    };
    /**
     * 开启
     */
    p.start = function () {
        if (!this.isPlay) {
            this.isPlay = true;
            App.TimerManager.doFrame(1, 0, this.onEnterFrame, this);
        }
    };
    return DragonBonesFactory;
}(BaseClass));
egret.registerClass(DragonBonesFactory,'DragonBonesFactory');
