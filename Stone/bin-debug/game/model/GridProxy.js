var game;
(function (game) {
    /**
     *
     * @author
     *
     */
    var GridState;
    (function (GridState) {
        GridState[GridState["IDLE"] = 1] = "IDLE";
        GridState[GridState["MOVE"] = 2] = "MOVE";
        GridState[GridState["RESTORE"] = 3] = "RESTORE";
        GridState[GridState["REMOVE"] = 4] = "REMOVE";
        GridState[GridState["REPAIR"] = 5] = "REPAIR";
        GridState[GridState["REARRANGE"] = 6] = "REARRANGE";
        GridState[GridState["GS_EFFECT"] = 7] = "GS_EFFECT";
        GridState[GridState["MATCH_EFFECT"] = 8] = "MATCH_EFFECT";
    })(GridState || (GridState = {}));
    var GridProxy = (function (_super) {
        __extends(GridProxy, _super);
        function GridProxy() {
            _super.call(this, GridProxy.NAME);
        }
        var d = __define,c=GridProxy,p=c.prototype;
        /**
        * 初始化数据
        */
        p.reset = function () {
            this.xSize = game.GameData.xSize;
            this.ySize = game.GameData.ySize;
            this.initGemstoneList();
            this.createGemstoneInList();
        };
        /**
        * 点击宝石
        */
        p.clickGemstone = function (pos) {
            if (this.state != GridState.IDLE) {
                return;
            }
            if (this.selectPos == null) {
                this.selectGemstone(pos);
            }
            else {
                if (this.selectPos.equalTo(pos)) {
                    this.unSelectGemstone(this.selectPos);
                }
                else if (this.selectPos.borderUpon(pos)) {
                    this.exchangeGemstone(this.selectPos, pos);
                    this.unSelectGemstone(this.selectPos);
                }
                else {
                    this.unSelectGemstone(this.selectPos);
                    this.selectGemstone(pos);
                }
            }
        };
        /**
        * 进入闲置状态
        */
        p.toIdle = function () {
            this.state = GridState.IDLE;
            this.matchEffectList = [];
            var gemstoneArr = this.getUsefulGemstone();
            if (gemstoneArr != null) {
            }
            else {
                this.rearrangeGemstone();
            }
        };
        /**
        * 选中宝石
        */
        p.selectGemstone = function (pos) {
            this.selectPos = pos.clone();
            var gemstone = this.getGemstone(pos);
            if (gemstone != null) {
                this.sendNotification(GridProxy.GEMSTONE_SELECT, pos.clone());
            }
        };
        /**
        * 取消选中宝石
        */
        p.unSelectGemstone = function (pos) {
            this.selectPos = null;
            var gemstone = this.getGemstone(pos);
            if (gemstone != null) {
                this.sendNotification(GridProxy.GEMSTONE_UNSELECT, pos.clone());
            }
        };
        /**
        * 交换宝石
        */
        p.exchangeGemstone = function (pos1, pos2, isMove) {
            if (isMove === void 0) { isMove = true; }
            if (isMove) {
                this.state = GridState.MOVE;
            }
            else {
                this.state = GridState.RESTORE;
            }
            var gemstone1 = this.getGemstone(pos1);
            var gemstone2 = this.getGemstone(pos2);
            if (gemstone1 != null && gemstone2 != null) {
                var moveList = [];
                moveList.push(this.moveGemstone(gemstone1, gemstone2.position));
                moveList.push(this.moveGemstone(gemstone2, gemstone1.position));
                var duration = this.getMaxMoveDuration(moveList);
                egret.setTimeout(function () {
                    this.updateMovePosition(moveList);
                    if (this.state == GridState.RESTORE) {
                        this.toIdle();
                    }
                    else {
                        this.checkMatches();
                        if (this.matchesGemstone.length > 0) {
                            this.removeMatches();
                        }
                        else {
                            this.exchangeGemstone(pos1, pos2, false);
                        }
                    }
                }, this, duration + game.GameData.interval_time);
            }
        };
        /**
        * 消除
        */
        p.removeMatches = function () {
            this.state = GridState.REMOVE;
            var arr = [];
            for (var i = 0; i < this.matchesGemstone.length; i++) {
                this.addMatchEffect([this.matchesGemstone[i][0].type, this.matchesGemstone[i].length]);
                for (var j = 0; j < this.matchesGemstone[i].length; j++) {
                    var gemstone = this.matchesGemstone[i][j];
                    var pos = gemstone.position;
                    if (gemstone.effect != game.GemstoneEffect.NONE) {
                        arr.push(gemstone);
                    }
                    this.removeGemstone(pos);
                }
            }
            egret.setTimeout(function () {
                this.doGemstoneEffect(arr);
            }, this, game.GameData.interval_time);
        };
        /**
         * 添加消除效果
         */
        p.addMatchEffect = function (arr) {
            this.matchEffectList.push(arr);
        };
        /**
         * 消除效果
         */
        p.doMatchEffect = function () {
            this.state = GridState.MATCH_EFFECT;
            for (var i = 0; i < this.matchEffectList.length; i++) {
                if (this.matchEffectList[i][1] >= 4) {
                    this.matchesEffect_4(this.matchEffectList[i][0]);
                }
            }
            egret.setTimeout(function () {
                this.handle_complete();
            }, this, game.GameData.interval_time);
        };
        /**
         * 操作结束
         */
        p.handle_complete = function () {
            this.sendNotification(game.GameCommand.HANDLE_COMPLETE, this.matchEffectList);
        };
        /**
         * 4连效果
         */
        p.matchesEffect_4 = function (type) {
            switch (type) {
                case game.GemstoneType.PINK: {
                    this.changeRandomGemstoneEffect(game.GemstoneEffect.NONE, game.GemstoneEffect.HOR);
                    break;
                }
                case game.GemstoneType.RED: {
                    this.changeRandomGemstoneEffect(game.GemstoneEffect.NONE, game.GemstoneEffect.VER);
                    break;
                }
                case game.GemstoneType.GREEN: {
                    this.changeRandomGemstoneEffect(game.GemstoneEffect.NONE, game.GemstoneEffect.SCOPE);
                    break;
                }
                case game.GemstoneType.YELLOW: {
                    this.changeRandomGemstoneEffect(game.GemstoneEffect.NONE, game.GemstoneEffect.VER);
                    break;
                }
                case game.GemstoneType.BLUE: {
                    this.changeRandomGemstoneEffect(game.GemstoneEffect.NONE, game.GemstoneEffect.HOR);
                    break;
                }
            }
        };
        /**
         * 转化随机宝石效果
         */
        p.changeRandomGemstoneEffect = function (effect, targetEffect) {
            var gemstone = this.getRandomGemstone();
            while (gemstone.effect != effect) {
                gemstone = this.getRandomGemstone();
            }
            gemstone.effect = targetEffect;
            this.sendNotification(GridProxy.GEMSTONE_CHANGE_EFFECT, gemstone.clone());
        };
        /**
         * 获得随机宝石
         */
        p.getRandomGemstone = function () {
            var xRand = Math.floor(Math.random() * this.xSize);
            var yRand = Math.floor(Math.random() * this.ySize);
            return this.gemstoneList[xRand][yRand];
        };
        /**
         * 宝石效果
         */
        p.doGemstoneEffect = function (arr) {
            this.state = GridState.GS_EFFECT;
            var arr1 = [];
            for (var i = 0; i < arr.length; i++) {
                var temp = [];
                switch (arr[i].effect) {
                    case game.GemstoneEffect.HOR: {
                        temp = this.gamestoneHorEffect(arr[i]);
                        break;
                    }
                    case game.GemstoneEffect.VER: {
                        temp = this.gamestoneVerEffect(arr[i]);
                        break;
                    }
                    case game.GemstoneEffect.SCOPE: {
                        temp = this.gamestoneScopeEffect(arr[i]);
                        break;
                    }
                }
                for (var j = 0; j < temp.length; j++) {
                    arr1.push(temp[j]);
                }
            }
            if (arr1.length > 0) {
                this.doGemstoneEffect(arr1);
            }
            else {
                var duration = 0;
                if (arr.length > 0) {
                    duration = game.GameData.remove_time + game.GameData.interval_time;
                }
                egret.setTimeout(function () {
                    this.repairGemstones();
                }, this, duration);
            }
        };
        /**
         * 横向消除效果
         */
        p.gamestoneHorEffect = function (gemstone) {
            var arr = [];
            for (var x = 0; x < this.xSize; x++) {
                var pos = new game.Vector2(x, gemstone.position.y);
                var gs = this.getGemstone(pos);
                if (gs != null) {
                    this.removeGemstone(pos);
                    if (gs.effect != game.GemstoneEffect.NONE) {
                        arr.push(gs);
                    }
                }
            }
            return arr;
        };
        /**
         * 纵向消除效果
         */
        p.gamestoneVerEffect = function (gemstone) {
            var arr = [];
            for (var y = 0; y < this.ySize; y++) {
                var pos = new game.Vector2(gemstone.position.x, y);
                var gs = this.getGemstone(pos);
                if (gs != null) {
                    this.removeGemstone(pos);
                    if (gs.effect != game.GemstoneEffect.NONE) {
                        arr.push(gs);
                    }
                }
            }
            return arr;
        };
        /**
         * 范围消除效果
         */
        p.gamestoneScopeEffect = function (gemstone) {
            var arr = [];
            var min_x = Math.max(0, gemstone.position.x - 1);
            var max_x = Math.min(this.xSize, gemstone.position.x + 1);
            var min_y = Math.max(0, gemstone.position.y - 1);
            var max_y = Math.min(this.ySize, gemstone.position.y + 1);
            for (var x = min_x; x <= max_x; x++) {
                for (var y = min_y; y <= max_y; y++) {
                    var pos = new game.Vector2(x, y);
                    var gs = this.getGemstone(pos);
                    if (gs != null) {
                        this.removeGemstone(pos);
                        if (gs.effect != game.GemstoneEffect.NONE) {
                            arr.push(gs);
                        }
                    }
                }
            }
            return arr;
        };
        /**
        * 修复
        */
        p.repairGemstones = function () {
            this.state = GridState.REPAIR;
            var moveList = [];
            var removeArr = [];
            for (var x = 0; x < this.xSize; x++) {
                var temp = [];
                removeArr.push(temp);
                for (var y = 0; y < this.ySize; y++) {
                    if (this.gemstoneList[x][y] == null) {
                        temp.push(y);
                    }
                }
            }
            for (var x = 0; x < removeArr.length; x++) {
                var tmpArr = removeArr[x];
                tmpArr.sort(game.SortUtils.sortNum);
                for (var i = 0; i < tmpArr.length; i++) {
                    var gemstone = new game.Gemstone();
                    gemstone.position = new game.Vector2(x, i - tmpArr.length);
                    gemstone.type = this.randomGemstoneType();
                    this.creatGemstone(gemstone);
                    moveList.push(this.moveGemstone(gemstone, new game.Vector2(x, i)));
                }
                for (var y = 0; y < this.ySize; y++) {
                    if (y < tmpArr[0]) {
                        moveList.push(this.moveGemstone(this.getGemstone(new game.Vector2(x, y)), new game.Vector2(x, y + tmpArr.length)));
                    }
                    else {
                        tmpArr.shift();
                        if (tmpArr.length == 0)
                            break;
                    }
                }
            }
            var duration = this.getMaxMoveDuration(moveList);
            egret.setTimeout(function () {
                this.updateMovePosition(moveList);
                this.checkMatches();
                if (this.matchesGemstone.length > 0) {
                    this.removeMatches();
                }
                else {
                    this.doMatchEffect();
                }
            }, this, duration + game.GameData.interval_time);
        };
        /**
        * 移动格子宝石
        */
        p.moveGemstone = function (gemstone, targetPos) {
            var dis = Math.sqrt(Math.pow(targetPos.x - gemstone.position.x, 2)
                + Math.pow(targetPos.y - gemstone.position.y, 2));
            var duration = Math.sqrt(dis) * game.GameData.base_move_time;
            var moveInfo = new game.MoveInfo(gemstone.clone(), targetPos.clone(), duration);
            this.sendNotification(GridProxy.GEMSTONE_MOVE, moveInfo);
            return moveInfo;
        };
        /**
         * 移动花费的最长时间
         */
        p.getMaxMoveDuration = function (moveList) {
            var duration = 0;
            for (var i = 0; i < moveList.length; i++) {
                duration = Math.max(duration, moveList[i].duration);
            }
            return duration;
        };
        /**
        * 更新移动后的位置
        */
        p.updateMovePosition = function (moveList) {
            var moveGemstoneList = [];
            for (var i = 0; i < moveList.length; i++) {
                moveGemstoneList.push(moveList[i].gemstone.clone());
            }
            for (var i = 0; i < moveList.length; i++) {
                var moveInfo = moveList[i];
                moveGemstoneList[i].prePosition = moveInfo.gemstone.position.clone();
                moveGemstoneList[i].position = moveInfo.targetPos.clone();
                this.gemstoneList[moveInfo.targetPos.x][moveInfo.targetPos.y] = moveGemstoneList[i];
            }
        };
        /**
         * 初始化宝石列表
         */
        p.initGemstoneList = function () {
            this.gemstoneList = [];
            for (var x = 0; x < this.xSize; x++) {
                var temp = [];
                this.gemstoneList.push(temp);
                for (var y = 0; y < this.ySize; y++) {
                    var gemstone = new game.Gemstone();
                    gemstone.position = new game.Vector2(x, y);
                    gemstone.type = this.randomGemstoneType();
                    while (this.checkGemstoneMatches(gemstone.position, gemstone.type)) {
                        gemstone.type = this.randomGemstoneType();
                    }
                    temp.push(gemstone);
                }
            }
            if (this.getUsefulGemstone() == null) {
                this.initGemstoneList();
            }
        };
        /**
         * 创建列表中的宝石
         */
        p.createGemstoneInList = function () {
            for (var x = 0; x < this.xSize; x++) {
                for (var y = 0; y < this.ySize; y++) {
                    var gemstone = this.getGemstone(new game.Vector2(x, y));
                    if (gemstone) {
                        this.creatGemstone(gemstone);
                    }
                }
            }
        };
        /**
         * 随机宝石类型
         */
        p.randomGemstoneType = function () {
            return game.GemstoneType.random;
        };
        /**
        * 重新排列宝石
        */
        p.rearrangeGemstone = function () {
            this.state = GridState.REARRANGE;
            var targetArr = [];
            var temp = this.gemstoneList.slice(0);
            targetArr = this.upsetGemstoneList();
            this.checkMatches();
            while (this.matchesGemstone.length > 0 || this.getUsefulGemstone() == null) {
                this.gemstoneList = temp.slice(0);
                targetArr = this.upsetGemstoneList();
                this.checkMatches();
            }
            this.gemstoneList = temp.slice(0);
            var fun = function () {
                var moveList = [];
                for (var x = 0; x < this.xSize; x++) {
                    for (var y = 0; y < this.ySize; y++) {
                        moveList.push(this.moveGemstone(this.getGemstone(new game.Vector2(x, y)), targetArr[x][y]));
                    }
                }
                var duration = this.getMaxMoveDuration(moveList);
                egret.setTimeout(function () {
                    this.updateMovePosition(moveList);
                    this.toIdle();
                }, this, duration + game.GameData.interval_time);
            };
            egret.setTimeout(fun, this, game.GameData.rearrange_time);
        };
        /**
        * 打乱宝石序列
        */
        p.upsetGemstoneList = function () {
            var arr = [];
            var targetArr = [];
            for (var x = 0; x < this.xSize; x++) {
                var temp = [];
                targetArr.push(temp);
                for (var y = 0; y < this.ySize; y++) {
                    var gemstone = this.getGemstone(new game.Vector2(x, y)).clone();
                    arr.push(gemstone);
                    temp.push(null);
                }
            }
            arr.sort(game.SortUtils.random);
            this.gemstoneList = [];
            for (var x = 0; x < this.xSize; x++) {
                var temp1 = [];
                this.gemstoneList.push(temp1);
                for (var y = 0; y < this.ySize; y++) {
                    var gemstone = arr[x * this.ySize + y];
                    targetArr[gemstone.position.x][gemstone.position.y] = new game.Vector2(x, y);
                    gemstone.position = new game.Vector2(x, y);
                    temp1.push(gemstone);
                }
            }
            return targetArr;
        };
        /**
        * 获取可交换的宝石
        */
        p.getUsefulGemstone = function () {
            this.s_x = 0;
            this.s_y = 0;
            this.is_2x3 = true;
            this.is_3x2 = false;
            this.is_1x4 = false;
            this.is_4x1 = false;
            var gemstoneArr = null;
            var sec = this.getNextSection();
            while (gemstoneArr == null && sec != null) {
                if (sec.length == 1) {
                    //有两种情况
                    if (sec[0][0].type == sec[0][1].type && sec[0][0].type == sec[0][3].type) {
                        gemstoneArr = [sec[0][3].position, sec[0][2].position];
                    }
                    else if (sec[0][0].type == sec[0][2].type && sec[0][0].type == sec[0][3].type) {
                        gemstoneArr = [sec[0][0].position, sec[0][1].position];
                    }
                }
                else if (sec.length == 2) {
                    //只有6种可消除情况
                    if (sec[0][0].type == sec[1][1].type && sec[0][0].type == sec[1][2].type) {
                        gemstoneArr = [sec[0][0].position, sec[1][0].position];
                    }
                    else if (sec[0][1].type == sec[1][0].type && sec[0][1].type == sec[1][2].type) {
                        gemstoneArr = [sec[0][1].position, sec[1][1].position];
                    }
                    else if (sec[0][2].type == sec[1][0].type && sec[0][2].type == sec[1][1].type) {
                        gemstoneArr = [sec[0][2].position, sec[1][2].position];
                    }
                    else if (sec[1][0].type == sec[0][1].type && sec[1][0].type == sec[0][2].type) {
                        gemstoneArr = [sec[1][0].position, sec[0][0].position];
                    }
                    else if (sec[1][1].type == sec[0][0].type && sec[1][1].type == sec[0][2].type) {
                        gemstoneArr = [sec[1][1].position, sec[0][1].position];
                    }
                    else if (sec[1][2].type == sec[0][0].type && sec[1][2].type == sec[0][1].type) {
                        gemstoneArr = [sec[1][2].position, sec[0][2].position];
                    }
                }
                sec = this.getNextSection();
            }
            return gemstoneArr;
        };
        /**
         * 获取下块选择区域
         */
        p.getNextSection = function () {
            var sec = [];
            //(2*3)遍历
            if (this.is_2x3 && this.s_x <= this.xSize - 2 && this.s_y <= this.xSize - 3) {
                for (var i = 0; i < 2; i++) {
                    var temp = [];
                    sec.push(temp);
                    for (var j = 0; j < 3; j++) {
                        temp.push(this.getGemstone(new game.Vector2(this.s_x + i, this.s_y + j)));
                    }
                }
                this.s_x++;
                if (this.s_x == this.xSize - 1) {
                    this.s_x = 0;
                    this.s_y++;
                    if (this.s_y == this.ySize - 2) {
                        //遍历完毕
                        this.s_x = 0;
                        this.s_y = 0;
                        this.is_2x3 = false;
                        this.is_3x2 = true;
                        this.is_1x4 = false;
                        this.is_4x1 = false;
                    }
                }
                return sec;
            }
            //(3*2)遍历
            if (this.is_3x2 && this.s_x <= this.xSize - 3 && this.s_y <= this.xSize - 2) {
                for (var j = 0; j < 2; j++) {
                    var temp = [];
                    sec.push(temp);
                    for (var i = 0; i < 3; i++) {
                        temp.push(this.getGemstone(new game.Vector2(this.s_x + i, this.s_y + j)));
                    }
                }
                this.s_x++;
                if (this.s_x == this.xSize - 2) {
                    this.s_x = 0;
                    this.s_y++;
                    if (this.s_y == this.ySize - 1) {
                        //遍历完毕
                        this.s_x = 0;
                        this.s_y = 0;
                        this.is_2x3 = false;
                        this.is_3x2 = false;
                        this.is_1x4 = true;
                        this.is_4x1 = false;
                    }
                }
                return sec;
            }
            //(1*4)遍历
            if (this.is_1x4 && this.s_x <= this.xSize - 1 && this.s_y <= this.xSize - 4) {
                var temp = [];
                sec.push(temp);
                for (var j = 0; j < 4; j++) {
                    temp.push(this.getGemstone(new game.Vector2(this.s_x, this.s_y + j)));
                }
                this.s_x++;
                if (this.s_x == this.xSize) {
                    this.s_x = 0;
                    this.s_y++;
                    if (this.s_y == this.ySize - 3) {
                        //遍历完毕
                        this.s_x = 0;
                        this.s_y = 0;
                        this.is_2x3 = false;
                        this.is_3x2 = false;
                        this.is_1x4 = false;
                        this.is_4x1 = true;
                    }
                }
                return sec;
            }
            //(4*1)遍历
            if (this.is_4x1 && this.s_x <= this.xSize - 4 && this.s_y <= this.xSize - 1) {
                var temp = [];
                sec.push(temp);
                for (var i = 0; i < 4; i++) {
                    temp.push(this.getGemstone(new game.Vector2(this.s_x + i, this.s_y)));
                }
                this.s_x++;
                if (this.s_x == this.xSize - 3) {
                    this.s_x = 0;
                    this.s_y++;
                    if (this.s_y == this.ySize) {
                        //遍历完毕
                        this.s_x = 0;
                        this.s_y = 0;
                        this.is_2x3 = true;
                        this.is_3x2 = false;
                        this.is_1x4 = false;
                        this.is_4x1 = false;
                        sec = null;
                    }
                }
                return sec;
            }
            return sec;
        };
        /**
         * 检测是否有宝石可消除
         */
        p.checkMatches = function () {
            this.matchesGemstone = [];
            this.checkHorMatches();
            this.checkVerMatches();
        };
        /**
        * 纵向检测
        */
        p.checkHorMatches = function () {
            var isMatched = false;
            for (var x = 0; x < this.xSize; x++) {
                for (var y = 0; y < this.ySize - 2; y++) {
                    var gemstone1 = this.getGemstone(new game.Vector2(x, y));
                    var gemstone2 = this.getGemstone(new game.Vector2(x, y + 1));
                    var gemstone3 = this.getGemstone(new game.Vector2(x, y + 2));
                    if (gemstone1 != null && gemstone2 != null && gemstone3 != null) {
                        if (gemstone1.type == gemstone2.type && gemstone1.type == gemstone3.type) {
                            isMatched = true;
                            this.addMatches([gemstone1, gemstone2, gemstone3]);
                        }
                    }
                }
            }
            return isMatched;
        };
        /**
        * 横向检测
        */
        p.checkVerMatches = function () {
            var isMatched = false;
            for (var y = 0; y < this.ySize; y++) {
                for (var x = 0; x < this.xSize - 2; x++) {
                    var gemstone1 = this.getGemstone(new game.Vector2(x, y));
                    var gemstone2 = this.getGemstone(new game.Vector2(x + 1, y));
                    var gemstone3 = this.getGemstone(new game.Vector2(x + 2, y));
                    if (gemstone1 != null && gemstone2 != null && gemstone3 != null) {
                        if (gemstone1.type == gemstone2.type && gemstone1.type == gemstone3.type) {
                            isMatched = true;
                            this.addMatches([gemstone1, gemstone2, gemstone3]);
                        }
                    }
                }
            }
            return isMatched;
        };
        /**
        * 加入消除序列
        */
        p.addMatches = function (gemstones) {
            var index = -1;
            for (var i = 0; i < this.matchesGemstone.length; i++) {
                for (var j = 0; j < gemstones.length; j++) {
                    if (this.matchesGemstone[i].indexOf(gemstones[j]) >= 0) {
                        index = i;
                        break;
                    }
                }
                if (index >= 0)
                    break;
            }
            if (index >= 0) {
                for (var j = 0; j < gemstones.length; j++) {
                    if (this.matchesGemstone[index].indexOf(gemstones[j]) == -1) {
                        this.matchesGemstone[index].push(gemstones[j]);
                    }
                }
            }
            else {
                this.matchesGemstone.push(gemstones);
            }
        };
        /**
        * 检查宝石是否可消除(初始化时)
        */
        p.checkGemstoneMatches = function (pos, type) {
            var isMatched = false;
            if (pos.x >= 2) {
                var gemstone0 = this.getGemstone(new game.Vector2(pos.x - 2, pos.y));
                var gemstone1 = this.getGemstone(new game.Vector2(pos.x - 1, pos.y));
                if (gemstone0 != null && gemstone1 != null && gemstone0.type == type && gemstone1.type == type) {
                    isMatched = true;
                }
            }
            if (!isMatched && pos.y >= 2) {
                var gemstone0 = this.getGemstone(new game.Vector2(pos.x, pos.y - 2));
                var gemstone1 = this.getGemstone(new game.Vector2(pos.x, pos.y - 1));
                if (gemstone0 != null && gemstone1 != null && gemstone0.type == type && gemstone1.type == type) {
                    isMatched = true;
                }
            }
            return isMatched;
        };
        /**
        * 创建宝石
        */
        p.creatGemstone = function (gemstone) {
            this.sendNotification(GridProxy.GEMSTONE_CREATE, gemstone.clone());
        };
        /**
        * 消除宝石
        */
        p.removeGemstone = function (pos) {
            this.gemstoneList[pos.x][pos.y] = null;
            this.sendNotification(GridProxy.GEMSTONE_REMOVE, pos.clone());
        };
        /**
        * 获取指定位置的宝石
        */
        p.getGemstone = function (pos) {
            if (this.withinBounds(pos)) {
                return this.gemstoneList[pos.x][pos.y];
            }
            else {
                return null;
            }
        };
        /**
        * 检查位置是否合法
        */
        p.withinBounds = function (pos) {
            return pos.x >= 0 && pos.x < this.xSize && pos.y >= 0 && pos.y < this.ySize;
        };
        /** 创建宝石 */
        GridProxy.GEMSTONE_CREATE = "gemstone_create";
        /** 选中宝石 */
        GridProxy.GEMSTONE_SELECT = "gemstone_select";
        /** 取消选中宝石 */
        GridProxy.GEMSTONE_UNSELECT = "gemstone_unselect";
        /** 移动宝石 */
        GridProxy.GEMSTONE_MOVE = "gemstone_move";
        /** 移除宝石 */
        GridProxy.GEMSTONE_REMOVE = "gemstone_remove";
        /** 改变宝石效果 */
        GridProxy.GEMSTONE_CHANGE_EFFECT = "gemstone_change_effect";
        return GridProxy;
    }(puremvc.Proxy));
    game.GridProxy = GridProxy;
    egret.registerClass(GridProxy,'game.GridProxy',["puremvc.IProxy","puremvc.INotifier"]);
})(game || (game = {}));
