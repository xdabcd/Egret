/**
 * Created by yangsong on 15-2-11.
 */
var UTFMsg = (function () {
    /**
     * 构造函数
     */
    function UTFMsg() {
    }
    var d = __define,c=UTFMsg,p=c.prototype;
    /**
     * 接收消息处理
     * @param msg
     */
    p.receive = function (socket) {
        var msg = socket.readUTF();
        var obj = this.decode(msg);
        if (obj) {
            App.MessageCenter.dispatch(obj.key, obj.body);
        }
    };
    /**
     * 发送消息处理
     * @param msg
     */
    p.send = function (socket, msg) {
        var obj = this.encode(msg);
        if (obj) {
            socket.type = egret.WebSocket.TYPE_STRING;
            socket.writeUTF(obj);
        }
    };
    /**
     * 消息解析
     * @param msg
     */
    p.decode = function (msg) {
        Log.trace("decode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    /**
     * 消息封装
     * @param msg
     */
    p.encode = function (msg) {
        Log.trace("encode需要子类重写，根据项目的协议结构解析");
        return null;
    };
    return UTFMsg;
}());
egret.registerClass(UTFMsg,'UTFMsg',["BaseMsg"]);
