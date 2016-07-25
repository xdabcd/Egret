/**
 * Created by yangsong on 15-3-25.
 */
var ByteArrayMsgByProtobuf = (function (_super) {
    __extends(ByteArrayMsgByProtobuf, _super);
    /**
     * 构造函数
     */
    function ByteArrayMsgByProtobuf() {
        _super.call(this);
        this.msgClass = null;
        this.protoConfig = null;
        this.protoConfigSymmetry = null;
        this.msgClass = {};
        this.protoConfig = App.ProtoConfig;
        this.protoConfigSymmetry = {};
        var keys = Object.keys(this.protoConfig);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var value = this.protoConfig[key];
            this.protoConfigSymmetry[value] = key;
        }
    }
    var d = __define,c=ByteArrayMsgByProtobuf,p=c.prototype;
    /**
     * 获取msgID对应的类
     * @param key
     * @returns {any}
     */
    p.getMsgClass = function (key) {
        var cls = this.msgClass[key];
        if (cls == null) {
            cls = App.ProtoFile.build(key);
            this.msgClass[key] = cls;
        }
        return cls;
    };
    /**
     * 获取msgID
     * @param key
     * @returns {any}
     */
    p.getMsgID = function (key) {
        return this.protoConfigSymmetry[key];
    };
    /**
     * 获取msgKey
     * @param msgId
     * @returns {any}
     */
    p.getMsgKey = function (msgId) {
        return this.protoConfig[msgId];
    };
    /**
     * 消息解析
     * @param msg
     */
    p.decode = function (msg) {
        var msgID = msg.readShort();
        var len = msg.readShort();
        if (msg.bytesAvailable >= len) {
            var bytes = new egret.ByteArray();
            msg.readBytes(bytes, 0, len);
            var obj = {};
            obj.key = this.getMsgKey(msgID);
            App.DebugUtils.start("Protobuf Decode");
            obj.body = this.getMsgClass(obj.key).decode(bytes.buffer);
            App.DebugUtils.stop("Protobuf Decode");
            Log.trace("收到数据：", "[" + msgID + " " + obj.key + "]", obj.body);
            return obj;
        }
        return null;
    };
    /**
     * 消息封装
     * @param msg
     */
    p.encode = function (msg) {
        var msgID = this.getMsgID(msg.key);
        var msgBody = new (this.getMsgClass(msg.key))(msg.body);
        App.DebugUtils.start("Protobuf Encode");
        var bodyBytes = new egret.ByteArray(msgBody.toArrayBuffer());
        App.DebugUtils.stop("Protobuf Encode");
        Log.trace("发送数据：", "[" + msgID + " " + msg.key + "]", msg.body);
        var sendMsg = new egret.ByteArray();
        sendMsg.writeShort(msgID);
        sendMsg.writeBytes(bodyBytes);
        return sendMsg;
    };
    return ByteArrayMsgByProtobuf;
}(ByteArrayMsg));
egret.registerClass(ByteArrayMsgByProtobuf,'ByteArrayMsgByProtobuf');
