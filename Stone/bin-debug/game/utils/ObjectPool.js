var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var ObjectPool = (function () {
        function ObjectPool(className) {
            this.className = className;
            this.list = [];
        }
        var d = __define,c=ObjectPool,p=c.prototype;
        /**
        * 获取对象
        */
        p.borrowObject = function () {
            if (this.list.length > 0) {
                return this.list.shift();
            }
            var clazz = egret.getDefinitionByName(this.className);
            return new clazz();
        };
        /**
        * 回收对象
        */
        p.returnObject = function (value) {
            this.list.push(value);
        };
        ObjectPool.getPool = function (className) {
            if (!ObjectPool.pool[className]) {
                ObjectPool.pool[className] = new ObjectPool(className);
            }
            return ObjectPool.pool[className];
        };
        ObjectPool.pool = {};
        return ObjectPool;
    }());
    game.ObjectPool = ObjectPool;
    egret.registerClass(ObjectPool,'game.ObjectPool');
})(game || (game = {}));
