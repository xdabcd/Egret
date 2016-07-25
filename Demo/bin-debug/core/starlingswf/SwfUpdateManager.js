/**
 * Created by zmliu on 14-5-11.
 */
var starlingswf;
(function (starlingswf) {
    /** 动画更新管理器 */
    var SwfUpdateManager = (function () {
        function SwfUpdateManager() {
        }
        var d = __define,c=SwfUpdateManager,p=c.prototype;
        SwfUpdateManager.createSwfUpdateManager = function (fps) {
            var updateManager = new SwfUpdateManager();
            updateManager._animations = [];
            updateManager._addQueue = [];
            updateManager._removeQueue = [];
            updateManager._currentTime = 0;
            updateManager.setFps(fps);
            App.TimerManager.doFrame(1, 0, updateManager.update, updateManager);
            return updateManager;
        };
        p.clear = function () {
            this._addQueue.splice(0);
            this._removeQueue.splice(0);
            this._animations.splice(0);
        };
        p.stop = function () {
            this.clear();
            App.TimerManager.remove(this.update, this);
        };
        p.play = function () {
            App.TimerManager.doFrame(1, 0, this.update, this);
        };
        p.setFps = function (fps) {
            this._fps = fps;
            this._fpsTime = 1000 / fps;
        };
        p.addSwfAnimation = function (animation) {
            this._addQueue.push(animation);
        };
        p.removeSwfAnimation = function (animation) {
            this._removeQueue.push(animation);
            var addIndex = this._addQueue.indexOf(animation);
            if (addIndex != -1) {
                this._addQueue.splice(addIndex, 1);
            }
        };
        p.updateAdd = function () {
            var len = this._addQueue.length;
            var index;
            var animation;
            for (var i = 0; i < len; i++) {
                animation = this._addQueue.pop();
                index = this._animations.indexOf(animation);
                if (index == -1) {
                    this._animations.push(animation);
                }
            }
        };
        p.updateRemove = function () {
            var len = this._removeQueue.length;
            var index;
            var animation;
            for (var i = 0; i < len; i++) {
                animation = this._removeQueue.pop();
                index = this._animations.indexOf(animation);
                if (index != -1) {
                    this._animations.splice(index, 1);
                }
            }
        };
        p.update = function (time) {
            this._currentTime += time;
            if (this._currentTime < this._fpsTime) {
                return;
            }
            this._currentTime -= this._fpsTime;
            this._update();
            var jumpFlag = 0;
            while (this._currentTime > this._fpsTime) {
                this._currentTime -= this._fpsTime;
                jumpFlag++;
                if (jumpFlag < 4) {
                    this._update();
                }
            }
        };
        p._update = function () {
            this.updateRemove();
            this.updateAdd();
            var len = this._animations.length;
            for (var i = 0; i < len; i++) {
                this._animations[i].update();
            }
        };
        return SwfUpdateManager;
    }());
    starlingswf.SwfUpdateManager = SwfUpdateManager;
    egret.registerClass(SwfUpdateManager,'starlingswf.SwfUpdateManager');
})(starlingswf || (starlingswf = {}));
