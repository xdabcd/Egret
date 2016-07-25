/**
 * Created by yangsong on 15-1-20.
 */
var DeviceUtils = (function (_super) {
    __extends(DeviceUtils, _super);
    /**
     * 构造函数
     */
    function DeviceUtils() {
        _super.call(this);
    }
    var d = __define,c=DeviceUtils,p=c.prototype;
    d(p, "IsHtml5"
        /**
         * 当前是否Html5版本
         * @returns {boolean}
         * @constructor
         */
        ,function () {
            return egret.Capabilities.runtimeType == egret.RuntimeType.WEB;
        }
    );
    d(p, "IsNative"
        /**
         * 当前是否是Native版本
         * @returns {boolean}
         * @constructor
         */
        ,function () {
            return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
        }
    );
    d(p, "IsMobile"
        /**
         * 是否是在手机上
         * @returns {boolean}
         * @constructor
         */
        ,function () {
            return egret.Capabilities.isMobile;
        }
    );
    d(p, "IsPC"
        /**
         * 是否是在PC上
         * @returns {boolean}
         * @constructor
         */
        ,function () {
            return !egret.Capabilities.isMobile;
        }
    );
    d(p, "IsQQBrowser"
        /**
         * 是否是QQ浏览器
         * @returns {boolean}
         * @constructor
         */
        ,function () {
            return this.IsHtml5 && navigator.userAgent.indexOf('MQQBrowser') != -1;
        }
    );
    d(p, "IsIEBrowser"
        /**
         * 是否是IE浏览器
         * @returns {boolean}
         * @constructor
         */
        ,function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("MSIE") != -1;
        }
    );
    d(p, "IsFirefoxBrowser"
        /**
         * 是否是Firefox浏览器
         * @returns {boolean}
         * @constructor
         */
        ,function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Firefox") != -1;
        }
    );
    d(p, "IsChromeBrowser"
        /**
         * 是否是Chrome浏览器
         * @returns {boolean}
         * @constructor
         */
        ,function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Chrome") != -1;
        }
    );
    d(p, "IsSafariBrowser"
        /**
         * 是否是Safari浏览器
         * @returns {boolean}
         * @constructor
         */
        ,function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Safari") != -1;
        }
    );
    d(p, "IsOperaBrowser"
        /**
         * 是否是Opera浏览器
         * @returns {boolean}
         * @constructor
         */
        ,function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Opera") != -1;
        }
    );
    return DeviceUtils;
}(BaseClass));
egret.registerClass(DeviceUtils,'DeviceUtils');
