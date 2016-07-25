/**
 * Created by yangsong on 2014/11/25.
 * Socket类
 */
var Socket = (function (_super) {
    __extends(Socket, _super);
    /**
     * 构造函数
     */
    function Socket() {
        _super.call(this);
        this._needReconnect = false;
        this._maxReconnectCount = 10;
        this._reconnectCount = 0;
    }
    var d = __define,c=Socket,p=c.prototype;
    /**
     * 添加事件监听
     */
    p.addEvents = function () {
        this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this._socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this._socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
    };
    /**
     * 移除事件监听
     */
    p.removeEvents = function () {
        this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this._socket.removeEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this._socket.removeEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
    };
    /**
     * 服务器连接成功
     */
    p.onSocketOpen = function () {
        this._reconnectCount = 0;
        if (this._connectFlag) {
            App.MessageCenter.dispatch(SocketConst.SOCKET_RECONNECT);
        }
        else {
            App.MessageCenter.dispatch(SocketConst.SOCKET_CONNECT);
        }
        this._connectFlag = true;
        this._isConnecting = true;
    };
    /**
     * 服务器断开连接
     */
    p.onSocketClose = function () {
        if (this._needReconnect) {
            this.reconnect();
            App.MessageCenter.dispatch(SocketConst.SOCKET_START_RECONNECT);
        }
        else {
            App.MessageCenter.dispatch(SocketConst.SOCKET_CLOSE);
        }
        this._isConnecting = false;
    };
    /**
     * 服务器连接错误
     */
    p.onSocketError = function () {
        if (this._needReconnect) {
            this.reconnect();
        }
        else {
            App.MessageCenter.dispatch(SocketConst.SOCKET_NOCONNECT);
        }
        this._isConnecting = false;
    };
    /**
     * 收到服务器消息
     * @param e
     */
    p.onReceiveMessage = function (e) {
        this._msg.receive(this._socket);
    };
    /**
     * 初始化服务区地址
     * @param host IP
     * @param port 端口
     * @param msg 消息发送接受处理类
     */
    p.initServer = function (host, port, msg) {
        this._host = host;
        this._port = port;
        this._msg = msg;
    };
    /**
     * 开始Socket连接
     */
    p.connect = function () {
        if (App.DeviceUtils.IsHtml5) {
            if (!window["WebSocket"]) {
                Log.trace("不支持WebSocket");
                return;
            }
        }
        this._socket = new egret.WebSocket();
        if (this._msg instanceof ByteArrayMsg) {
            this._socket.type = egret.WebSocket.TYPE_BINARY;
        }
        Log.trace("WebSocket: " + this._host + ":" + this._port);
        this._socket.connect(this._host, this._port);
        this.addEvents();
    };
    /**
     * 重新连接
     */
    p.reconnect = function () {
        this.close();
        this._reconnectCount++;
        if (this._reconnectCount < this._maxReconnectCount) {
            this.connect();
        }
        else {
            this._reconnectCount = 0;
            if (this._connectFlag) {
                App.MessageCenter.dispatch(SocketConst.SOCKET_CLOSE);
            }
            else {
                App.MessageCenter.dispatch(SocketConst.SOCKET_NOCONNECT);
            }
        }
    };
    /**
     * 发送消息到服务器
     * @param msg
     */
    p.send = function (msg) {
        this._msg.send(this._socket, msg);
    };
    /**
     * 关闭Socket连接
     */
    p.close = function () {
        this.removeEvents();
        this._socket.close();
        this._socket = null;
        this._isConnecting = false;
        this._connectFlag = false;
    };
    /**
     * Socket是否在连接中
     * @returns {boolean}
     */
    p.isConnecting = function () {
        return this._isConnecting;
    };
    /**
     * Debug信息
     * @param str
     */
    p.debugInfo = function (str) {
        App.MessageCenter.dispatch(SocketConst.SOCKET_DEBUG_INFO, str);
    };
    return Socket;
}(BaseClass));
egret.registerClass(Socket,'Socket');
