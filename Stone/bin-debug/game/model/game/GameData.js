var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var GameData = (function () {
        function GameData() {
        }
        var d = __define,c=GameData,p=c.prototype;
        d(GameData, "heroCount"
            /**
            * 英雄个数
            */
            ,function () {
                return GameData.HERO_COUNT;
            }
            /**
            * 设置英雄个数
            */
            ,function (count) {
                GameData.HERO_COUNT = count;
            }
        );
        d(GameData, "enemyCount"
            /**
            * 敌人个数
            */
            ,function () {
                return GameData.ENEMY_COUNT;
            }
            /**
           * 设置敌人个数
           */
            ,function (count) {
                GameData.ENEMY_COUNT = count;
            }
        );
        d(GameData, "xSize"
            /**
            * 横向长度
            */
            ,function () {
                return 6;
            }
        );
        d(GameData, "ySize"
            /**
            * 纵向长度
            */
            ,function () {
                return 5;
            }
        );
        d(GameData, "interval_time"
            /**
             * 间隔时间
             */
            ,function () {
                return GameData.DURATION_MUL * 100;
            }
        );
        d(GameData, "base_move_time"
            /**
             * 基础移动时间
             */
            ,function () {
                return GameData.DURATION_MUL * 200;
            }
        );
        d(GameData, "remove_time"
            /**
             * 消除时间
             */
            ,function () {
                return GameData.DURATION_MUL * 200;
            }
        );
        d(GameData, "rearrange_time"
            /**
             * 重新排列时间
             */
            ,function () {
                return GameData.DURATION_MUL * 500;
            }
        );
        d(GameData, "hero_attack_time"
            /**
             * 攻击时间
             */
            ,function () {
                return GameData.DURATION_MUL * 250;
            }
        );
        d(GameData, "enemy_attack_time"
            /**
             * 攻击时间
             */
            ,function () {
                return GameData.DURATION_MUL * 500;
            }
        );
        d(GameData, "base_proj_time"
            /*
             * 基础投射时间
             */
            ,function () {
                return GameData.DURATION_MUL * 500;
            }
        );
        d(GameData, "round_time"
            /**
             * 回合切换时间
             */
            ,function () {
                return GameData.DURATION_MUL * 500;
            }
        );
        d(GameData, "hurt_time"
            /**
             * 受伤
             */
            ,function () {
                return GameData.DURATION_MUL * 300;
            }
        );
        GameData.DURATION_MUL = 0.8;
        GameData.HERO_COUNT = 5;
        GameData.ENEMY_COUNT = 2;
        return GameData;
    }());
    game.GameData = GameData;
    egret.registerClass(GameData,'game.GameData');
})(game || (game = {}));
