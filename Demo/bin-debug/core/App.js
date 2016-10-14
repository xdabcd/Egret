/**
 * Created by yangsong on 2014/11/22.
 */
var App = (function () {
    function App() {
    }
    var d = __define,c=App,p=c.prototype;
    d(App, "Http"
        /**
         * Http请求
         * @type {Http}
         */
        ,function () {
            return Http.getInstance();
        }
    );
    d(App, "Socket"
        /**
         * Socket请求
         * @type {null}
         */
        ,function () {
            return Socket.getInstance();
        }
    );
    d(App, "ControllerManager"
        /**
         * 模块管理类
         * @type {ControllerManager}
         */
        ,function () {
            return ControllerManager.getInstance();
        }
    );
    d(App, "ViewManager"
        /**
         * View管理类
         * @type {ViewManager}
         */
        ,function () {
            return ViewManager.getInstance();
        }
    );
    d(App, "SceneManager"
        /**
         * 场景管理类
         * @type {SceneManager}
         */
        ,function () {
            return SceneManager.getInstance();
        }
    );
    d(App, "DebugUtils"
        /**
         * 调试工具
         * @type {DebugUtils}
         */
        ,function () {
            return DebugUtils.getInstance();
        }
    );
    d(App, "MessageCenter"
        /**
         * 服务器返回的消息处理中心
         * @type {MessageCenter}
         */
        ,function () {
            return MessageCenter.getInstance(0);
        }
    );
    d(App, "TimerManager"
        /**
         * 统一的计时器和帧刷管理类
         * @type {TimerManager}
         */
        ,function () {
            return TimerManager.getInstance();
        }
    );
    d(App, "DateUtils"
        /**
         * 日期工具类
         * @type {DateUtils}
         */
        ,function () {
            return DateUtils.getInstance();
        }
    );
    d(App, "MathUtils"
        /**
         * 数学计算工具类
         * @type {MathUtils}
         */
        ,function () {
            return MathUtils.getInstance();
        }
    );
    d(App, "RandomUtils"
        /**
         * 随机数工具类
         * @type {RandomUtils}
         */
        ,function () {
            return RandomUtils.getInstance();
        }
    );
    d(App, "DisplayUtils"
        /**
         * 显示对象工具类
         * @type {DisplayUtils}
         */
        ,function () {
            return DisplayUtils.getInstance();
        }
    );
    d(App, "BitmapNumber"
        /*
         * 图片合成数字工具类
         * */
        ,function () {
            return BitmapNumber.getInstance();
        }
    );
    d(App, "GuideUtils"
        /**
         * 引导工具类
         */
        ,function () {
            return GuideUtils.getInstance();
        }
    );
    d(App, "StageUtils"
        /**
         * Stage操作相关工具类
         */
        ,function () {
            return StageUtils.getInstance();
        }
    );
    d(App, "EffectUtils"
        /**
         * Effect工具类
         */
        ,function () {
            return EffectUtils.getInstance();
        }
    );
    d(App, "StringUtils"
        /**
         * 字符串工具类
         */
        ,function () {
            return StringUtils.getInstance();
        }
    );
    d(App, "CommonUtils"
        /**
         * 通过工具类
         */
        ,function () {
            return CommonUtils.getInstance();
        }
    );
    d(App, "SoundManager"
        /**
         * 音乐管理类
         */
        ,function () {
            return SoundManager.getInstance();
        }
    );
    d(App, "DeviceUtils"
        /**
         * 设备工具类
         */
        ,function () {
            return DeviceUtils.getInstance();
        }
    );
    d(App, "EgretExpandUtils"
        /**
         * 引擎扩展类
         */
        ,function () {
            return EgretExpandUtils.getInstance();
        }
    );
    d(App, "KeyboardUtils"
        /**
         * 键盘操作工具类
         */
        ,function () {
            return KeyboardUtils.getInstance();
        }
    );
    d(App, "RockerUtils"
        /**
         * 摇杆操作工具类
         */
        ,function () {
            return RockerUtils.getInstance();
        }
    );
    d(App, "ShockUtils"
        /**
         * 震动类
         */
        ,function () {
            return ShockUtils.getInstance();
        }
    );
    d(App, "ResourceUtils"
        /**
         * 资源加载工具类
         */
        ,function () {
            return ResourceUtils.getInstance();
        }
    );
    d(App, "RenderTextureManager"
        /**
         * RenderTextureManager
         */
        ,function () {
            return RenderTextureManager.getInstance();
        }
    );
    d(App, "TextFlowMaker"
        /**
         * TextFlow
         */
        ,function () {
            return TextFlowMaker.getInstance();
        }
    );
    d(App, "NotificationCenter"
        ,function () {
            if (App._notificationCenter == null) {
                App._notificationCenter = new MessageCenter(1);
            }
            return App._notificationCenter;
        }
    );
    d(App, "DelayOptManager"
        /**
         * 分帧处理类
         * @returns {any}
         * @constructor
         */
        ,function () {
            return DelayOptManager.getInstance();
        }
    );
    d(App, "ArrayUtils"
        /**
         * 数组工具类
         * @returns {any}
         * @constructor
         */
        ,function () {
            return ArrayUtils.getInstance();
        }
    );
    d(App, "EasyLoading"
        /**
         * 通用Loading动画
         * @returns {any}
         * @constructor
         */
        ,function () {
            return EasyLoading.getInstance();
        }
    );
    d(App, "ResVersionManager"
        /**
         * 单一资源通过版本号加载管理类
         */
        ,function () {
            return ResVersionManager.getInstance();
        }
    );
    d(App, "DragonBonesFactory"
        /**
         * DragonBones工厂类
         * @returns {any}
         * @constructor
         */
        ,function () {
            return DragonBonesFactory.getInstance();
        }
    );
    d(App, "StarlingSwfFactory"
        /**
         * StarlingSwf工厂类
         * @returns {StarlingSwfFactory}
         * @constructor
         */
        ,function () {
            return StarlingSwfFactory.getInstance();
        }
    );
    /**
     * 初始化函数
     * @constructor
     */
    App.Init = function () {
        //全局配置数据
        App.GlobalData = RES.getRes("global_json");
        //开启调试
        App.DebugUtils.isOpen(App.GlobalData.IsDebug);
        App.DebugUtils.setThreshold(5);
        //扩展功能初始化
        App.EgretExpandUtils.init();
        //实例化Http请求
        //        App.Http.initServer(App.GlobalData.HttpSerever);
        //实例化ProtoBuf和Socket请求
        //        App.ProtoFile = dcodeIO.ProtoBuf.loadProto(RES.getRes(App.GlobalData.ProtoFile));
        //        App.ProtoConfig = RES.getRes(App.GlobalData.ProtoConfig);
        //        App.Socket.initServer(App.GlobalData.SocketServer, App.GlobalData.SocketPort, new ByteArrayMsgByProtobuf());
    };
    /**
     * 请求服务器使用的用户标识
     * @type {string}
     */
    App.ProxyUserFlag = "";
    /**
     * 全局配置数据
     * @type {null}
     */
    App.GlobalData = null;
    /**
     * ProtoFile
     * @type {null}
     */
    App.ProtoFile = null;
    /**
     * ProtoConfig
     * @type {null}
     */
    App.ProtoConfig = null;
    return App;
}());
egret.registerClass(App,'App');
//# sourceMappingURL=App.js.map