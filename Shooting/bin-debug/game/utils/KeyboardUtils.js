/**
 *
 * @author
 *
 */
var KeyboardUtils = (function () {
    function KeyboardUtils() {
    }
    var d = __define,c=KeyboardUtils,p=c.prototype;
    KeyboardUtils.init = function () {
        this.key_ups = new Array();
        this.key_downs = new Array();
        if (DeviceUtils.IsHtml5) {
            var self = this;
            document.addEventListener("keyup", function (e) {
                for (var i = 0, len = self.key_ups.length; i < len; i++) {
                    var func = self.key_ups[i][0];
                    var target = self.key_ups[i][1];
                    if (target) {
                        func.call(target, e["keyCode"]);
                    }
                    else {
                        func(e["keyCode"]);
                    }
                }
            });
            document.addEventListener("keydown", function (e) {
                for (var i = 0, len = self.key_downs.length; i < len; i++) {
                    var func = self.key_downs[i][0];
                    var target = self.key_downs[i][1];
                    if (target) {
                        func.call(target, e["keyCode"]);
                    }
                    else {
                        func(e["keyCode"]);
                    }
                }
            });
        }
    };
    /**
     * 添加KeyUp事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
     */
    KeyboardUtils.addKeyUp = function (callback, target) {
        this.key_ups.push([callback, target]);
    };
    /**
     * 添加KeyDown事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
     */
    KeyboardUtils.addKeyDown = function (callback, target) {
        this.key_downs.push([callback, target]);
    };
    /**
     * 移除KeyUp事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
     */
    KeyboardUtils.removeKeyUp = function (callback, target) {
        for (var i = 0; i < this.key_ups.length; i++) {
            if (this.key_ups[i][0] == callback && this.key_ups[i][1] == target) {
                this.key_ups.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * 移除KeyDown事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
     */
    KeyboardUtils.removeKeyDown = function (callback, target) {
        for (var i = 0; i < this.key_downs.length; i++) {
            if (this.key_downs[i][0] == callback && this.key_downs[i][1] == target) {
                this.key_downs.splice(i, 1);
                i--;
            }
        }
    };
    return KeyboardUtils;
}());
egret.registerClass(KeyboardUtils,'KeyboardUtils');
var Keyboard;
(function (Keyboard) {
    Keyboard[Keyboard["LEFT"] = 37] = "LEFT";
    Keyboard[Keyboard["RIGHT"] = 39] = "RIGHT";
    Keyboard[Keyboard["UP"] = 38] = "UP";
    Keyboard[Keyboard["DOWN"] = 40] = "DOWN";
    Keyboard[Keyboard["W"] = 87] = "W";
    Keyboard[Keyboard["A"] = 65] = "A";
    Keyboard[Keyboard["S"] = 83] = "S";
    Keyboard[Keyboard["D"] = 68] = "D";
    Keyboard[Keyboard["J"] = 74] = "J";
    Keyboard[Keyboard["K"] = 75] = "K";
    Keyboard[Keyboard["L"] = 76] = "L";
    Keyboard[Keyboard["U"] = 85] = "U";
    Keyboard[Keyboard["I"] = 73] = "I";
    Keyboard[Keyboard["O"] = 79] = "O";
    Keyboard[Keyboard["P"] = 80] = "P";
    Keyboard[Keyboard["SPACE"] = 32] = "SPACE";
})(Keyboard || (Keyboard = {}));
