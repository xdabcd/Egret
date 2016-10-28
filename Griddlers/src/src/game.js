Griddlers = {

    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false

};

Griddlers.Boot = function (game) {
};

Griddlers.Boot.prototype = {

    init: function () {
        
        if (game.device.iPad) {
            game.device.desktop = true;
        }

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = false;
    
        this.stage.backgroundColor = 0xffffff;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        game.resizeGame = this.scaleGameSizeUpdate;
        this.scale.onSizeChange.add(this.scaleGameSizeUpdate);

        this.scale.setResizeCallback(function() {
            if (Griddlers.old_w != window.innerWidth || Griddlers.old_h != window.innerHeight) {
                Griddlers.old_w = window.innerWidth;
                Griddlers.old_h = window.innerHeight;
                game.resizeGame();
            }
        });

        if (!game.device.desktop) {
            this.scale.forceOrientation(false, true);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

        SG_Hooks.setResizeHandler(this.scaleGameSizeUpdate);
        SG_Hooks.setOrientationHandler(this.scaleGameSizeUpdate);
        SG_Hooks.setPauseHandler(function() {
            game.paused = true;
        });
        SG_Hooks.setUnpauseHandler(function() {
            game.paused = false;
        });

        game.incentivise = SG_Hooks.isEnabledIncentiviseButton();

        /*
        if (this.game.device.desktop)
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(false, true);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }*/
        
    },



    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('logoSoftgames', 'images/logo_softgames.png');
        this.load.image('loadingbar_bg', 'images/loadingbar_bg.png');
        this.load.image('loadingbar', 'images/loadingbar.png');
        game.load.text('levels', 'json/levels.json');
        game.load.text('settings', 'json/settings.json');
        game.load.text('languages', 'json/languages.json');
    },

    create: function () {
        game.SETTINGS = JSON.parse(game.cache.getText('settings'));
        game.LANG = JSON.parse(game.cache.getText('languages'));
        game.LEVELS = JSON.parse(game.cache.getText('levels'));
        game.LEVELS.forEach(function(cat,index) {
            cat.active = (cat.desktop && game.device.desktop) || (cat.mobile && !game.device.desktop);
            cat.nr = index;
        });

        game.selectedLang = SG.lang; //SG_Hooks.getLanguage(Object.keys(game.LANG));
        game.getTxt = function(txt) {
            return game.LANG[game.selectedLang][txt]
        };

        Griddlers.saveState.load();

        this.state.start('Preloader');

    },

    scaleGameSizeUpdate: function() {
        
            var parentBounds = game.scale.getParentBounds();
            var ratio = parentBounds.height/parentBounds.width;
            var state = game.state.getCurrentState();
            Griddlers.horizontalLayout = false;

            if (game.device.desktop) {
                game.scale.setGameSize(Math.max(640,Math.ceil(parentBounds.width*(800/parentBounds.height))),800);
                game.world.setBounds(Math.ceil((game.width-640)*-0.5),0,game.width,game.height);
                if (game.width >= 1050) {
                    Griddlers.horizontalLayout = true;
                }
            }else {
                game.scale.setGameSize(640,game.math.clamp(640*ratio,800,1500));
            }

            if (state.resize) state.resize();    

    },

    enterIncorrectOrientation: function () {

        Griddlers.orientated = false;
        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        Griddlers.orientated = true;

        document.getElementById('orientation').style.display = 'none';

    }

};

Griddlers.Categories = function (game) {


};

Griddlers.Categories.prototype = {

	create: function () {

		this.bg = game.add.image(0,0,'ssheet','griddlers-bacground');
		this.bg.cacheAsBitmap = true;

		this.clouds = Griddlers.makeClouds();
		



		this.resize();

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	resize: function() {
		this.bg.height = game.height;
		this.bg.updateCache();

		this.world.children.forEach(function(child) {
			if (child.pY) {
				child.y = child.pY*game.height;
			}

			if (child.onResize) {
				child.onResize();
			}
		});
	}

};

(function(a){"use strict";var b=a.HTMLCanvasElement&&a.HTMLCanvasElement.prototype,c=a.Blob&&function(){try{return Boolean(new Blob)}catch(a){return!1}}(),d=c&&a.Uint8Array&&function(){try{return(new Blob([new Uint8Array(100)])).size===100}catch(a){return!1}}(),e=a.BlobBuilder||a.WebKitBlobBuilder||a.MozBlobBuilder||a.MSBlobBuilder,f=(c||e)&&a.atob&&a.ArrayBuffer&&a.Uint8Array&&function(a){var b,f,g,h,i,j;a.split(",")[0].indexOf("base64")>=0?b=atob(a.split(",")[1]):b=decodeURIComponent(a.split(",")[1]),f=new ArrayBuffer(b.length),g=new Uint8Array(f);for(h=0;h<b.length;h+=1)g[h]=b.charCodeAt(h);return i=a.split(",")[0].split(":")[1].split(";")[0],c?new Blob([d?g:f],{type:i}):(j=new e,j.append(f),j.getBlob(i))};a.HTMLCanvasElement&&!b.toBlob&&(b.mozGetAsFile?b.toBlob=function(a,c,d){d&&b.toDataURL&&f?a(f(this.toDataURL(c,d))):a(this.mozGetAsFile("blob",c))}:b.toDataURL&&f&&(b.toBlob=function(a,b,c){a(f(this.toDataURL(b,c)))})),typeof define=="function"&&define.amd?define(function(){return f}):a.dataURLtoBlob=f})(this);


Griddlers.Editor = function (game) {

};

Griddlers.Editor.prototype = {

    init: function(cat,levelNr) {
        console.log('--Editor init');
        console.log(cat);
        console.log(levelNr);

        this.category = cat;
        this.levelNr = levelNr
        this.level = cat.levels[levelNr] || {type: "10x10"};
    },

	create: function () {

        this.onModeChange = new Phaser.Signal();

		s = game.state.getCurrentState();

        this.bg = game.add.image(0,0,'ssheet','griddlers-bacground');
        this.bg.cacheAsBitmap = true;
        this.clouds = Griddlers.makeClouds();

        this.backBtn = new Griddlers.Button(60,60,'griddlers-button-Levels',function() {
            game.state.start("EditorPage");
        });
        game.add.existing(this.backBtn);

        this.board = new Griddlers.BoardEditor(this.level);


        var keys = Object.keys(game.SETTINGS.boards);
        this.boardsBtn = [];
        for (var i = 0; i < keys.length; i++) {
            var txt = game.add.bitmapText(630,10+(i*35),'font',keys[i],30);
            txt.inputEnabled = true;
            txt.board = keys[i];
            if (txt.board == this.level.type) txt.tint = 0x000000;
            txt.events.onInputDown.add(function() {
                s.board.loadBoard(this.board);
                s.boardsBtn.forEach(function(btn) {
                    if (s.level.type == btn.board) {
                        btn.tint = 0x000000;
                    }else {
                        btn.tint = 0xFFFFFF;
                    }
                })
            },txt)
            txt.anchor.setTo(1,0);
            this.boardsBtn[i] = txt;
        }

        this.boardsBtn.forEach(function(btn) {
            btn.input.useHandCursor = true;
        })

        
        this.saveBtn = new Griddlers.Button(150,700,'Button_Middle',this.board.saveLevel,this.board);
        this.saveBtn.addTextLabel('font','SAVE!');
        game.add.existing(this.saveBtn);
        this.saveTestBtn = new Griddlers.Button(490,700,'Button_Middle',function() {
            this.board.saveLevel();
            game.state.start("Game",true,false,this.category,this.levelNr,true);

        },this);
        this.saveTestBtn.addTextLabel('font','SAVE AND TEST');
        game.add.existing(this.saveTestBtn);


        this.fader = Griddlers.makeFadeLayer();
        this.resize();

	},

	update: function () {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

	},

    goBackToMenu: function() {
        this.fader.goToState('MainMenu',this.category,this.levelNr);
    },

	resize: function() {
        
        this.bg.height = game.height;
        this.bg.updateCache();

        this.world.children.forEach(function(child) {
            if (child.onResize) {
                child.onResize();
            }
        });

    }

};


(function(a){"use strict";var b=a.HTMLCanvasElement&&a.HTMLCanvasElement.prototype,c=a.Blob&&function(){try{return Boolean(new Blob)}catch(a){return!1}}(),d=c&&a.Uint8Array&&function(){try{return(new Blob([new Uint8Array(100)])).size===100}catch(a){return!1}}(),e=a.BlobBuilder||a.WebKitBlobBuilder||a.MozBlobBuilder||a.MSBlobBuilder,f=(c||e)&&a.atob&&a.ArrayBuffer&&a.Uint8Array&&function(a){var b,f,g,h,i,j;a.split(",")[0].indexOf("base64")>=0?b=atob(a.split(",")[1]):b=decodeURIComponent(a.split(",")[1]),f=new ArrayBuffer(b.length),g=new Uint8Array(f);for(h=0;h<b.length;h+=1)g[h]=b.charCodeAt(h);return i=a.split(",")[0].split(":")[1].split(";")[0],c?new Blob([d?g:f],{type:i}):(j=new e,j.append(f),j.getBlob(i))};a.HTMLCanvasElement&&!b.toBlob&&(b.mozGetAsFile?b.toBlob=function(a,c,d){d&&b.toDataURL&&f?a(f(this.toDataURL(c,d))):a(this.mozGetAsFile("blob",c))}:b.toDataURL&&f&&(b.toBlob=function(a,b,c){a(f(this.toDataURL(b,c)))})),typeof define=="function"&&define.amd?define(function(){return f}):a.dataURLtoBlob=f})(this);

function saveCanvas(x_canvas){
    x_canvas.toBlob(function(blob) {
        saveAs(
            blob
            , "miniaturesheet.png"
        );
    }, "image/png");
}
Griddlers.EditorPage = function (game) {

};

Griddlers.EditorPage.prototype = {

    init: function() {
        
    },

	create: function () {

        this.onModeChange = new Phaser.Signal();

		s = game.state.getCurrentState();

        this.bg = Griddlers.makeBackground();
        this.bg.leftStripe.visible = this.bg.rightStripe.visible = false;

    
        this.selected = [null,null];

        this.GROUP = game.add.group();
        this.GROUP.cursors = game.input.keyboard.createCursorKeys();
        this.GROUP.update = function() {
            if (this.cursors.down.isDown) {
                this.y -= 15;
            }
            if (this.cursors.up.isDown) {
                this.y += 15;
            }
            this.y = game.math.clamp(this.y,-this.height+300,150)
        }

        this.GROUP.y = 150;
        this.restart();
        

        this.backBtn = new Griddlers.Button(60,60,'griddlers-button-Levels',function() {
            game.state.start("MainMenu");
        });
        game.add.existing(this.backBtn);

        this.moveB = new Griddlers.Button(200,60,'griddlers-editor-moveb',this.movePrev,this);
        game.add.existing(this.moveB);

        this.moveF = new Griddlers.Button(300,60,'griddlers-editor-movef',this.moveNext,this);
        game.add.existing(this.moveF);

        this.newCat = new Griddlers.Button(400,60,'griddlers-editor-newcat',function() {
            game.LEVELS.push({
                "name" : "NEW CAT",
                "desktop" : true,
                "mobile" : true,
                "unlock" : 0,
                "levels" : [
                    {"type":"5x5","data":[[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]]},
                ]
            })
            s.restart();
        });
        game.add.existing(this.newCat);

        this.deleteLvl = new Griddlers.Button(500,60,'griddlers-editor-deletelvl',function() {
             var cat = this.selected[0];
            var lvlNr = this.selected[1];
            if (cat == null) return;
            if (game.LEVELS[cat].levels.length > 1) {
                game.LEVELS[cat].levels.splice(lvlNr,1);
                this.selected = [null,null];
                s.restart();
            }else {
                alert("there need to be at least 1 level within category");
            }
            
        },this);
        game.add.existing(this.deleteLvl);

        this.editlvl = new Griddlers.Button(600,60,'griddlers-editor-editlvl',function() {
            var cat = this.selected[0];
            var lvlNr = this.selected[1];
            if (cat == null) return;
            game.state.start("Editor",true,false,game.LEVELS[cat],lvlNr);
        },this);
        game.add.existing(this.editlvl);

        this.exportJson = new Griddlers.Button(700,60,'griddlers-editor-export',function() {
            this.exportPuzzlesMiniatures();
            var blob = new Blob([JSON.stringify(game.LEVELS)],{type: "text/plain;charset=utf-8"});
            var name = new Date().toUTCString();
            name = name.replace(':','-');
            name = name.replace(':','-');
            saveAs(blob, name+" Griddlers LEVEL.json");
        },this);
        game.add.existing(this.exportJson);


        this.fader = Griddlers.makeFadeLayer();
        this.resize();

	},

    restart: function() {

        this.GROUP.removeAll(true,true);

        var yy = 0;

        game.LEVELS.forEach(function(cat,index) {
            var catGroup = this.makeCategory(cat,index);
            catGroup.y = yy;
            yy += catGroup.height+25;
            this.GROUP.add(catGroup);

        },this);

        


    },

    movePrev: function() {

        var cat = this.selected[0];
        var lvlNr = this.selected[1];

        if (cat == null) return;
        var tmp;

        if (lvlNr > 0) {
            tmp = game.LEVELS[cat].levels[lvlNr-1];
            game.LEVELS[cat].levels[lvlNr-1] = game.LEVELS[cat].levels[lvlNr];
            game.LEVELS[cat].levels[lvlNr] = tmp;
            this.selected[1] = lvlNr-1;
        }

        this.restart();
    },

    moveNext: function() {

        var cat = this.selected[0];
        var lvlNr = this.selected[1];
         if (cat == null) return;
        var tmp;

        if (lvlNr < game.LEVELS[cat].levels.length-1) {
            tmp = game.LEVELS[cat].levels[lvlNr+1];
            game.LEVELS[cat].levels[lvlNr+1] = game.LEVELS[cat].levels[lvlNr];
            game.LEVELS[cat].levels[lvlNr] = tmp;
            this.selected[1] = lvlNr+1;
        }

        this.restart();

    },

    moveHere: function(newCat) {

        var cat = this.selected[0];
        var lvlNr = this.selected[1];
        if (cat == null) return;

        if (game.LEVELS[cat].levels.length == 1) {
            alert("CATEGORY NEED TO HAVE AT LEAST 1 LEVEL!");
            return
        }

        game.LEVELS[newCat].levels.push(game.LEVELS[cat].levels[lvlNr]);
        game.LEVELS[cat].levels.splice(lvlNr,1);

        this.selected = [newCat,game.LEVELS[newCat].levels.length-1];

        this.restart();

    },

	update: function () {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

	},

    goBackToMenu: function() {
        this.fader.goToState('MainMenu',this.category,this.levelNr);
    },

    makeCategory: function(cat,catIndex) {

        var category = game.add.group();

        category.category = cat;
        category.categoryIndex = catIndex;
        category.name = game.add.bitmapText(10,10,'font',cat.name,20);
        category.name.inputEnabled = true;
        category.name.input.useHandCursor = true;
        category.name.tint = 0x000000;
        category.name.events.onInputDown.add(function() {
            cat.name = prompt("Enter new category name", cat.name);
            category.name.setText(cat.name || "CATEGORY");
        });
        category.add(category.name);

        category.pc = game.add.bitmapText(150,10,'font',"PC",20);
        category.pc.inputEnabled = true;
        category.pc.input.useHandCursor = true;
        category.pc.tint = cat.desktop ? 0x006a25 : 0xFF0000;
        category.pc.events.onInputDown.add(function() {
            cat.desktop = !cat.desktop;
            s.restart();
        });

        category.mobile = game.add.bitmapText(200,10,'font',"MOBILE",20);
        category.mobile.inputEnabled = true;
        category.mobile.input.useHandCursor = true;
        category.mobile.tint = cat.mobile ? 0x006a25 : 0xFF0000;
        category.mobile.events.onInputDown.add(function() {
            cat.mobile = !cat.mobile;
            s.restart();
        });

        category.unlock = game.add.bitmapText(300,10,'font',cat.unlock.toString(),20);
        category.unlock.inputEnabled = true;
        category.unlock.tint = 0x000000;
        category.unlock.input.useHandCursor = true;
        category.unlock.events.onInputDown.add(function() {
            var input = parseInt(prompt('to unlock'))
            if (!isNaN(input)) {
                cat.unlock = input;
                s.restart();
            }
            
        });
        category.add(category.unlock);

        category.moveHere = game.add.bitmapText(350,10,'font',"MOVE HERE",20);
        category.moveHere.inputEnabled = true;
        category.moveHere.tint = 0x000000;
        category.moveHere.input.useHandCursor = true;
        category.moveHere.events.onInputDown.add(function() {
            s.moveHere(catIndex);
            s.restart();
        });

        category.addLvl = game.add.bitmapText(550,10,'font',"NEW LVL",20);
        category.addLvl.inputEnabled = true;
        category.addLvl.tint = 0x000000;
        category.addLvl.input.useHandCursor = true;
        category.addLvl.events.onInputDown.add(function() {
            var boards = Object.keys(game.SETTINGS.boards);
            var promptString = "Choose type of board: \n";
            boards.forEach(function(e,i) {promptString += i+": "+e+'\n'});
            var answer = parseInt(prompt(promptString)) || 0;
            answer = answer >= boards.length ? 0 : answer;

            var newLvl = {type: boards[answer]};
            var width = game.SETTINGS.boards[boards[answer]].size[0];
            var height = game.SETTINGS.boards[boards[answer]].size[1];

            var dataLvl = [];
            var charToPut = "0"
            for (var col = 0; col < width; col++) {
                dataLvl[col] = [];
                for (var row = 0; row < height; row++) {
                    dataLvl[col][row] = charToPut;
                    charToPut = charToPut == "0" ? "1" : "0";
                }
            }
            newLvl.data = dataLvl;
            cat.levels.push(newLvl);
            
            s.restart();
        });


    
        category.nrOfLevels = game.add.bitmapText(700,80,'font',cat.levels.length.toString(),20);
        category.nrOfLevels.tint = 0x000000;
        category.add(category.nrOfLevels);



        category.starsReq = game.add.bitmapText(750,10,'font',cat.starsReq ? cat.starsReq[0]+' , '+cat.starsReq[1]+' , '+cat.starsReq[2]: '0 , 0',20);
        category.starsReq.inputEnabled = true;
        category.starsReq.tint = 0x000000;
        category.starsReq.input.useHandCursor = true;
        category.starsReq.events.onInputDown.add(function() {
            var input1 = parseInt(prompt('Time requirement for 3 stars (in seconds):'));
            var input2 = parseInt(prompt('Time requirement for 2 stars (in seconds):'));
            var input3 = parseInt(prompt('Time requirement for 1 stars (in seconds):'));
            if (!isNaN(input1) && !isNaN(input2) && !isNaN(input3)) {
                cat.starsReq = [input1,input2,input3];
                s.restart();
            }
            
        });

        category.add(category.starsReq);
        category.add(category.moveHere);
        category.add(category.pc);
        category.add(category.mobile);
        category.add(category.addLvl);

        var xx = 10;
        var yy = 50;
        var index = 0;
        cat.levels.forEach(function(lvl) {
           category.add(this.makeLvlButton(xx,yy,cat,index,lvl,catIndex));
           xx += 55;
           index++;
           if (xx > 600) {
            xx = 10;
            yy += 55;
           }
        },this);

        return category;

    },

    makeLvlButton: function(x,y,cat,index,lvl,catIndex) {

        var btn = game.make.graphics(x,y);
        btn.hitArea = new Phaser.Rectangle(0,0,50,50);
        btn.cat = cat;
        btn.lvlNr = index;
        btn.lvl = lvl;
        btn.inputEnabled = true;
        btn.input.useHandCursor = true;
        btn.events.onInputDown.add(function() {
            s.selected = [catIndex,this.lvlNr];
            s.restart();
        },btn);
        

        var width = 50/lvl.data.length;
        var height = 50/lvl.data[0].length;
        if (catIndex == s.selected[0] && index == s.selected[1]) {
            btn.beginFill(0x0000FF,1);
        }else {
            btn.beginFill(0x000000,1);
        }
       
        btn.clear();

        for (var collumn = 0; collumn < lvl.data.length; collumn++) {
            lvl.data[collumn].forEach(function(cell,row) {
                if (cell == 1) {
                     btn.drawRect(collumn*width,row*height,width,height);
                }
            })   
        };

        return btn;

    },

	resize: function() {

        this.world.children.forEach(function(child) {
            if (child.onResize) {
                child.onResize();
            }
        });

    },

    exportPuzzlesMiniatures: function() {

        var numberOfLevels = 0;
        game.LEVELS.forEach(function(cat) {
            numberOfLevels += cat.levels.length;
        });

        var width = Math.min(numberOfLevels,10)*56;
        var height = Math.ceil(numberOfLevels/10)*56;
        var bitmap = game.add.bitmapData(width,height);

        var json = {frames:{}};

        var img = game.make.image(0,0,'ssheet','griddlers-board-cube');

        var nrIndex = 0;
        for (var i = 0; i < game.LEVELS.length; i++) {
            var cat = game.LEVELS[i];
            
            cat.levels.forEach(function(lvl,lvlNr) {
                var xx = (nrIndex%10)*56;
                var yy =  Math.floor(nrIndex/10)*56;
                this.makeMiniature(bitmap,img,json,cat,lvlNr,xx,yy);
                nrIndex++;
            },this);
        }
        
        saveCanvas(bitmap.canvas);
        var blob = new Blob([JSON.stringify(json)],{type: "text/plain;charset=utf-8"});
        saveAs(blob, 'miniaturesheet.json');



    },

    makeMiniature: function(bitmap,image,json,cat,lvlNr,startX,startY) {

        var lvl = cat.levels[lvlNr];

        var cellSize = Math.floor(54/lvl.data.length);
        var w = cellSize*lvl.data.length;
        w = w%2 == 0 ? w : w+1;

        var obj = {
            "frame": {
                "x": startX,
                "y": startY,
                "w": w,
                "h": w
            },
            "rotated": false,
            "trimmed": false,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": w,
                "h": w
            },
            "sourceSize": {
                "w": w,
                "h": w
            }
        }

        json.frames[cat.name+'-'+lvlNr] = obj;

       

        for (var x = 0; x < lvl.data.length; x++) {
            lvl.data[x].forEach(function(cell,y) {
                if (cell == 1) {
                    bitmap.draw(image,Math.floor(startX+(x*cellSize)),Math.floor(startY+(y*cellSize)),cellSize,cellSize,null,false);
                }
            }); 
        }



    }

};


Griddlers.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

Griddlers.Game.prototype = {

    init: function(cat,levelNr,editor) {
        this.category = cat;
        this.levelNr = levelNr
        this.level = cat.levels[this.levelNr];
        this.EDITORMODE = editor || false;
        SG_Hooks.levelStarted(Griddlers.utils.getLvlNr(this.category.nr,this.levelNr));

    },

	create: function () {

        this.onWindowOpened = new Phaser.Signal();
        this.onWindowClosed = new Phaser.Signal();
        this.onModeChange = new Phaser.Signal();

        this.timer = game.time.create(false);
        this.timer.passed = 0;
        this.timer.loop(1000, this.updateTimer, this);
        this.timer.start();
        this.paused = false;
        this.onWindowOpened.add(this.timer.pause,this.timer);
        this.onWindowClosed.add(this.timer.resume,this.timer);

		s = game.state.getCurrentState();

        this.tapControll = Griddlers.saveState.isTapControll();

        this.bg = Griddlers.makeBackground();
        this.clouds = Griddlers.makeClouds();

        this.topButtons = Griddlers.makeGameButtons();

        this.board = new Griddlers.Board(this.level);
        this.board.onBoardClear.add(this.finishedLevel,this);

        this.toolbar = new Griddlers.ToolBar(this.board);
        this.board.toolbar = this.toolbar;

        this.pauseTxt = game.add.bitmapText(320,game.height*0.45,'font-blue',game.getTxt('Pause'),60);
        this.pauseTxt.cacheAsBitmap = true;
        this.pauseTxt._cachedSprite.anchor.setTo(0.5)
        this.pauseTxt.alpha = 0;
        this.pauseTxt.board = this.board;
        game.add.tween(this.pauseTxt.scale).to({x:1.4,y:1.4},1000,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);
        this.pauseTxt.onResize = function() {
            this.x = this.board.x+(this.board.scale.x*this.board.board.pxBgWidth*0.5);
            this.y = this.board.y+(this.board.scale.y*this.board.board.pxBgWidth*0.45);
        };
        
        this.winLayer = Griddlers.makeWindowLayer();
        this.fader = Griddlers.makeFadeLayer();
        
        this.resize();

        
	},

    goBackToMenu: function() {
        this.fader.goToState('MainMenu',2,this.category,this.levelNr);
    },

    pause: function() {
        if (!this.paused) {
            this.timer.pause();
            game.add.tween(this.board.numberGroup).to({alpha: 0},300,Phaser.Easing.Sinusoidal.InOut,true);
            game.add.tween(this.pauseTxt).to({alpha: 1},300,Phaser.Easing.Sinusoidal.InOut,true);

        }else {
            this.timer.resume();
            game.add.tween(this.board.numberGroup).to({alpha: 1},300,Phaser.Easing.Sinusoidal.InOut,true);
            game.add.tween(this.pauseTxt).to({alpha: 0},300,Phaser.Easing.Sinusoidal.InOut,true);
        }

        this.paused = !this.paused;
    },

    updateTimer: function() {
        this.timer.passed++;
        this.topButtons.timeTxt.updateTime(this.timer.passed);
        if (game.SETTINGS.timesUpGameOver) {
            if (this.timer.passed > this.category.starsReq[2]) {
                this.timesUp();
            }
        }
    },

    finishedLevel: function() {
        this.timer.stop();
        game.add.tween(this.toolbar).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true,200);
        game.add.tween(this.topButtons).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true,200);
        game.add.tween(this.board).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true,200);
        game.time.events.add(200,function() {new Griddlers.Window('win',this.timer.passed)},this);
    },

    timesUp: function() {
        this.timer.stop();
        new Griddlers.Window('gameOver');
    },

	resize: function() {

        if (game.device.desktop) {
            if (Griddlers.horizontalLayout) {
                this.bg.leftStripe.x = -220;
                this.bg.rightStripe.x = 910;
            }else {
                this.bg.leftStripe.x = 0;
                this.bg.rightStripe.x = 640+this.bg.leftStripe.width;
            }
        }

        this.world.children.forEach(function(child) {
            if (child.onResize) {
                child.onResize();
            }
        });

    }

};


Griddlers.MainMenu = function (game) {


};

Griddlers.MainMenu.prototype = {

	init: function(view,category,levelnr) {

		if (!game.sfx.music.isPlaying && !game.sound.mute) game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true);
	

		this.view = view || 0;
		this.lastCategory = category || false;
		this.lastLevelNr = levelnr || false;
	},

	create: function () {
	

		s = game.state.getCurrentState();

		this.bg = Griddlers.makeBackground();

		this.clouds = Griddlers.makeClouds();

		this.levels = Griddlers.makeLevelsGroup();

		this.categories = Griddlers.makeCategoryElements();
		
		this.logo = Griddlers.makeLogo();
		this.btnGroup = Griddlers.makeButtonGroup0();

		this.fader = Griddlers.makeFadeLayer();

		if (this.view == 1 || this.lastLevelNr == "TUTORIAL") {
				
				this.initCategoryView();
		}else if (this.view == 2) {
				
				this.initLevelView(this.lastCategory,this.lastLevelNr);
		}

		this.resize();


	},

	lockInputFor: function(ms) {
			game.input.enabled = false;
			game.canvas.style.cursor = "default";
			game.time.events.add(ms,function() {
				game.input.enabled = true;
			});

	},

	goToCategories: function(immediately) {
		this.view = 1;
		
		this.logo.hide(immediately);
		this.btnGroup.hide(immediately);
		this.backButton.show(immediately);
		this.soundButton.show(immediately);
		this.categories.show(immediately);
		this.moreGamesButtons.show(immediately)

		if (!immediately) {
			this.lockInputFor(1000)
			game.sfx.whoosh.play();
		};
	},

	goToBackLogoScreen: function(immediately) {
		this.view = 0;

		this.logo.show(immediately);
		this.btnGroup.show(immediately);
		this.backButton.hide(immediately);
		this.moreGamesButtons.hide(immediately);
		this.soundButton.hide(immediately);
		this.categories.hideRight(immediately);
		
		if (!immediately) {
			this.lockInputFor(1000)
			game.sfx.whoosh.play();
		};
	},

	goToLevels: function(cat,immediately,lastLevel) {
		this.view = 2;

		this.categories.hideLeft(immediately);
		this.levels.show(cat,immediately,lastLevel);

		if (!immediately) {
			this.lockInputFor(1000)
			game.sfx.whoosh.play();
		};

	},

	goBackToCategories: function(immediately) {
		this.view = 1;
		this.categories.show(immediately);
		this.levels.hide(immediately);

		if (!immediately) {
			this.lockInputFor(1000)
			game.sfx.whoosh.play();
		};
	},

	clickBackButton: function() {
		if (this.view == 1) {
			this.goToBackLogoScreen();
		}else if (this.view == 2) {
			this.goBackToCategories();
		}
	},

	startLevel: function(cat,nr) {
		this.fader.goToState('Game',cat,nr);
	},

	initLevelView: function(cat,lvlNr) {
		this.goToCategories(true);
		this.goToLevels(cat,true,lvlNr);
	},

	initCategoryView:function() {
		this.goToCategories(true);
	},

	resize: function() {
		
		this.world.children.forEach(function(child) {
			if (child.onResize) {
				child.onResize();
			}
		});

	}

};


Griddlers.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

Griddlers.Preloader.prototype = {

	preload: function () {

		game.ie10 = navigator.userAgent.indexOf("MSIE 10.0") > -1;
		this.resize();
		this.logo = this.add.button(70, 300, 'logoSoftgames',function() {
			//window.top.location = "http://m.softgames.de/";
		});
		this.preloadBarBg = this.add.sprite(70,500,'loadingbar_bg')
		this.preloadBar = this.add.sprite(82, 512, 'loadingbar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, the lines below won't work as the files themselves will 404, they are just an example of use.
		//this.load.image('titlepage', 'images/title.jpg');
		this.load.atlas('ssheet', 'images/spritesheet.png', 'images/spritesheet.json');
		this.load.atlas('miniaturessheet','images/miniaturesheet.png','images/miniaturesheet.json');
		//this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		this.load.bitmapFont('font', 'images/font.png', 'images/font.fnt');
		this.load.bitmapFont('font-blue', 'images/font-blue.png', 'images/font-blue.fnt');
		this.load.bitmapFont('font-blue-shadow', 'images/font-blue-shadow.png', 'images/font-blue-shadow.fnt');

		//	+ lots of other required assets here

		Object.keys(game.SETTINGS.boards).forEach(function(e) {
			var board = game.SETTINGS.boards[e];
			game.load.image(board.spriteName,'images/boards/'+board.spriteName+'.png');
			game.load.image(board.spriteName+'-hl','images/boards/'+board.spriteName+'-hl.png');
		});


    	
    	game.load.audio('p1_sfx','sfx/p1_sfx.mp3');
    	game.load.audio('p2_sfx','sfx/p2_sfx.mp3');
    	game.load.audio('alarm','sfx/alarm.mp3');
    	game.load.audio('p3_sfx','sfx/p3_sfx.mp3');
    	game.load.audio('p4_sfx','sfx/p4_sfx.mp3');
		game.load.audio('pop','sfx/pop.mp3');
		game.load.audio('transition','sfx/transition.mp3');
		game.load.audio('whoosh','sfx/whoosh.mp3');
		game.load.audio('win','sfx/win.mp3');
		game.load.audio('launch_ball','sfx/launch_ball.mp3');

		game.load.audio('charge_up4','sfx/charge_up4.mp3');
		game.load.audio('hit_1','sfx/hit_1.mp3');
		game.load.audio('hit_2','sfx/hit_2.mp3');
		game.load.audio('hit_3','sfx/hit_3.mp3');
		game.load.audio('lose','sfx/lose.mp3');
		game.load.audio('music_sfx','sfx/music_sfx.mp3');
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

		game.sfx = {};


		game.sfx.music = game.add.audio('music_sfx');
		
		game.sfx.hit_1 = game.add.audio('hit_1');
	
		game.sfx.hit_2 = game.add.audio('hit_2');
		
		game.sfx.hit_3 = game.add.audio('hit_3');
		game.sfx.chargeUp = game.add.audio('charge_up4');
		game.sfx.p1 = game.add.audio('p1_sfx');
		game.sfx.p1.volume = 0.6;
		game.sfx.p2 = game.add.audio('p2_sfx');
		game.sfx.p2.volume = 0.6;
		game.sfx.p3 = game.add.audio('p3_sfx');
		game.sfx.p3.volume = 0.6;
		game.sfx.p4 = game.add.audio('p4_sfx');
		game.sfx.p4.volume = 0.6;
		game.sfx.pop = game.add.audio('pop');
		game.sfx.transition = game.add.audio('transition');
		game.sfx.whoosh = game.add.audio('whoosh');
		game.sfx.win = game.add.audio('win');
		game.sfx.lose = game.add.audio('lose');
		game.sfx.launchBall = game.add.audio('launch_ball');
		game.sfx.launchBall.volume = 0.5;
		game.sfx.alarm = game.add.audio('alarm');
		game.sfx.alarm.volume = 0.5;


		for (var key in game.sfx) {
			if (game.sfx.hasOwnProperty(key)) {
				var sound = game.sfx[key];
				sound.playNorm = sound.play;
				sound.play = function() {
					if (!game.sound.mute) {
						this.playNorm.apply(this,arguments);
					}
				}
	        
			}
		}

		game.sfx.penSound = {
			index: 0,
			sounds: [game.sfx.p1,game.sfx.p2,game.sfx.p3,game.sfx.p4],
			play: function() {
				this.sounds[this.index].play();
				this.index = (this.index+1) % 4;
			}
		}

		game.sfx.hitSound = {
			index: 0,
			sounds: [game.sfx.hit_1,game.sfx.hit_2,game.sfx.hit_3],
			play: function() {
				this.sounds[this.index].play();
				this.index = (this.index+1) % 3;
			}
		}

		if (!game.sound.mute) {game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true)};

	},

	resize: function() {
		if (game.device.desktop) {
			var worldBounds = game.world.bounds;
			game.world.setBounds(Math.ceil((worldBounds.width-640)*-0.5),0,worldBounds.width,worldBounds.height);
		}
	},

	update: function () {

		if (this.cache.isSoundDecoded('music_sfx')) {
			SG_Hooks.start();
			this.state.start('MainMenu');
		}

	}

};


Griddlers.Tutorial = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

Griddlers.Tutorial.prototype = {

    init: function() {
        this.levelNr = 'TUTORIAL';
    },

	create: function () {

        this.timer = game.time.create(false);
        this.timer.passed = 0;

        this.onWindowOpened = new Phaser.Signal();
        this.onWindowClosed = new Phaser.Signal();
        this.onModeChange = new Phaser.Signal();

		s = game.state.getCurrentState();

        Griddlers.saveState.setControll(true);
        this.tapControll = true;

        this.bg = Griddlers.makeBackground();
        this.clouds = Griddlers.makeClouds();

        this.topButtons = Griddlers.makeGameButtons(true);
        
        this.topButtons.tapControll.onResize = function() {};
        this.topButtons.tapControll.inputEnabled = false;
        this.topButtons.tapControll.alpha = 0.5;
        this.topButtons.pauseButton.inputEnabled = false;
        this.topButtons.pauseButton.alpha = 0.5;
        this.topButtons.timeTxt.visible =  false;

        this.toolbar = new Griddlers.ToolBar(undefined,true);

        this.tutorialStep1();

        this.fader = Griddlers.makeFadeLayer();

        this.resize();

        
	},

    goBackToMenu: function() {
        this.fader.goToState('MainMenu',1,false,this.levelNr);
    },

	resize: function() {

        if (game.device.desktop) {
            if (Griddlers.horizontalLayout) {
                this.bg.leftStripe.x = -220;
                this.bg.rightStripe.x = 910;
            }else {
                this.bg.leftStripe.x = 0;
                this.bg.rightStripe.x = 640+this.bg.leftStripe.width;
            }
        }

        this.world.children.forEach(function(child) {
            if (child.onResize) {
                child.onResize();
            }
        });

    },

    tutorialStep1: function() {

        //WELCOME

        this.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep1'),30,600,140,'center');
        Griddlers.utils.addPYUpdate(this.tutorialText,0.1875);

        game.add.existing(this.tutorialText);

        this.board = new Griddlers.Board(game.LEVELS[0].levels[0]);
        this.board.onResize = function() {};
        this.board.scale.setTo(1.1);
        this.board.lockInput = true;
        this.board.x = 180;
        Griddlers.utils.addPYUpdate(this.board,0.5125);
        this.board.toolbar = this.toolbar;
        this.toolbar.board = this.board;
        this.toolbar.inputLock = true;
        this.toolbar.hiding = true;

        this.nextButton = new Griddlers.Button(580,0,'griddlers-play',function() {
            this.tutorialStep2();
            this.nextButton.inputEnabled = false;
        },this);
        game.add.existing(this.nextButton);
        Griddlers.utils.addPYUpdate(this.nextButton,0.92);
    },

    tutorialStep2: function() {

        //NUMBERS ABOVE AND ON THE LEFT

        game.add.tween(this.tutorialText).to({alpha:0},500,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.destroy();
        },this.tutorialText);

        this.tutGroup = game.add.group();

        this.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep2'),30,600,140,'center');
        game.add.existing(this.tutorialText);
        game.add.tween(this.tutorialText).from({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true);
        this.nextButton.onClick.removeAll();
        game.time.events.add(500,function() {this.inputEnabled=true;this.input.useHandCursor = true},this.nextButton);
        this.nextButton.onClick.add(function() {
            this.nextButton.inputEnabled = false;
            this.tutorialStep3();
        },this);

        this.hand = game.add.image(this.board.x,this.board.y,'ssheet','tuthand');
        this.hand.board = this.board;
        this.hand.oX = 0;
        this.hand.oY = 0;
        game.add.tween(this.hand).from({alpha:0},500,Phaser.Easing.Sinusoidal.InOut,true);
        this.hand.update = function() {
            this.x = this.board.x+this.oX;
            this.y = this.board.y+this.oY;
        };
        this.hand.startHorizontal = function() {
            game.add.tween(this).to({oX:300},1200,Phaser.Easing.Sinusoidal.InOut,true,0,0,true).onComplete.add(this.startVertical,this);
        }
        this.hand.startVertical = function() {
            game.add.tween(this).to({oY:300},1200,Phaser.Easing.Sinusoidal.InOut,true,0,0,true).onComplete.add(this.startHorizontal,this);
        }

        this.hand.startHorizontal();
        

        this.tutGroup.addMultiple([this.board,this.tutorialText,this.nextButton,this.hand]);

        game.world.bringToTop(this.fader);
    },

    tutorialStep3: function() {

        //MARKING

        game.add.tween(this.tutGroup).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.destroy();
        },this.tutGroup);
        
        this.tutGroup = game.add.group();


        this.board = new Griddlers.Board({
            "type":"5x5",
            "data":[[1],[1],[1],[1],[1]],
            noVerticalStripes: true,
            inputMask:[[1],[1],[1],[1],[1]],
            boardObj: {
                "spriteName" : "griddlers-board-tut5",
                "size" : [5,1],
                "leftMargin" : 7,
                "topMargin" : 8,
                "sizeOfCell" : 57,
                "fontSize" : 30
            }

        });
        this.board.onResize = function() {};
        this.board.onBoardClear.add(this.tutorialStep4,this);
        this.board.scale.setTo(1.1);
        this.board.x = 180;
        this.board.toolbar = this.toolbar;
        this.toolbar.board = this.board;
        this.toolbar.inputLock = true;
        this.toolbar.hiding = false;
        this.toolbar.pY = 0.87;

        this.hand = game.add.image(this.board.x+20,this.board.y,'ssheet','tuthand');
        this.hand.board = this.board;
        this.hand.update = function() {
            this.board.y = game.height*0.5125;
            this.y = this.board.y + 50;
        };
        game.add.tween(this.hand).to({x:this.board.x+300},1500,Phaser.Easing.Sinusoidal.In,true,0,-1,false);

        this.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep3'),30,600,140,'center');
        game.add.existing(this.tutorialText);
        
        this.tutGroup.addMultiple([this.board,this.hand,this.tutorialText]);
        game.add.tween(this.tutGroup).from({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true);
        game.add.tween(this.toolbar).from({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true);

        game.world.bringToTop(this.fader);

    },

    tutorialStep4: function() {
        
        //GROUPS

        game.add.tween(this.tutGroup).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.destroy();
        },this.tutGroup);

        this.tutGroup = game.add.group();


        this.board = new Griddlers.Board({
            "type":"5x5",
            "data":[[1],[1],[1],[0],[1]],
            noVerticalStripes: true,
            inputMask:[[1],[1],[1],['n'],[1]],
            boardObj: {
                "spriteName" : "griddlers-board-tut5",
                "size" : [5,1],
                "leftMargin" : 7,
                "topMargin" : 8,
                "sizeOfCell" : 57,
                "fontSize" : 30
            }

        });


        this.board.onResize = function() {this.y = game.height*0.56};
        this.board.onResize();
        this.board.lockInput = true;
        game.time.events.add(2000,function() {
            this.lockInput = false;
        },this.board)
        this.board.onBoardClear.add(this.tutorialStep5,this);
        this.board.scale.setTo(1.1);
        this.board.x = 180;
        this.board.toolbar = this.toolbar;
        this.toolbar.board = this.board;
        this.toolbar.inputLock = true;
        this.toolbar.hiding = false;
        this.toolbar.pY = 0.87;

        this.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep4'),30,600,200,'center');
        game.add.existing(this.tutorialText);
        
        this.tutGroup.addMultiple([this.board,this.tutorialText]);
        game.add.tween(this.tutGroup).from({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true,500);

        game.world.bringToTop(this.fader);


    },

    tutorialStep5: function() {
        //X

        game.add.tween(this.tutGroup).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.destroy();
        },this.tutGroup);

        this.tutGroup = game.add.group();

        this.board = new Griddlers.Board({
            "type":"5x5",
            "data":[[1],[0],[0],[0],[1],[0],[1],[0],[0],[0]],
            inputMask:[['n'],['n'],['n'],['x'],['n'],['x'],['n'],['x'],['n'],['n']],
            noVerticalStripes: true,
            boardObj: {
                "spriteName" : "griddlers-board-tut10",
                "size" : [10,1],
                "leftMargin" : 7,
                "topMargin" : 6,
                "sizeOfCell" : 38.6,
                "fontSize" : 25
            }

        });
        this.board.marksLayer.drawOnBitmap(4,0,'1');
        this.board.marksLayer.drawOnBitmap(6,0,'1');
        this.board.onResize = function() {this.y = game.height*0.56};
        this.board.onResize();
        var standardChangeCell = this.board.changeCell;
        this.board.changeCell = function(cellX,cellY,value) {
            standardChangeCell.call(this,cellX,cellY,value);
            if (this.grid.data[3][0] == 'x' && this.grid.data[5][0] == 'x' && this.grid.data[7][0] == 'x') {
                this.onBoardClear.dispatch();
                this.onBoardClear.removeAll();
                this.changeCell = function() {};
            }         

        }
        this.board.lockInput = true;
        game.time.events.add(2000,function() {
            this.lockInput = false;
        },this.board);
        this.board.onBoardClear.add(this.tutorialStep5b,this);
        this.board.scale.setTo(1.1);
        this.board.x = 140;
        this.board.toolbar = this.toolbar;
        this.toolbar.board = this.board;
        this.toolbar.inputLock = false;
        this.toolbar.buttons.children.forEach(function(e,i) {
            if (i >= 2) {
                e.inputEnabled = false;
            }
            if (i == 1) {
                e.onClick.addOnce(function() {
                    game.add.tween(this.hand).to({alpha:0},500,Phaser.Easing.Sinusoidal.InOut,true);
                },this)
            }
        },this);
        this.toolbar.hiding = false;
        this.toolbar.pY = 0.87;

        this.hand = game.add.image(this.toolbar.x+130,this.toolbar.y+50,'ssheet','tuthand');
        this.hand.toolbar = this.toolbar;
        this.hand.oY = 0;
        this.hand.oX = 0;
        this.hand.update = function() {
            this.y = this.toolbar.y+50+this.oY;
            this.x = this.toolbar.x+130+this.oX;
        };
        game.add.tween(this.hand).to({oX:20,oY:20},500,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);


        this.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep5'),30,600,200,'center');
        game.add.existing(this.tutorialText);
        
        this.tutGroup.addMultiple([this.board,this.tutorialText,this.hand]);
        game.add.tween(this.tutGroup).from({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true,500);

        game.world.bringToTop(this.fader);



    },

    tutorialStep5b: function() {
        //ERASER
        game.add.tween(this.tutGroup).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.destroy();
        },this.tutGroup);

        this.tutGroup = game.add.group();

        this.board = new Griddlers.Board({
            "type":"5x5",
            "data":[[1],[1],[0],[0],[1]],
            noVerticalStripes: true,
            inputMask:[['n'],['n'],['0'],['0'],['0']],
            boardObj: {
                "spriteName" : "griddlers-board-tut5",
                "size" : [5,1],
                "leftMargin" : 7,
                "topMargin" : 8,
                "sizeOfCell" : 57,
                "fontSize" : 30
            }

        });
        this.board.marksLayer.drawOnBitmap(2,0,'x');
        this.board.marksLayer.drawOnBitmap(3,0,'x');
        this.board.marksLayer.drawOnBitmap(4,0,'x');
        this.board.checkStripeNumbers = function() {};
        this.board.grid.data[2][0] = 'x';
        this.board.grid.data[3][0] = 'x';
        this.board.grid.data[4][0] = 'x';
        this.board.onResize = function() {this.y = game.height*0.5125};
        this.board.onResize();
        var standardChangeCell = this.board.changeCell;
        this.board.changeCell = function(cellX,cellY,value) {
            standardChangeCell.call(this,cellX,cellY,value);
            if (this.grid.data[2][0] == '0' && this.grid.data[3][0] == '0' && this.grid.data[4][0] == '0') {
                
                this.changeCell = function(){};
                //restore hand
                game.add.tween(this.state.hand).to({alpha:1},500,Phaser.Easing.Sinusoidal.InOut,true);
                this.state.hand.update = function() {
                    this.y = this.toolbar.y+50+this.oY;
                    this.x = this.toolbar.x+280+this.oX;
                };

                //change input mask
                this.inputMask[2][0] = 'x';
                this.inputMask[3][0] = 'x';
                this.inputMask[4][0] = 'x';

                //change text
                game.add.tween(this.state.tutorialText).to({alpha:0},500,Phaser.Easing.Sinusoidal.InOut,true);
                this.state.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep5Undo'),30,600,140,'center');
                this.state.tutGroup.add(this.state.tutorialText);
                game.add.tween(this.state.tutorialText).from({alpha:0},500,Phaser.Easing.Sinusoidal.InOut,true);

                //change toolbar settings
                this.state.toolbar.buttons.children.forEach(function(e,i) {
                    if (i != 3) {
                        e.inputEnabled = false;
                    }
                    if (i == 3) {
                        e.inputEnabled = true;
                        e.input.useHandCursor = true;
                        e.onClick.addOnce(function() {
                            game.add.tween(this.hand).to({alpha:0},500,Phaser.Easing.Sinusoidal.InOut,true);
                            game.time.events.add(800,function() {
                                this.tutorialStep6();
                            },this);
                        },this)
                    }
                },this.state);


            }
        }
        this.board.lockInput = true;
        game.time.events.add(2000,function() {
            this.lockInput = false;
        },this.board);
        this.board.scale.setTo(1.1);
        this.board.x = 140;
        this.board.toolbar = this.toolbar;
        this.toolbar.board = this.board;
        this.toolbar.inputLock = false;

        this.toolbar.buttons.children.forEach(function(e,i) {
            if (i != 2) {
                e.inputEnabled = false;
            }
            if (i == 2) {
                e.inputEnabled = true;
                e.input.useHandCursor = true;
                e.onClick.addOnce(function() {
                    game.add.tween(this.hand).to({alpha:0},500,Phaser.Easing.Sinusoidal.InOut,true);
                },this)
            }
        },this);
        this.toolbar.hiding = false;
        this.toolbar.pY = 0.87;

        this.hand = game.add.image(this.toolbar.x+210,this.toolbar.y+50,'ssheet','tuthand');
        this.hand.toolbar = this.toolbar;
        this.hand.oY = 0;
        this.hand.oX = 0;
        this.hand.update = function() {
            this.y = this.toolbar.y+50+this.oY;
            this.x = this.toolbar.x+210+this.oX;
        };
        game.add.tween(this.hand).to({oX:20,oY:20},500,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);


        this.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep5Eraser'),30,600,140,'center');
        game.add.existing(this.tutorialText);
        
        this.tutGroup.addMultiple([this.board,this.tutorialText,this.hand]);
        game.add.tween(this.tutGroup).from({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true,500);

        game.world.bringToTop(this.fader);




    },

    tutorialStep6: function() {
        //"TRY TO SOLVE"
        console.log("tutorialStep6");

        game.add.tween(this.tutGroup).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.destroy();
        },this.tutGroup);

        this.tutGroup = game.add.group();


        this.board = new Griddlers.Board({
            "type":"5x5",
            "data":[[1,0,1],[1,1,0],[1,0,1]],
            boardObj: {
                "spriteName" : "griddlers-board-tut3x3",
                "size" : [3,3],
                "leftMargin" : 8,
                "topMargin" : 8,
                "sizeOfCell" : 61.3333,
                "fontSize" : 40
            }

        });

        this.toolbar.buttons.children[2].inputEnabled = true;
        this.toolbar.buttons.children[3].inputEnabled = true;

        this.board.onResize = function() {this.y = game.height*0.475};
        this.board.onResize();
        this.board.lockInput = true;
        game.time.events.add(2000,function() {
            this.lockInput = false;
        },this.board)
        this.board.onBoardClear.add(this.tutorialStep7,this);
        this.board.scale.setTo(1.1);
        this.board.x = 230;
        this.board.toolbar = this.toolbar;
        this.toolbar.board = this.board;
        this.toolbar.hiding = false;
        this.toolbar.pY = 0.87;

        this.toolbar.buttons.children.forEach(function(e,i) {
            if (i == 4) {
                e.inputEnabled = false;
            }
            else {
                e.inputEnabled = true;
                e.input.useHandCursor = true;
            }
        },this);

        this.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep6'),30,600,140,'center');
        game.add.existing(this.tutorialText);
        
        this.tutGroup.addMultiple([this.board,this.tutorialText]);
        game.add.tween(this.tutGroup).from({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true,0);

        game.world.bringToTop(this.fader);


    },

    tutorialStep7: function() {
        //"TRY TO SOLVE"

        game.add.tween(this.tutGroup).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.destroy();
        },this.tutGroup);

        this.tutGroup = game.add.group();


        this.board = new Griddlers.Board(game.LEVELS[0].levels[0]);

        this.toolbar.buttons.children[2].inputEnabled = true;
        this.toolbar.buttons.children[3].inputEnabled = true;

        this.board.onResize = function() {this.y = game.height*0.39};
        this.board.onResize();
        this.board.lockInput = true;
        game.time.events.add(2000,function() {
            this.lockInput = false;
        },this.board);

        this.board.showHint = function() {          
            this.waitingInHint = true;
            game.sfx.chargeUp.play();
            game.add.tween(this.state.hand).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true);
        };
        var standardPerformHint = this.board.performHint;
        this.board.performHint = function(x,y) {
            game.time.events.add(1000,function() {
                this.tutorialStep8();
            },this.state);
            standardPerformHint.call(this,x,y);
            this.changeCell= function() {};
        };
        this.board.scale.setTo(1.1);
        this.board.x = 180;
        this.board.toolbar = this.toolbar;
        this.toolbar.board = this.board;
        this.toolbar.hiding = false;
        this.toolbar.pY = 0.87;
        this.toolbar.selectedTool = '0';

        this.toolbar.buttons.children.forEach(function(e,i) {
            if (i != 4) {
                e.inputEnabled = false;
            }
            else {
                e.inputEnabled = true;
                e.input.useHandCursor = true;
                e.onClick.add(function() {this.inputEnabled = false},e);

            }
        },this);

        this.hand = game.add.image(this.toolbar.x+210,this.toolbar.y+50,'ssheet','tuthand');
        this.hand.toolbar = this.toolbar;
        this.hand.oY = 0;
        this.hand.oX = 0;
        this.hand.update = function() {
            this.y = this.toolbar.y+50+this.oY;
            this.x = this.toolbar.x+370+this.oX;
        };
        game.add.tween(this.hand).from({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true);
        game.add.tween(this.hand).to({oX:20,oY:20},500,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);

        this.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep7'),30,600,70,'center');
        game.add.existing(this.tutorialText);
        
        this.tutGroup.addMultiple([this.board,this.tutorialText,this.hand]);
        game.add.tween(this.tutGroup).from({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true,500);

        game.world.bringToTop(this.fader);


    },

    tutorialStep8: function() {

        game.add.tween(this.tutGroup).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.destroy();
        },this.tutGroup);

        this.topButtons.tapControll.inputEnabled = false;
        game.add.tween(this.topButtons.tapControll).to({alpha: 1},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.inputEnabled = true;
            this.input.useHandCursor = true;
        },this.topButtons.tapControll);


        this.topButtons.tapControll.onClick.addOnce(function() {
            this.inputEnabled = false;
            game.add.tween(this.state.hand).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true);

            game.add.tween(this.state.tutorialText).to({alpha:0},500,Phaser.Easing.Sinusoidal.InOut,true);
            this.state.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep8b'),30,600,140,'center');
            this.state.tutGroup.add(this.state.tutorialText);
            game.add.tween(this.state.tutorialText).from({alpha:0},500,Phaser.Easing.Sinusoidal.InOut,true);




        },this.topButtons.tapControll);


        this.hand = game.add.image(this.toolbar.x+130,this.toolbar.y+50,'ssheet','tuthand');
        this.hand.topButtons = this.topButtons;
        this.hand.oY = 0;
        this.hand.oX = 0;
        this.hand.scale.setTo(0.6);
        this.hand.update = function() {
            this.y = this.topButtons.y+this.oY;
            this.x = this.topButtons.tapControll.x+this.oX;
        };
        game.add.tween(this.hand).to({oX:20,oY:20},500,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);

        this.tutGroup = game.add.group();

        this.board = new Griddlers.Board({
            "type":"5x5",
            "data":[[1,0,1],[0,0,0],[1,0,1]],
            "inputMask":[['1','n','1'],['n','n','n'],['1','n','1']],
            boardObj: {
                "spriteName" : "griddlers-board-tut3x3",
                "size" : [3,3],
                "leftMargin" : 8,
                "topMargin" : 8,
                "sizeOfCell" : 61.3333,
                "fontSize" : 40
            }

        });

        this.board.onResize = function() {this.y = game.height*0.52};
        this.board.onResize();
        this.board.lockInput = true;
        game.time.events.add(2000,function() {
            this.lockInput = false;
        },this.board)
        this.board.onBoardClear.add(this.tutorialStepGoodluck,this);
        this.board.scale.setTo(1.1);
        this.board.x = 230;
        this.board.toolbar = this.toolbar;
        this.toolbar.board = this.board;
        this.toolbar.hiding = false;
        this.toolbar.pY = 0.87;

        this.toolbar.buttons.children.forEach(function(e,i) {
            if (i == 4) {
                e.inputEnabled = false;
            }
            else {
                e.inputEnabled = true;
                e.input.useHandCursor = true;
            }
        },this);

        this.tutorialText = new Griddlers.MultiLineText(320,140,'font-blue',game.getTxt('TutorialStep8'),30,600,140,'center');
        game.add.existing(this.tutorialText);
        
        this.tutGroup.addMultiple([this.board,this.tutorialText,this.hand]);
        game.add.tween(this.tutGroup).from({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true,0);

        game.world.bringToTop(this.fader);

    },

    tutorialStepGoodluck: function() {
        //END GOOD LUCK!
        Griddlers.saveState.setControll(!s.tapControll);

         game.add.tween(this.tutGroup).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.destroy();
        },this.tutGroup);
         game.add.tween(this.toolbar).to({alpha:0},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
            this.hiding = true;
            this.onResize();
         },this.toolbar);



         this.tutGroup = game.add.group();

         this.tutorialText = new Griddlers.MultiLineText(320,260,'font-blue',game.getTxt('tutorialStepGoodluck'),30,600,80,'center');
         this.tutorialText2 = new Griddlers.OneLineText(320,400,'font-blue',game.getTxt('Good luck!'),60,600);
         this.tutorialText2.anchor.setTo(0.5);
         game.add.existing(this.tutorialText);


        this.hand = game.add.image(this.toolbar.x+130,this.toolbar.y+50,'ssheet','tuthand');
        this.hand.topButtons = this.topButtons;
        this.hand.oY = 0;
        this.hand.oX = 0;
        this.hand.scale.setTo(0.6);
        this.hand.update = function() {
            this.y = this.topButtons.y+this.oY;
            this.x = this.topButtons.back.x+this.oX;
        };
        game.add.tween(this.hand).to({oX:20,oY:20},500,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);

        this.tutGroup.addMultiple([this.tutorialText,this.tutorialText2,this.hand]);

        game.add.tween(this.tutGroup).from({alpha: 0},1000,Phaser.Easing.Sinusoidal.Inout,true);
        game.world.bringToTop(this.fader);
    }

};

Griddlers.Board = function(level) {

	this.state = game.state.getCurrentState();

	this.onBoardClear = new Phaser.Signal();

	Phaser.Group.call(this, game);
	this.x = 320;
	this.y = 300; 
	this.level = level;
	this.board = level.boardObj || game.SETTINGS.boards[level.type];

	this.particlesEmitter = game.add.emitter(0,0,20);
  	this.particlesEmitter.makeParticles('ssheet','particles-red-star');
	this.particlesEmitter.setSize(0,0);
  	this.particlesEmitter.setXSpeed(-500, 500);
  	this.particlesEmitter.setYSpeed(-500, 100);
  	this.particlesEmitter.gravity = 1000;
  	this.particlesEmitter.setRotation(-30,30);
  	this.particlesEmitter.setScale(1, 1, 1, 1,0);
  	this.particlesEmitter.setAlpha(1,0,2000);
  	this.particlesEmitter.fixedToCamera = true;

	//inputMask for tutorials
	this.inputMask = level.inputMask || false;
	this.penalties = game.SETTINGS.penalties;
	this.inputBlockMap = Griddlers.utils.makeArrayGrid(level.data.length,level.data[0].length,false);
	this.penaltyIndex = 0;

	this.waitingInHint = false;

	this.grid = this.makeGridObject(level);
	this.rows = [];
	this.collumns = [];

	this.gridCache = game.make.group();
	this.add(this.gridCache);
	
	this.makeStripes();
	this.tapMode = Griddlers.saveState.isTapControll();

	this.gridBg = level.boardObj ? game.make.image(0,0,'ssheet',level.boardObj.spriteName) : game.make.image(0,0,game.SETTINGS.boards[level.type].spriteName);

	this.board.pxBgWidth = this.gridBg.width;
	this.board.pxBgHeight = this.gridBg.height;
	this.gridCache.add(this.gridBg);
	this.gridCache.cacheAsBitmap = true;
	this.board.pxWholeWidth = this.width;
	this.board.pxWholeHeight = this.height;
	this.gridCache.removeAll();
	
	this.numberGroup = game.make.group();

	this.rows.concat(this.collumns).forEach(function(ar) {
		this.numberGroup.addMultiple(ar);
	},this);

	this.add(this.numberGroup);

	this.marksLayer = new Griddlers.MarksLayer(this.board,this.grid.data,this.inputBlockMap);
	this.add(this.marksLayer);

	if (!level.boardObj) {
		this.addHlBorder(level);
	}
	

	this.penaltyTxt = game.add.group();

	
	this.state.onModeChange.add(function() {
		this.tapMode = Griddlers.saveState.isTapControll();
	},this);

	this.lockInput = false;

	game.input.onDown.add(function(pointer) {
		if (this.lockInput || this.state.paused) return;
		if (Griddlers.saveState.isTapControll()) {
			var cell = this.pointerToCell(game.input.activePointer);
			var cellX = cell[0];
			var cellY = cell[1];
			if (cellX >= 0 && cellX < this.board.size[0]
				&& cellY >= 0 && cellY < this.board.size[1]) {
				this.tap(cellX,cellY);
			}
		}else {
			this.onInputDownPosition = [pointer.x,pointer.y];
		}
	},this);


	this.state.onWindowOpened.add(function() {
		this.lockInput = true;
		game.add.tween(this.numberGroup).to({alpha:0},500,Phaser.Easing.Sinusoidal.Out,true);
	},this);
	this.state.onWindowClosed.add(function() {
		this.lockInput = false;
		game.add.tween(this.numberGroup).to({alpha:1},500,Phaser.Easing.Sinusoidal.In,true);
	},this);
	
};

Griddlers.Board.prototype = Object.create(Phaser.Group.prototype);
Griddlers.Board.constructor = Griddlers.Board;

Griddlers.Board.prototype.onResize = function() {

	if (Griddlers.horizontalLayout) {

		var scale = 750/this.board.pxWholeHeight;
		if (this.board.pxWholeWidth*scale > 750) {
			scale = 750/this.board.pxWholeWidth;
		}
		this.scale.setTo(scale);

		this.x = 320;
		this.y = Math.floor(game.height*0.48);

		var xOffset = 0.5 - (this.board.pxWholeWidth-this.board.pxBgWidth)/this.board.pxWholeWidth;
		var yOffset = 0.5 - (this.board.pxWholeHeight-this.board.pxBgHeight)/this.board.pxWholeHeight;
		this.x -= xOffset*(this.board.pxWholeWidth*this.scale.x)+150;
		this.y -= yOffset*(this.board.pxWholeHeight*this.scale.y);


	}else {

		var scale = (0.65 * game.height)/this.board.pxWholeHeight;
		if (this.board.pxWholeWidth*scale > 620) {
			scale = 620/this.board.pxWholeWidth;
		}
		this.scale.setTo(scale);
		this.x = 320;
		this.y = Math.floor(game.height*0.48);
		var xOffset = 0.5 - (this.board.pxWholeWidth-this.board.pxBgWidth)/this.board.pxWholeWidth;
		var yOffset = 0.5 - (this.board.pxWholeHeight-this.board.pxBgHeight)/this.board.pxWholeHeight;
		this.x -= xOffset*(this.board.pxWholeWidth*this.scale.x);
		this.y -= yOffset*(this.board.pxWholeHeight*this.scale.y);

	}

	this.particlesEmitter.setScale(this.scale.x, this.scale.x, this.scale.x, this.scale.x,0);

};

Griddlers.Board.prototype.pointerToCell = function(pointer) {
	return [
		Math.floor((pointer.worldX-(this.x+(this.board.leftMargin*this.scale.x)))/(this.board.sizeOfCell*this.scale.x)),
		Math.floor((pointer.worldY-(this.y+(this.board.topMargin*this.scale.y)))/(this.board.sizeOfCell*this.scale.y))
	]
};

Griddlers.Board.prototype.addHlBorder = function(level) {

	var boardSpriteName = game.SETTINGS.boards[level.type].spriteName;
	var xoffset = (game.cache.getFrame(boardSpriteName).width-game.cache.getFrame(boardSpriteName+'-hl').width)*0.5;
	var yoffset = (game.cache.getFrame(boardSpriteName).height-game.cache.getFrame(boardSpriteName+'-hl').height)*0.5;
	this.boardHl = game.make.image(xoffset,yoffset,game.SETTINGS.boards[level.type].spriteName+'-hl');
	this.boardHl.alpha = 0;
	this.add(this.boardHl);
	this.boardHl.alphaMulti = 0;
	this.boardHl.alphaPulse = 0.7;
	game.add.tween(this.boardHl).to({alphaPulse: 1},500,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);

};

Griddlers.Board.prototype.update = function() {
	
	this.penaltyInputLock--;

	if (this.boardHl) {
		this.boardHl.alpha = this.boardHl.alphaMulti*this.boardHl.alphaPulse;
		this.boardHl.alphaMulti += this.waitingInHint ? 0.03 : -0.03;
		this.boardHl.alphaMulti = game.math.clamp(this.boardHl.alphaMulti,0,1);	
	}

	if (this.lockInput || this.state.paused) return;

	if (this.tapMode) {

		if (game.input.activePointer.isDown) {
			var cell = this.pointerToCell(game.input.activePointer);
			var cellX = cell[0];
			var cellY = cell[1];
			if (cellX >= 0 && cellX < this.board.size[0]
				&& cellY >= 0 && cellY < this.board.size[1]) {
				this.tap(cellX,cellY);
			}

		}

	}else {

		if (game.input.activePointer.isDown && this.onInputDownPosition) {
		var difX = game.input.activePointer.x - this.onInputDownPosition[0];
		var difY = game.input.activePointer.y - this.onInputDownPosition[1];
		var moveX = 0;
		var moveY = 0;
		if (Math.abs(difX) > game.SETTINGS.slideSensitivity || Math.abs(difY) > game.SETTINGS.slideSensitivity) {
			if (Math.abs(difX) > game.SETTINGS.slideSensitivity) {
				this.onInputDownPosition[0] = game.input.activePointer.x;
				moveX = Math.sign(difX);
			}
			if (Math.abs(difY) > game.SETTINGS.slideSensitivity) {
				this.onInputDownPosition[1] = game.input.activePointer.y;
				moveY = Math.sign(difY)
			}
			this.marksLayer.moveSlider(moveX,moveY);
		}
		}else {
			this.onInputDownPosition = false;
		}

	}

}

Griddlers.Board.prototype.tap = function(cellX,cellY) {

	/*

	TAPNIECIOWE

	var oldValue = this.grid.getCell(cellX,cellY);
	var newValue = oldValue == "0" ? "1" : oldValue == "1" ? 'x' : '0';
	this.changeCell(cellX,cellY,newValue);

	*/

	this.changeCell(cellX,cellY,this.toolbar.selectedTool);
};

Griddlers.Board.prototype.performHint = function(x,y) {

	game.sfx.launchBall.play();

	this.grid.data.forEach(function(val,coll,a) {
		var valueToPut = this.level.data[coll][y] == '1' ? '1' : 'x';
		a[coll][y] = valueToPut;
		this.inputBlockMap[coll][y] = 'h';
	},this);

	this.grid.data[x].forEach(function(val,row,a) {
		var valueToPut = this.level.data[x][row] == '1' ? '1' : 'x';
		a[row] = valueToPut;
		this.inputBlockMap[x][row] = 'h';
	},this);

	if (!this.level.noVerticalStripes) {
		this.level.data.forEach(function(e,i) {
			this.checkStripeNumbers(this.collumns[i],this.getCollumnData(i));
		},this);
	} 
	if (!this.level.noHorizontalStripes) {
		this.level.data[0].forEach(function(e,i) {
			this.checkStripeNumbers(this.rows[i],this.getRowData(i));
		},this)	
	}

	if (this.checkWin()) {
		this.onBoardClear.dispatch();
		this.changeCell = function() {};
	}

	this.marksLayer.redrawBitmap();
	this.state.fader.blink();
}

Griddlers.Board.prototype.performPenalty = function(cellX,cellY) {

	if (this.state.levelNr == "TUTORIAL") {
		if (!game.sfx.alarm.isPlaying) {
			game.sfx.alarm.play();
		}	
		return;
	}

	game.sfx.alarm.play();
	this.penaltyInputLock = 40;
	this.inputBlockMap[cellX][cellY] = 'p';
	this.state.timer.passed += game.SETTINGS.penaltiesTime[this.penaltyIndex];
	this.state.topButtons.timeTxt.updateTime(this.state.timer.passed);
	
	this.grid.setCell(cellX,cellY,this.level.data[cellX][cellY] == 1 ? '1' : 'x',true);
	this.marksLayer.redrawBitmap();
	this.checkStripesAndWin(cellX,cellY);
	this.particlesEmitter.emitX = game.input.activePointer.worldX;
	this.particlesEmitter.emitY = game.input.activePointer.worldY;
	this.particlesEmitter.explode(2000,10);
	this.state.fader.blink();

	var bitmapText = game.add.bitmapText(game.input.activePointer.worldX,game.input.activePointer.worldY,'font','+'+game.SETTINGS.penaltiesTime[this.penaltyIndex]+' sec',60);
	bitmapText.tint = 0xFF0000;
	bitmapText.cacheAsBitmap = true;
	bitmapText._cachedSprite.anchor.setTo(0.5);
	this.penaltyTxt.add(bitmapText);
	game.add.tween(bitmapText).to({y: bitmapText.y-150, alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
		this.destroy();
	},bitmapText);

	this.penaltyIndex = Math.min(this.penaltyIndex+1,game.SETTINGS.penaltiesTime.length-1);

};

Griddlers.Board.prototype.changeCell = function(cellX,cellY,value) {

	if (this.penaltyInputLock > 0) return;
	// HINTS
	if (this.waitingInHint && this.inputBlockMap[cellX][cellY] !== 'h') {
		this.performHint(cellX,cellY);
		this.waitingInHint = false;
		return;
	}

	var oldValue = this.grid.getCell(cellX,cellY);
	if (oldValue == 'xx') return;

	//cannot change other types
	if (value != '0' && this.grid.getCell(cellX,cellY) != '0') return;

	//checkInputMask
	if (this.inputMask) {
		if (this.inputMask[cellX][cellY] == "n") return;
		if (this.inputMask[cellX][cellY] != value) return;
	}

	if (this.inputBlockMap[cellX][cellY]) {
		return;
	}

	if (value == '1' && this.penalties && this.level.data[cellX][cellY] != 1) {
		this.performPenalty(cellX,cellY);
		return;
	}

	if (this.grid.setCell(cellX,cellY,value)) {
		if (value == 1) {
			game.sfx.penSound.play();
		}
		if (value == 'x') {
			game.sfx.hitSound.play();
		}
		this.marksLayer.initAnimation(cellX,cellY,oldValue,value);
		this.toolbar.btn4.alpha = this.grid.undoArray.length > 0 ? 1 : 0.5;
		this.checkStripesAndWin(cellX,cellY);
		return true;
	}else {
		return false;
	}
};

Griddlers.Board.prototype.undo = function() {

	var result = this.grid.undo();
	if (result) {
		this.marksLayer.initAnimation(result[0],result[1],result[2],result[3]);
		this.toolbar.btn4.alpha = this.grid.undoArray.length > 0 ? 1 : 0.5;
		this.checkStripeNumbers(this.collumns[result[0]],this.getCollumnData(result[0]));
		this.checkStripeNumbers(this.rows[result[1]],this.getRowData(result[1]));
	}

}

Griddlers.Board.prototype.makeGridObject = function(level) {
	var grid = {

		xRow: function(nr) {
			this.data.forEach(function(collumn) {
				collumn[nr] = 'x';
			})
		},

		xCollumn: function(nr) {
			this.data[nr].forEach(function(e,index,array) {
				array[index] = 'x';
			});
		},

		getCell: function(x,y) {
			return this.data[x][y];
		},

		setCell: function(x,y,value,noUndo) {
			var oldValue = this.getCell(x,y);
			if (oldValue != 'xx' && value != oldValue) {
				this.data[x][y] = value;
				if (!noUndo) this.undoArray.push([x,y,oldValue]);
				return true;
			}else {
				return false;
			}

		},

		getMoveToUndo: function() {
			if (this.undoArray.length == 0) return;
			return this.undoArray[this.undoArray.length-1];
		},

		undo: function() {
			if (this.undoArray.length == 0) return false;
			var lastMove = this.undoArray.pop();
			var currentValue = this.getCell(lastMove[0],lastMove[1]);
			this.data[lastMove[0]][lastMove[1]] = lastMove[2];
			return [lastMove[0],lastMove[1],currentValue,lastMove[2]];

		},
		undoArray: [],

	};

	grid.data = [];
	level.data.forEach(function(collumn,x) {
		var datacollumn = [];
		collumn.forEach(function(cell,y) {
			datacollumn.push('0');
		});
		grid.data.push(datacollumn);
	});

	return grid;
};


Griddlers.Board.prototype.makeStripes = function() {

	var strip,xx,yy,numbers,lastNumb;
	//collumns
	for (var i = 0; i < this.board.size[0]; i++) {

		if (this.level.noVerticalStripes) break;

		xx = this.board.sizeOfCell*0.5+(i*this.board.sizeOfCell)+this.board.leftMargin;

		numbers = this.calcNumbers(this.level.data[i]);
		this.collumns.push(this.makeNumbersTxt(xx,0,-20,-10,this.board.fontSize,numbers));

		
		strip = game.make.image(xx,20,'ssheet', i%2 == 0 ? 'griddlers-num_bg1' : 'griddlers-num_bg2');
		strip.height = this.board.sizeOfCell*0.54;
		strip.scale.x = strip.scale.y;
		strip.anchor.setTo(1,0.5);
		strip.angle = 90;

		if (this.collumns[i].length > 0) {
			lastNumb = this.collumns[i][this.collumns[i].length-1];
			strip.y = (lastNumb.y-lastNumb.height-(this.board.fontSize*0.66))+strip.width;
			if (strip.y < 0) {
				strip.width = -strip.y + strip.width;
				strip.y = 0;
			}
		}else {
			strip.visible = false;
			this.grid.xCollumn(i);
			this.inputBlockMap[i].forEach(function(e,index,array) {
				array[index] = 'h';
			});
		}
		
		/*
		if (this.collumns[i].length == 1 && this.collumns[i][0].nr == this.board.size[0]) {
			this.grid.mCollumn(i);
		}
		*/
		//strip.width = Math.abs(strip.y-(lastNumb.y-lastNumb.height))+25; 

		this.gridCache.add(strip);

		
	}

	//rows
	for (var j = 0; j < this.board.size[1]; j++) {

		if (this.level.noHorizontalStripes) break;

		yy = this.board.sizeOfCell*0.5+(j*this.board.sizeOfCell)+this.board.topMargin;

		numbers = [];
		this.level.data.forEach(function(collumn) {
			numbers.push(collumn[j]);
		});
		this.rows.push(this.makeNumbersTxt(-20,-15,yy,0,this.board.fontSize,this.calcNumbers(numbers)));

		
		strip = game.make.image(20,yy,'ssheet', j%2 == 0 ? 'griddlers-num_bg1' : 'griddlers-num_bg2');
		strip.height = this.board.sizeOfCell*0.54;
		strip.scale.x = strip.scale.y;
		strip.anchor.setTo(1,0.5);

		if (this.rows[j].length > 0) {
			lastNumb = this.rows[j][this.rows[j].length-1];
			strip.x = (lastNumb.x-lastNumb.width-this.board.fontSize)+strip.width;
			if (strip.x < 0) {
				strip.width = -strip.x + strip.width;
				strip.x = 0;
			}
		}else {
			strip.visible = false;
			this.grid.xRow(j);
			this.inputBlockMap.forEach(function(collumn) {
				collumn[j] = 'h';
			});
		}
		
		/*
		if (this.rows[j].length == 1 && this.rows[j][0].nr == this.board.size[1]) {
			this.grid.mRow(j);
		}*/

		this.gridCache.add(strip);
			
		
	}

	this.rows.forEach(function(row,index,array) {
		array[index] = row.reverse();
	});
	this.collumns.forEach(function(collumn,index,array) {
		array[collumn] = collumn.reverse();
	}); 

};

Griddlers.Board.prototype.calcNumbers = function(array) {
	var result = [];
	var value = 0;
	var lastCell = 0;

	array.forEach(function(cell,index,ar) {
		if (cell == 1) {
			value++;
		}else {
			if (lastCell == 1) {
				result.push(value);
				value = 0;
			}
		}
		lastCell = cell;

		if (index == ar.length-1 && value > 0) {
			result.push(value);
		}
	});

	return result;
};

Griddlers.Board.prototype.makeNumbersTxt = function(xx,addX,yy,addY,fontSize,array) {
	var result = [];

	array.reverse();

	array.forEach(function(number) {
		var txt = game.make.bitmapText(xx,yy,'font-blue',number.toString(),fontSize);
		txt.anchor.setTo(0.5);
		txt.nr = number;
		result.push(txt);
		xx += addX+(Math.sign(addX) * txt.width);
		yy += addY+(Math.sign(addY) * txt.height);
	});

	return result;
};

Griddlers.Board.prototype.getNumbers = function(array,index) {
	var result = [];
	array[index].forEach(function(nrTxt) {
		result.push(nrTxt);
	});
	return result;
};

Griddlers.Board.prototype.getCollumnData = function(x) {
	return this.grid.data[x].slice();
};

Griddlers.Board.prototype.getRowData = function(y) {
	var result = [];
	this.grid.data.forEach(function(collumn) {
		result.push(collumn[y]);
	});
	return result;
};

Griddlers.Board.prototype.checkStripeNumbers = function(nrArray,data) {
	//restart
	
	nrArray.forEach(function(txt) {
			txt.font = "font-blue";
			txt.tint = 0xFFFFFF;
			txt.alpha = 1;
	});
	



	//sprawdz sume numerów
	
	var sumOfData = data.reduce(function(p,c) {return p + (c == "1" ? 1 : 0)},0);
	var sumOfNumbers = nrArray.reduce(function(p,c) {return p + c.nr},0);
	
	if (sumOfData > sumOfNumbers) {
		nrArray.forEach(function(txt) {
			txt.font = "font";
			txt.tint = 0xFF0000;
		});
		return false;
	};

	var unsureData = this.getUnsureData(data);


	if (sumOfData == sumOfNumbers) {
		if (nrArray.length == unsureData.length) {
			if (unsureData.every(function(c,index) {return c==nrArray[index].nr})) {
				nrArray.forEach(function(txt) {
					txt.alpha = 0.5;
				});
				return true;
			}
		}
	}

	//sprawdz czy nie przekracza maxa

	var maxNumber = nrArray.reduce(function(p,c) {return Math.max(p,c.nr)},0);
	var maxData = unsureData.reduce(function(p,c) {return Math.max(p,c)},0);
	if (maxData > maxNumber) {
		nrArray.forEach(function(txt) {
			txt.font = "font";
			txt.tint = 0xFF0000;
		});
	}



	//sprawdz 'range'
	if (nrArray.length == 1 && data.length > 1) {
		var first = null;
		var last = null;
		data.forEach(function(e,index) {
			if (e == '1') {
				first = first == null ? index : first;
				last = index;
			}
		});
		if (nrArray[0].nr < (last-first)+1) {
			nrArray[0].font = "font";
			nrArray[0].tint = 0xFF0000;
			return false;
		}

	}



	//left pass
	var leftPass = this.getSureData(data);
	var rightPass = this.getSureData(data.reverse());

	//sprawdz czy liczba pewnych nie jest wieksza niz nrArray
	if (nrArray.length < leftPass.length || nrArray.length < rightPass.length) {
		nrArray.forEach(function(txt) {
			txt.font = "font";
			txt.tint = 0xFF0000;
		});
		return false;
	}

	leftPass.forEach(function(nr,index) {
		if (typeof nr == "string") {
			nr = parseInt(nr[1]);
			if (nr > nrArray[index].nr) {
				nrArray[index].font = "font";
				nrArray[index].tint = 0xFF0000;
			}
			return;
		}

		if (nr == nrArray[index].nr) {
			nrArray[index].alpha = 0.5;
		}else {
			nrArray[index].font = "font";
			nrArray[index].tint = 0xFF0000;
		}
	});

	rightPass.forEach(function(nr,index) {
		var index = nrArray.length - 1 - index;

		if (typeof nr == "string") {
			nr = parseInt(nr[1]);
			if (nr > nrArray[index].nr) {
				nrArray[index].font = "font";
				nrArray[index].tint = 0xFF0000;
			}
			return;
		}

		if (nr == nrArray[index].nr) {
			nrArray[index].alpha = 0.5;
		}else {
			nrArray[index].font = "font";
			nrArray[index].tint = 0xFF0000;
		}
	});

	return true;

};

Griddlers.Board.prototype.getSureData = function(data) {

	var result = [];
	var prevSign = null;
	var blocksNr = 0;
	var currentSign;

	for (var i = 0, len = data.length; i < len; i++) {
		currentSign = data[i];

		if (currentSign == '0') {
			if (blocksNr != 0) result.push("!"+blocksNr);
			break;
		}
		if (currentSign == '1') {
			blocksNr++;
		}
		if ((currentSign == "x" || currentSign == "xx") && blocksNr > 0) {
			result.push(blocksNr);
			blocksNr = 0;
		}
	}

	return result;
}

Griddlers.Board.prototype.getUnsureData = function(data) {

	var result = [];
	var prevSign = null;
	var blocksNr = 0;
	var currentSign;

	for (var i = 0, len = data.length; i < len; i++) {
		currentSign = data[i];
		if (currentSign == '1') {
			blocksNr++;
		}

		if ((currentSign == "x" || currentSign == "0" || currentSign == "xx") && blocksNr > 0) {
			result.push(blocksNr);
			blocksNr = 0;
		}
	}

	if (blocksNr != 0) result.push(blocksNr);

	return result;
}

Griddlers.Board.prototype.checkWin = function() {
	return this.rows.concat(this.collumns).every(function(row) {
		return row.every(function(nr) {
			return nr.alpha == 0.5;
		})
	});
}

Griddlers.Board.prototype.showHint = function() {

	if (this.waitingInHint) return;

	if (game.incentivise) {

		if (Griddlers.saveState.data.availableHints > 0) {
			Griddlers.saveState.data.availableHints--;
			Griddlers.saveState.save();
			this.toolbar.refreshHints();
			this.waitingInHint = true;
			game.sfx.chargeUp.play();
		}else {
			new Griddlers.Window('noMoreHints');
		}

	}else {

		this.state.timer.passed += game.SETTINGS.hintPenaltyWhenIncentiviseOff;
		this.state.topButtons.timeTxt.updateTime(this.state.timer.passed);

		var bitmapText = game.add.bitmapText(this.x+(this.board.pxBgWidth*this.scale.x*0.5),this.y+(this.board.pxBgHeight*this.scale.y*0.5),'font','+'+game.SETTINGS.hintPenaltyWhenIncentiviseOff+' sec',60);
		bitmapText.tint = 0xFF0000;
		bitmapText.cacheAsBitmap = true;
		bitmapText._cachedSprite.anchor.setTo(0.5);
		this.penaltyTxt.add(bitmapText);
		game.add.tween(bitmapText).to({y: bitmapText.y-150, alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
			this.destroy();
		},bitmapText);

		this.waitingInHint = true;
		game.sfx.chargeUp.play();


	}

}

Griddlers.Board.prototype.checkStripesAndWin = function(cellX,cellY) {
	if (!this.level.noVerticalStripes) this.checkStripeNumbers(this.collumns[cellX],this.getCollumnData(cellX));
		if (!this.level.noHorizontalStripes) this.checkStripeNumbers(this.rows[cellY],this.getRowData(cellY));
		if (this.checkWin()) {
			this.onBoardClear.dispatch();
			this.changeCell = function() {};
	}
}
Griddlers.BoardEditor = function(level) {

	this.state = game.state.getCurrentState();

	Phaser.Group.call(this, game);
	this.x = 320;
	this.y = 400; 
	this.level = level;
	this.board = game.SETTINGS.boards[level.type];

	this.bg = game.make.image(0,0,null);
	this.add(this.bg);

	this.graphics = game.make.graphics();
	this.add(this.graphics);

	this.grid = this.makeGridObject(level);
	this.loadBoard(level.type);
	this.redrawGraphics();

	this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
};

Griddlers.BoardEditor.prototype = Object.create(Phaser.Group.prototype);
Griddlers.BoardEditor.constructor = Griddlers.BoardEditor;

Griddlers.BoardEditor.prototype.onResize = function() {

	this.x = 320 - this.bg.width*0.5;
	this.y = 400 - this.bg.height*0.5;

};

Griddlers.BoardEditor.prototype.saveLevel = function() {
	this.level.data = this.grid.data;
	this.level.type = this.boardName;
};

Griddlers.BoardEditor.prototype.loadBoard = function(boardName) {
	var board = game.SETTINGS.boards[boardName];
	this.boardName = boardName;
	this.bg.loadTexture(board.spriteName);
	this.grid.changeSize(board.size[0],board.size[1]);
	this.board = board;
	this.onResize();
	this.redrawGraphics();
};

Griddlers.BoardEditor.prototype.redrawGraphics = function() {
	this.graphics.clear();

	this.graphics.beginFill(0x000000,1);

	this.grid.data.forEach(function(collumn,x) {
		collumn.forEach(function(cell,y) {
			if (cell == 1) {
				this.graphics.drawRect(this.board.leftMargin + x*this.board.sizeOfCell,this.board.topMargin + y*this.board.sizeOfCell,this.board.sizeOfCell,this.board.sizeOfCell);
			}
		},this);
	},this)


};

Griddlers.BoardEditor.prototype.update = function() {

	var pointer = game.input.activePointer;

	if (game.input.activePointer.isDown) {
		var value;
		var cellX = Math.floor((pointer.worldX-(this.x+(this.board.leftMargin*this.scale.x)))/(this.board.sizeOfCell*this.scale.x));
		var cellY = Math.floor((pointer.worldY-(this.y+(this.board.topMargin*this.scale.y)))/(this.board.sizeOfCell*this.scale.y));
		if (cellX >= 0 && cellX < this.board.size[0]
				&& cellY >= 0 && cellY < this.board.size[1]) {

				if (this.space.isDown) {
					value = 0;
				}else {
					value = 1;
				}

				if (this.grid.setCell(cellX,cellY,value)) {
					this.redrawGraphics();
				}

		}
	}

};

Griddlers.BoardEditor.prototype.changeCell = function(cellX,cellY,value) {
	var oldValue = this.grid.getCell(cellX,cellY);
	if (oldValue == 'xx') return;
	if (this.grid.setCell(cellX,cellY,value)) {
		this.marksLayer.initAnimation(cellX,cellY,oldValue,value);
		return true;
	}else {
		return false;
	}
};

Griddlers.BoardEditor.prototype.makeGridObject = function(level) {
	var grid = {

		xRow: function(nr) {
			this.data.forEach(function(collumn) {
				collumn[nr] = 'xx';
			})
		},

		xCollumn: function(nr) {
			this.data[nr].forEach(function(e,index,array) {
				array[index] = 'xx';
			});
		},

		getCell: function(x,y) {
			return this.data[x][y];
		},

		setCell: function(x,y,value) {
			var oldValue = this.getCell(x,y);
			if (oldValue != 'xx' && value != oldValue) {
				this.data[x][y] = value;
				return true;
			}else {
				return false;
			}

		},

		changeSize: function(width,height) {
			for (var collumn = 0; collumn < width; collumn++) {
				if (!this.data[collumn]) {
					this.data[collumn] = [];
				}
				for (var row = 0; row < height; row++) {
					if (!this.data[collumn][row]) {
						this.data[collumn][row] = 0;
					}
				}
			}

			if (this.data.length > width) {
				this.data.splice(width);
			}

			if (this.data[0].length > height) {
				this.data.forEach(function(collumn) {
					collumn.splice(height);
				})
			}
		}

	};

	grid.data = [];
	
	if (!level.data) {
		board = game.SETTINGS.boards[level.type];

		for (var collumn = 0; collumn < board.size[0]; collumn++) {
			grid.data[collumn] = [];
			for (var row = 0; row < board.size[1]; row++) {
				grid.data[collumn][row] = 0;
			}
		}

	}else {
		level.data.forEach(function(collumn,x) {
			var datacollumn = [];
			collumn.forEach(function(cell,y) {
				datacollumn.push(cell);
			});
			grid.data.push(datacollumn);
		});
	}

	

	return grid;
};



Griddlers.Button = function(x,y,sprite,callback,context) {

	Phaser.Button.call(this, game,x,y,null,this.click,this);
	
	this.state = game.state.getCurrentState();

	this.loadTexture('ssheet',sprite);
	this.anchor.setTo(0.5);

	this.sfx = game.sfx.pop;

	this.active = true;

	this.onClick = new Phaser.Signal();
	if (callback) {
		this.onClick.add(callback,context || this);
	}

	this.terms = [];

	this.preanimation = false;
	this.tweenSpeed = 200;

}

Griddlers.Button.prototype = Object.create(Phaser.Button.prototype);
Griddlers.Button.constructor = Griddlers.Button;

Griddlers.Button.prototype.click = function() {
	if (!this.active) return;

	for (var i = 0; i < this.terms.length; i++) {
		if (!this.terms[i][0].call(this.terms[i][1])) {
			return;
		}
	}

	this.active = false;
	
	if (this.preanimation) {
		this.onClick.dispatch();
	}

	this.sfx.play();

	game.add.tween(this.scale).to({x: 1.1, y: 1.1},this.tweenSpeed,Phaser.Easing.Quadratic.Out,true).onComplete.add(function() {
		if (!this.preanimation) {
			this.onClick.dispatch();
		}
		game.add.tween(this.scale).to({x: 1, y: 1},this.tweenSpeed,Phaser.Easing.Quadratic.Out,true).onComplete.add(function() {
			this.active = true;
		},this)
	},this)

}

Griddlers.Button.prototype.addTerm = function(callback,context) {
	this.terms.push([callback,context]);
}

Griddlers.Button.prototype.addImageLabel = function(image) {
	this.label = game.make.image(0,0,'ssheet',image);
	this.label.anchor.setTo(0.5);
	this.addChild(this.label);
}

Griddlers.Button.prototype.addTextLabel = function(font,text) {
	
	this.label = new Griddlers.OneLineText(0,0,font,text,Math.floor(this.height*0.5),this.width*0.9);
	this.label._cachedSprite.anchor.setTo(0,0.5);

	this.addChild(this.label);
}
Griddlers.CategoryButton = function(x,y,category) {

	this.state = game.state.getCurrentState();

	Griddlers.Button.call(this,x,y,'griddlers-buttonEmtyLong',function() {
		if (this.categoryInfo.unlock) {
			this.state.goToLevels(this.categoryData);
		}
	},this);

	this.categoryData = category;
	this.categoryInfo = Griddlers.saveState.getCategoryInfo(this.categoryData);

	this.over = false;
	this.onInputOver.add(function() {
		this.over = true;
	},this);
	this.onInputOut.add(function() {
		this.over = false;
	},this);
	this.addTerm(function() {return this.over},this);


	if (this.categoryInfo.unlock) {
		this.loadTexture('ssheet','griddlers-buttonEmtyLongGreen');
		/*
		this.overlay = game.add.image(this.width*-0.5,this.height*-0.5,'ssheet','griddlers-buttonEmtyLongGreen');
		this.overlay.crop(new Phaser.Rectangle(0,0,this.categoryInfo.progress*this.overlay.width,this.height))
		this.addChild(this.overlay);
		*/
		this.addTextLabel('font',game.getTxt(this.categoryData.name));
		
	}else {
		this.loadTexture('ssheet','griddlers-buttonEmtyLongGrey');
		this.overlay = game.make.image(this.width*-0.5,this.height*-0.5,'ssheet','griddlers-buttonEmtyLongNoShadow');
		this.overlay.crop(new Phaser.Rectangle(0,0,this.categoryInfo.unlockProgress*this.overlay.width,this.height));
		this.addChild(this.overlay);
		
		this.lockIco = game.make.image(0,0,'ssheet','griddlers-lock');
		this.lockIco.y -= this.lockIco.height*0.5;
		this.starIco = game.make.image(0,0,'ssheet','griddlers-miniStar');
		this.starIco.y -= this.starIco.height*0.48;
		this.txt = game.make.bitmapText(0,0,'font',this.categoryData.unlock.toString(), 45);
		this.txt.y -= this.txt.height*0.72;

		this.lockIco.x = -0.5*(this.lockIco.width+10+this.txt.width+this.starIco.width);
		this.txt.x = this.lockIco.x + this.lockIco.width+10;
		this.starIco.x = this.txt.x + this.txt.width;

		this.addChild(this.starIco);
		this.addChild(this.lockIco);
		this.addChild(this.txt);


	}

}

Griddlers.CategoryButton.prototype = Object.create(Griddlers.Button.prototype);
Griddlers.CategoryButton.constructor = Griddlers.CategoryButton;

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(view){"use strict";if(typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var doc=view.document,get_URL=function(){return view.URL||view.webkitURL||view},save_link=doc.createElementNS("http://www.w3.org/1999/xhtml","a"),can_use_save_link="download"in save_link,click=function(node){var event=new MouseEvent("click");node.dispatchEvent(event)},is_safari=/Version\/[\d\.]+.*Safari/.test(navigator.userAgent),webkit_req_fs=view.webkitRequestFileSystem,req_fs=view.requestFileSystem||webkit_req_fs||view.mozRequestFileSystem,throw_outside=function(ex){(view.setImmediate||view.setTimeout)(function(){throw ex},0)},force_saveable_type="application/octet-stream",fs_min_size=0,arbitrary_revoke_timeout=500,revoke=function(file){var revoker=function(){if(typeof file==="string"){get_URL().revokeObjectURL(file)}else{file.remove()}};if(view.chrome){revoker()}else{setTimeout(revoker,arbitrary_revoke_timeout)}},dispatch=function(filesaver,event_types,event){event_types=[].concat(event_types);var i=event_types.length;while(i--){var listener=filesaver["on"+event_types[i]];if(typeof listener==="function"){try{listener.call(filesaver,event||filesaver)}catch(ex){throw_outside(ex)}}}},auto_bom=function(blob){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)){return new Blob(["\ufeff",blob],{type:blob.type})}return blob},FileSaver=function(blob,name,no_auto_bom){if(!no_auto_bom){blob=auto_bom(blob)}var filesaver=this,type=blob.type,blob_changed=false,object_url,target_view,dispatch_all=function(){dispatch(filesaver,"writestart progress write writeend".split(" "))},fs_error=function(){if(target_view&&is_safari&&typeof FileReader!=="undefined"){var reader=new FileReader;reader.onloadend=function(){var base64Data=reader.result;target_view.location.href="data:attachment/file"+base64Data.slice(base64Data.search(/[,;]/));filesaver.readyState=filesaver.DONE;dispatch_all()};reader.readAsDataURL(blob);filesaver.readyState=filesaver.INIT;return}if(blob_changed||!object_url){object_url=get_URL().createObjectURL(blob)}if(target_view){target_view.location.href=object_url}else{var new_tab=view.open(object_url,"_blank");if(new_tab==undefined&&is_safari){view.location.href=object_url}}filesaver.readyState=filesaver.DONE;dispatch_all();revoke(object_url)},abortable=function(func){return function(){if(filesaver.readyState!==filesaver.DONE){return func.apply(this,arguments)}}},create_if_not_found={create:true,exclusive:false},slice;filesaver.readyState=filesaver.INIT;if(!name){name="download"}if(can_use_save_link){object_url=get_URL().createObjectURL(blob);setTimeout(function(){save_link.href=object_url;save_link.download=name;click(save_link);dispatch_all();revoke(object_url);filesaver.readyState=filesaver.DONE});return}if(view.chrome&&type&&type!==force_saveable_type){slice=blob.slice||blob.webkitSlice;blob=slice.call(blob,0,blob.size,force_saveable_type);blob_changed=true}if(webkit_req_fs&&name!=="download"){name+=".download"}if(type===force_saveable_type||webkit_req_fs){target_view=view}if(!req_fs){fs_error();return}fs_min_size+=blob.size;req_fs(view.TEMPORARY,fs_min_size,abortable(function(fs){fs.root.getDirectory("saved",create_if_not_found,abortable(function(dir){var save=function(){dir.getFile(name,create_if_not_found,abortable(function(file){file.createWriter(abortable(function(writer){writer.onwriteend=function(event){target_view.location.href=file.toURL();filesaver.readyState=filesaver.DONE;dispatch(filesaver,"writeend",event);revoke(file)};writer.onerror=function(){var error=writer.error;if(error.code!==error.ABORT_ERR){fs_error()}};"writestart progress write abort".split(" ").forEach(function(event){writer["on"+event]=filesaver["on"+event]});writer.write(blob);filesaver.abort=function(){writer.abort();filesaver.readyState=filesaver.DONE};filesaver.readyState=filesaver.WRITING}),fs_error)}),fs_error)};dir.getFile(name,{create:false},abortable(function(file){file.remove();save()}),abortable(function(ex){if(ex.code===ex.NOT_FOUND_ERR){save()}else{fs_error()}}))}),fs_error)}),fs_error)},FS_proto=FileSaver.prototype,saveAs=function(blob,name,no_auto_bom){return new FileSaver(blob,name,no_auto_bom)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(blob,name,no_auto_bom){if(!no_auto_bom){blob=auto_bom(blob)}return navigator.msSaveOrOpenBlob(blob,name||"download")}}FS_proto.abort=function(){var filesaver=this;filesaver.readyState=filesaver.DONE;dispatch(filesaver,"abort")};FS_proto.readyState=FS_proto.INIT=0;FS_proto.WRITING=1;FS_proto.DONE=2;FS_proto.error=FS_proto.onwritestart=FS_proto.onprogress=FS_proto.onwrite=FS_proto.onabort=FS_proto.onerror=FS_proto.onwriteend=null;return saveAs}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!=null){define([],function(){return saveAs})}
Griddlers.LevelButton = function(x,y,nr,pageSize) {

	this.state = game.state.getCurrentState();

	Griddlers.Button.call(this,x,y,null,function() {
		if (this.levelInfo.unlocked) {
			s.startLevel(this.categoryData,this.levelNr);
		}else {
			console.log('locked');
		}
	},this);

	this.loadTexture(null);

	this.nr = nr;
	this.pageSize = pageSize;
	this.icon = game.make.image(0,0,null);
	this.icon.anchor.setTo(0.5);
	this.addChild(this.icon);
	this.starsIco = game.make.image(0,20,null);
	this.starsIco.anchor.setTo(0.5,0);
	this.addChild(this.starsIco);

}

Griddlers.LevelButton.prototype = Object.create(Griddlers.Button.prototype);
Griddlers.LevelButton.constructor = Griddlers.LevelButton;


Griddlers.LevelButton.prototype.refresh = function(page,delay) {
	this.active = false;

	var delay = this.nr/this.pageSize*400;

	this.scale.setTo(1);
	var tween = game.add.tween(this.scale).to({x:0,y:0},200,Phaser.Easing.Sinusoidal.InOut,true,delay).onComplete.add(function() {
		this.init(this.categoryData,page);
		game.add.tween(this.scale).to({x:1,y:1},200,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
			this.active = true;
		},this)

	},this);

}

Griddlers.LevelButton.prototype.init = function(cat,page) {
	this.categoryData = cat;
	this.levelNr = this.nr+(page*this.pageSize);
	this.levelInfo = Griddlers.saveState.getLevelInfo(cat,this.levelNr);
	this.starsIco.loadTexture(null);

	this.exists = true;
	this.visible = true;
	this.icon.visible = false;

	if (this.levelInfo === null) {
		this.exists = false;
		this.visible = false;
		return;
	}

	if (this.levelInfo.unlocked) {

		this.loadTexture('ssheet','griddlers-button----');
		if (this.levelInfo.stars > 0) {
			this.loadTexture('ssheet','griddlers-buttonEmty');
			this.starsIco.loadTexture('ssheet','lvl-stars-'+this.levelInfo.stars);
			this.icon.visible = true;
			this.icon.loadTexture('miniaturessheet',cat.name+'-'+this.levelNr);
		}
		//ADD ICON

	}else {

		this.loadTexture('ssheet','griddlers-button-locked');

	}
}
Griddlers.Mark = function(board) {

	Phaser.Image.call(this, game,0,0,null);
	this.board = board;
	this.anchor.setTo(0.5);
	this.kill();

};

Griddlers.Mark.prototype = Object.create(Phaser.Image.prototype);
Griddlers.Mark.constructor = Griddlers.Mark;

Griddlers.Mark.prototype.init = function(cellX,cellY,oldValue,newValue) {
	this.revive();
	this.x = this.board.sizeOfCell*0.5+(cellX*this.board.sizeOfCell);
	this.y = this.board.sizeOfCell*0.5+(cellY*this.board.sizeOfCell);
	this.cellX = cellX;
	this.cellY = cellY;
	this.value = newValue;
	this.alpha = 1;
}

Griddlers.Mark.prototype.appear = function(frameName) {
	this.loadTexture('ssheet',frameName);
	this.width = this.board.sizeOfCell;
	this.height = this.board.sizeOfCell;
	var tween = game.add.tween(this).from({alpha: 0, width: this.width*1.5,height: this.height*1.5},200,Phaser.Easing.Sinusoidal.InOut,true);
	tween.onComplete.add(this.kill,this);
	return tween;
}

Griddlers.Mark.prototype.disappear = function(frameName) {
	this.loadTexture('ssheet',frameName);
	this.width = this.board.sizeOfCell;
	this.height = this.board.sizeOfCell;
	var tween = game.add.tween(this.scale).to({x:0,y:0},200,Phaser.Easing.Sinusoidal.InOut,true);
	tween.onComplete.add(this.kill,this);
	return tween;
}

Griddlers.Mark.prototype.drawNewValue = function() {
	//this.parent.drawOnBitmap(this.cellX,this.cellY,this.value);
	this.parent.drawOnBitmap(this.cellX,this.cellY,this.parent.gridData[this.cellX][this.cellY]);
}
Griddlers.MarksLayer = function(board,data,inputBlockMap) {

	this.state = game.state.getCurrentState();

	Phaser.Group.call(this, game);

	this.x = board.leftMargin;
	this.y = board.topMargin;
	
	this.board = board;
	this.gridData = data;
	this.inputBlockMap = inputBlockMap;

	this.tapMode = Griddlers.saveState.isTapControll();

	this.sliderPosition = [0,0];

	this.bitmapMark = game.make.image(0,0,null);

	this.sliderBitmap = game.add.bitmapData(board.sizeOfCell*board.size[0],board.sizeOfCell*board.size[1]);
	this.sliderBitmapImg = this.sliderBitmap.addToWorld();
	this.add(this.sliderBitmapImg);
	this.bitmap = game.add.bitmapData(board.sizeOfCell*board.size[0],board.sizeOfCell*board.size[1]);
	this.redrawBitmap();
	this.marksImg = this.bitmap.addToWorld();
	this.add(this.marksImg);

	this.slider = game.make.image(0,0,'ssheet','griddlers-slideBorder');
	this.slider.width = this.board.sizeOfCell;
	this.slider.height = this.board.sizeOfCell;
	this.add(this.slider);


	for (var i = 0; i < 5; i++) {
		this.add(new Griddlers.Mark(this.board));
	}

	this.animating = 0;
	this.doRedraw = false;

	this.changePositionOfSlider(Math.floor(this.board.size[0]/2),Math.floor(this.board.size[1]/2));
	this.refreshMode();

	this.state.onModeChange.add(this.refreshMode,this);


};

Griddlers.MarksLayer.prototype = Object.create(Phaser.Group.prototype);
Griddlers.MarksLayer.constructor = Griddlers.MarksLayer;

Griddlers.MarksLayer.prototype.moveSlider = function(xOffset,yOffset) {
	
	var redraw = false;
	var newX = this.sliderPosition[0] + xOffset;
	var newY = this.sliderPosition[1] + yOffset;

 	if (newX >= 0 && newX < this.board.size[0]) {
 		this.sliderPosition[0] = newX;
 		this.slider.x = this.sliderPosition[0] * this.board.sizeOfCell;
 		redraw = true;
 	} 
 	if (newY >= 0 && newY < this.board.size[1]) {
 		this.sliderPosition[1] = newY;
 		this.slider.y = this.sliderPosition[1] * this.board.sizeOfCell;
 		redraw = true;
 	}

 	if (redraw && !this.tapMode) this.redrawSliderBitmap();

}

Griddlers.MarksLayer.prototype.refreshMode = function() {
	this.tapMode = Griddlers.saveState.isTapControll();
	if (this.tapMode) {
		this.slider.visible = false;
		this.sliderBitmapImg.visible = false;
		this.redrawSliderBitmap();
	}else {
		this.slider.visible = true;
		this.sliderBitmapImg.visible = true;
	}

}

Griddlers.MarksLayer.prototype.changePositionOfSlider = function(x,y) {
	this.sliderPosition = [x,y];
	this.slider.x = x * this.board.sizeOfCell;
	this.slider.y = y * this.board.sizeOfCell;
	if (!this.tapMode) {
		this.redrawSliderBitmap();
	}
}

Griddlers.MarksLayer.prototype.update = function() {
	if (this.animating == 0 && this.doRedraw) {
		this.redrawBitmap();
	}
};

Griddlers.MarksLayer.prototype.initAnimation = function(cellX,cellY,oldValue,newValue) {
	var free = this.getFirstDead() || this.add(new Griddlers.Mark(this.board));
	free.init(cellX,cellY,oldValue,newValue);
	if (oldValue == '0' && newValue == '1') {
		free.appear('griddlers-board-cube').onComplete.add(free.drawNewValue,free);
	}
	if (oldValue == '0' && newValue == 'x') {
		free.appear('griddlers-board-x').onComplete.add(free.drawNewValue,free);
	}
	if ((oldValue == '1' || oldValue =='x') && newValue == '0') {
		this.drawOnBitmap(cellX,cellY,'0');
		free.disappear(oldValue == '1' ? 'griddlers-board-cube' : 'griddlers-board-x');
	}
	if ((oldValue == '1' && newValue == 'x') || (oldValue == 'x' && newValue == '1')) {
		this.drawOnBitmap(cellX,cellY,'0');
		free.disappear(oldValue == '1' ? 'griddlers-board-cube' : 'griddlers-board-x');
		free.sendToBack();
		free2 = this.getFirstDead() || this.add(new Griddlers.Mark(this.board));
		free2.init(cellX,cellY,oldValue,newValue);
		free2.appear(newValue == '1' ? 'griddlers-board-cube' : 'griddlers-board-x').onComplete.add(free2.drawNewValue,free2);
	}
};

Griddlers.MarksLayer.prototype.drawOnBitmap = function(cellX,cellY,symbol) {
	var size = this.board.sizeOfCell;
	if (symbol == '0') {
		this.bitmap.clear(cellX*size,cellY*size,size,size);
	}else {
		if (symbol == 'p' || symbol == 'h') {
			this.bitmapMark.loadTexture('ssheet',symbol == 'p' ? 'griddlers-board-penalty' : 'griddlers-board-hint');
			this.bitmapMark.alpha = 0.2;
		}else {
			this.bitmapMark.loadTexture('ssheet',symbol == 1 ? 'griddlers-board-cube' : 'griddlers-board-x');
			this.bitmapMark.alpha = 1;
		}
		


		this.bitmap.draw(this.bitmapMark,cellX*size,cellY*size,size,size,null,true);
	}	
};

Griddlers.MarksLayer.prototype.redrawBitmap = function() {
	this.bitmap.clear();

	this.inputBlockMap.forEach(function(collumn,x) {
		collumn.forEach(function(cell,y) {
			if (!cell) return;
			this.drawOnBitmap(x,y,cell);
		},this);
	},this);

	this.gridData.forEach(function(collumn,x) {
		collumn.forEach(function(cell,y) {
			if (cell == '0') return;
			this.drawOnBitmap(x,y,cell);
		},this) 
	},this);
};

Griddlers.MarksLayer.prototype.redrawSliderBitmap = function() {
	this.sliderBitmap.clear();
	var size = this.board.sizeOfCell;
	for (var x = 0; x < this.board.size[0]; x++) {
		this.bitmapMark.loadTexture('ssheet', (x+this.sliderPosition[1]%2)%2==0 ? 'griddlers-slideStrip2' : 'griddlers-slideStrip1');
		if (x != this.sliderPosition[0]) {
			this.sliderBitmap.draw(this.bitmapMark,x*size,this.sliderPosition[1]*size,size,size,null,true);
		}
	}
	for (var y = 0; y < this.board.size[1]; y++) {
		this.bitmapMark.loadTexture('ssheet', (y+this.sliderPosition[0]%2)%2==0 ? 'griddlers-slideStrip2' : 'griddlers-slideStrip1');
		if (y != this.sliderPosition[1]) {
			this.sliderBitmap.draw(this.bitmapMark,this.sliderPosition[0]*size,y*size,size,size,null,true);
		}
	}
};



Griddlers.MultiLineText = function(x,y,font,text,size,max_width,max_height,align) {  
  

  Phaser.BitmapText.call(this, game, x, y, font,'',size);
  
  
  this.splitText(text,max_width);

  this.align = align || 'center';
  
  if (max_height) {
      while (this.height > max_height) {
        this.fontSize -= 2;
        this.splitText(text,max_width);
        this.updateText();
      }
  }
  
  this.cacheAsBitmap = true;
  this.x -= Math.floor(this.width*0.5)

};

Griddlers.MultiLineText.prototype = Object.create(Phaser.BitmapText.prototype);

Griddlers.MultiLineText.prototype.splitText = function(text,max_width) {

  var txt = text;
  var txtArray = [];
  var prevIndexOfSpace = 0;
  var indexOfSpace = 0;
  var widthOverMax = false;

  while (txt.length > 0) {

    prevIndexOfSpace = indexOfSpace;
    indexOfSpace = txt.indexOf(' ',indexOfSpace+1);

    
    if (indexOfSpace == -1) this.setText(txt);
    else this.setText(txt.substring(0,indexOfSpace));
    this.updateText();

    if (this.width > max_width) {

      if (prevIndexOfSpace == 0 && indexOfSpace == -1) {
        txtArray.push(txt);
        txt = '';
        indexOfSpace = 0;
        continue;
      }

      if (prevIndexOfSpace == 0) {
        txtArray.push(txt.substring(0,indexOfSpace));
        txt = txt.substring(indexOfSpace+1);
        indexOfSpace = 0;
        continue;
      }

      txtArray.push(txt.substring(0,prevIndexOfSpace));
      txt = txt.substring(prevIndexOfSpace+1);
      indexOfSpace = 0;


    }else {
      //ostatnia linijka nie za dluga
      if (indexOfSpace == -1) {
        txtArray.push(txt);
        txt = '';
      } 

    }
  
  }


  this.setText(txtArray.join('\n'));


};

Griddlers.OneLineText = function(x,y,font,text,size,width) {  

  Phaser.BitmapText.call(this, game, x, y, font, text, size, width);

 
  this.insertCoin(size);

  if (width) {
      while (this.width > width) {
        this.fontSize -= 2;
        this.updateText();
      }
  }

  this.cacheAsBitmap = true;
  this.x -= Math.floor(this.width*0.5);


};

Griddlers.OneLineText.prototype = Object.create(Phaser.BitmapText.prototype);

Griddlers.OneLineText.prototype.insertCoin = function(size) {

  if (this.text.indexOf('$$') == -1) return;

  this.children.forEach(function(element,index,array) {

    if (!element.name) return;

    if (element.name == "$" && element.visible) {
      if (index+1 <= array.length-1 && array[index].name == '$') {

        
        var el = element;
        var el2 = array[index+1];

        el.visible = false;
        el2.visible = false;
        coin = game.add.image(el.x+(size*0.05),el.y-(size*0.05),'ssheet','coin');
        coin.width = size;
        coin.height = size;
        el.parent.addChild(coin);


      }
    }


  });

} 


Griddlers.OneLineText.prototype.popUpAnimation = function() {
  
  this.cacheAsBitmap = false;

  var char_numb = this.children.length;
 
  //
  var delay_array = [];
  for (var i = 0; i < char_numb; i++) {
    delay_array[i] = i;
  }
 
  delay_array = Phaser.ArrayUtils.shuffle(delay_array);
  delay_index = 0;
  this.activeTweens = 0;

  this.children.forEach(function(letter) {
 
      if (letter.anchor.x == 0) {
        letter.x = letter.x + (letter.width*0.5);
        letter.y = letter.y + letter.height;
        letter.anchor.setTo(0.5,1);
      }
      var target_scale = letter.scale.x;
      letter.scale.setTo(0,0);
      this.activeTweens++;
      var tween = game.add.tween(letter.scale).to({x:target_scale*1.5,y:target_scale*1.5},200,Phaser.Easing.Quadratic.In,false,delay_array[delay_index]*20).to({x:target_scale,y:target_scale},200,Phaser.Easing.Sinusoidal.In);
      tween.onComplete.add(function() {this.activeTweens--; if (this.activeTweens == 0) {this.cacheAsBitmap = true;}},this);
      tween.start();
      delay_index++; 
    },this)
};
Griddlers.PageButton = function(x,number) {

	this.state = game.state.getCurrentState();

	Griddlers.Button.call(this,x,0,'ui_dot_white',function() {
		this.parent.parent.changePage(number);
	},this);

	this.anchor.setTo(0.5);
	this.hl = game.make.image(0,0,'ssheet','ui_dot_blue');
	this.hl.alpha = 0;
	this.hl.anchor.setTo(0.5);
	this.addChild(this.hl);	

	this.nr = number;

}

Griddlers.PageButton.prototype = Object.create(Griddlers.Button.prototype);
Griddlers.PageButton.constructor = Griddlers.PageButton;


Griddlers.PageButton.prototype.refresh = function(page) {


	if (this.hl.alpha > 0) {
		game.add.tween(this.hl).to({alpha: 0},300,Phaser.Easing.Sinusoidal.InOut,true);
	}
	if (page == this.nr) {
		game.add.tween(this.hl).to({alpha: 1},300,Phaser.Easing.Sinusoidal.InOut,true);
	}

}
Griddlers.saveState = {

	data: {
		stars: [],
		mute: false,
		tapControll: true,
		availableHints: 3
	},

	save: function() {

        this.data.mute = game.sound.mute;
        SG_Hooks.setStorageItem('gmdatastring',JSON.stringify(this.data));

    },

    load: function() {

        var item = SG_Hooks.getStorageItem('gmdatastring');
        if (item) {
            this.data = JSON.parse(item);
            game.sound.mute = this.data.mute;

        }

    },

	passLevel: function(cat,levelNr,time) {

		console.log("PASS LEVEL: "+cat.nr+"x"+levelNr);

		this.data.stars[cat.nr] = this.data.stars[cat.nr] || [];

		var current = this.data.stars[cat.nr][levelNr] || 0;
		var stars = time < cat.starsReq[0] ? 3 : time < cat.starsReq[1] ? 2 : 1;

		

		if (stars > current) {
			this.data.stars[cat.nr][levelNr] = stars;
			console.log("saved!");
			this.save();
		}
		return stars;
	},

	setControll: function(tapControll) {
		this.data.tapControll = tapControll;
		this.save();
	},

	isTapControll: function() {
		return this.data.tapControll;
	},

	getAllStars: function() {
		var result = 0;
		game.LEVELS.forEach(function(cat,index) {
			if (cat.active) {
				result += this.getStarsFromCategory(cat)
			}
		},this);

		return result;
	},

	getStarsFromCategory: function(cat) {
		var index = typeof cat == 'number' ? cat : cat.nr;

		if (this.data.stars[index]) {
			return this.data.stars[index].reduce(function(p,n){return p+n});
		}else {
			return 0;
		}
	},

	getAllAvailableStarsFromCategory: function(cat) {
		return cat.levels.length*3;
	},

	getCategoryInfo: function(cat) {
		var allStars = this.getAllStars();
		var stars = this.getStarsFromCategory(cat);
		var maxStars = this.getAllAvailableStarsFromCategory(cat)
		var obj = {
			stars: this.getStarsFromCategory(cat),
			maxAvailableStars: maxStars,
			unlock: cat.unlock <= allStars,
			unlockProgress: allStars/cat.unlock,
			progress: stars/maxStars
		}

		return obj; 
	},

	getNumberOfPassedLevels: function(cat) {
		var catIndex = typeof cat == 'number' ? cat : cat.nr;
		if (this.data.stars[catIndex]) {
			return this.data.stars[catIndex].reduce(function(p,n) {return p + (n ? 1 : 0)},0);
		}else {
			return 0;
		}

	},

	getLevelInfo: function(cat,lvlNr) {

		var catIndex = typeof cat == 'number' ? cat : cat.nr;

		if (!game.LEVELS[catIndex].levels[lvlNr]) return null;

		var stars = this.data.stars[catIndex] ? (this.data.stars[catIndex][lvlNr] ? this.data.stars[catIndex][lvlNr] : 0) : 0;
		var numberOfPassed = this.getNumberOfPassedLevels(cat)+game.SETTINGS.availableLevelsInCategory;

		var obj = {
			icon: game.LEVELS[catIndex].name+'-'+lvlNr,
			stars: stars,
			unlocked: lvlNr < numberOfPassed
		}

		return obj;

	}

}
Griddlers.ToolBar = function(board,tutorial) {

	this.state = game.state.getCurrentState();

	Phaser.Group.call(this, game);

	this.board = board;
	this.tutorial = tutorial;
	
	this.sliderPosition = 0;
	this.framePosition = 0;
	this.selectedTool = '1';
	this.pY = 0.87;

	this.bg = game.make.image(0,0,'ssheet', 'griddlers-ui-border');
	this.buttons = game.add.group();

	this.buttons.inputLock = false;


	this.btn1 = new Griddlers.Button(45,45,'griddlers-buttonIcon-cube',function() {
		if (Griddlers.saveState.isTapControll()) {
			this.framePosition = 0;
			this.selectedTool = '1';
		}else {
			this.board.changeCell(this.board.marksLayer.sliderPosition[0],this.board.marksLayer.sliderPosition[1],'1');
		}
	},this);

	this.btn2 = new Griddlers.Button(128,45,'griddlers-buttonIcon-x',function() {
		if (Griddlers.saveState.isTapControll()) {
			this.framePosition = 1;
			this.selectedTool = 'x';
		}else {
			this.board.changeCell(this.board.marksLayer.sliderPosition[0],this.board.marksLayer.sliderPosition[1],'x');
		}
	},this);

	this.btn3 = new Griddlers.Button(211,45,'griddlers-buttonIcon-eraser',function() {
		if (Griddlers.saveState.isTapControll()) {
			this.framePosition = 2;
			this.selectedTool = '0';
		}else {
			this.board.changeCell(this.board.marksLayer.sliderPosition[0],this.board.marksLayer.sliderPosition[1],'0');
		}
	},this);
	this.btn4 = new Griddlers.Button(294,45,'griddlers-buttonIcon-back',function() {
		this.board.undo();
	},this);
	this.btn5 = new Griddlers.Button(377,45,'griddlers-buttonIcon-help',function() {
		this.board.showHint();
	},this);
	this.buttons.addMultiple([this.btn1,this.btn2,this.btn3,this.btn4,this.btn5]);
	this.buttons.children.forEach(function(child) {
		child.preanimation = true;
		child.hitArea = new Phaser.Rectangle(-38,-38,76,76);
		child.addTerm(function() {return !this.inputLock},this);
		child.addTerm(function() {return !this.paused},this.state);
	},this);
	this.btn5.nrBg = game.make.image(40,-35,'ssheet','hint-nr-bg');
	this.btn5.nrBg.anchor.setTo(0.5);
	this.btn5.nr = game.make.bitmapText(40,-35,'font',Griddlers.saveState.data.availableHints.toString(),26);
	this.btn5.nr.anchor.setTo(0.5);
	this.btn5.addChild(this.btn5.nrBg);
	this.btn5.addChild(this.btn5.nr);

	if (!game.incentivise) {
		this.btn5.nrBg.visible = this.btn5.nr.visible = false;
	}

	this.btn4.alpha = 0.5;
	this.btn4.tweenSpeed = 90;

	this.toolFrame = game.make.image(-5,-4,'ssheet','griddlers-ui-frame');

	this.addMultiple([this.bg,this.buttons,this.toolFrame]);
	
	this.refreshBar();

	this.state.onModeChange.add(this.refreshBar,this);

	this.state.onWindowOpened.add(function() {
		this.inputLock = true;
		this.children.forEach(function(e) {
			e.inputEnabled = false;
		});
	},this.buttons);
	this.state.onWindowClosed.add(function() {
		this.inputLock = false;
		this.children.forEach(function(e) {
			e.inputEnabled = true;
			e.input.useHandCursor = true;
		});
	},this.buttons);
};

Griddlers.ToolBar.prototype = Object.create(Phaser.Group.prototype);
Griddlers.ToolBar.constructor = Griddlers.ToolBar;


Griddlers.ToolBar.prototype.update = function() {
	this.y = Math.floor(this.pY*game.height);
	this.toolFrame.x = (this.framePosition*83)-5;
};


Griddlers.ToolBar.prototype.refreshBar = function() { 

	if (Griddlers.saveState.isTapControll()) {
		this.changeToTapMode();
	}else {
		this.changeToSlideMode();
	}

};

Griddlers.ToolBar.prototype.changeToTapMode = function() {
	this.toolFrame.visible = true;

}

Griddlers.ToolBar.prototype.changeToSlideMode = function() {
	this.toolFrame.visible = false;
}

Griddlers.ToolBar.prototype.onResize = function() {
	if (!this.tutorial && Griddlers.horizontalLayout) {
		this.x = 750;
		this.angle = 90;
		this.buttons.children.forEach(function(e) {
			e.angle = -90;
		});
		this.pY = 0.33;
	}else {
		this.x = 320 - (this.bg.width*0.5);
		this.angle = 0;
		this.buttons.children.forEach(function(e) {
			e.angle = 0;
		});
		this.pY = 0.87;
	}

	if (this.hiding) {
		this.pY = 1.5;
	}
}

Griddlers.ToolBar.prototype.refreshHints = function() {
	this.btn5.nr.setText(Griddlers.saveState.data.availableHints);
}
Griddlers.utils = {
	lerp: function(a,b,t) {
    	return a+t*(b-a);
	},

	getLvlNr: function(catNr,lvlNr) {

		var result = lvlNr+1;
		for (var catIndex = 0; catIndex < catNr; catIndex++) {
			result += game.LEVELS[catIndex].levels.length;
		}

		return result;

	},

	formatZeros: function(nr) {
		return ('00'+nr).slice(-2);
	},

	formatTime: function(sec,obj) {

		var hours = Math.floor(sec/3600);
		var minutes = Math.floor((sec%3600)/60);
		var seconds = sec % 60;

		if (obj) {
			obj.hours = hours;
			obj.minutes = minutes;
			obj.seconds = seconds;
		}

		if (hours == 0) {
			return this.formatZeros(minutes)+':'+this.formatZeros(seconds);
		}else {
			return hours+':'+this.formatZeros(minutes)+':'+this.formatZeros(seconds);
		}

	},

	addShowHide: function(obj,showX,hideX,hideXR) {

		if (game.device.desktop) {
			if (obj.x == hideX || obj.x == hideXR) {
				obj.alpha = 0;
			}
		}

		obj.moveTo = function(x, immediately) {
			if (immediately) {
				this.x = x;
			}else {
				game.add.tween(this).to({x: x},1000,Phaser.Easing.Sinusoidal.InOut,true);
			}
		}
		
		obj.show = function(immediately) {
			this.moveTo(showX,immediately);
			if (game.device.desktop) {
				this.alpha = 0;
				game.add.tween(this).to({alpha: 1},1000,Phaser.Easing.Sinusoidal.InOut,true);
			}
		}

		obj.hide = function(immediately) {
			this.moveTo(hideX,immediately);
			if (game.device.desktop) {
				this.alpha = 1;
				game.add.tween(this).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
				},this)
			}
		}

		if (hideXR) {
			obj.hideLeft = obj.hide;
			obj.hideRight = function(immediately) {
				this.moveTo(hideXR,immediately);
				game.add.tween(this).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true);
			}

		}

	},

	addShowHideY: function(obj,showY,hideY) {

		obj.moveTo = function(y, immediately) {
			if (immediately) {
				this.pY = y;
			}else {
				game.add.tween(this).to({pY: y},1000,Phaser.Easing.Sinusoidal.InOut,true);
			}
		}
		
		obj.show = function(immediately) {
			this.moveTo(showY,immediately);
		}

		obj.hide = function(immediately) {
			this.moveTo(hideY,immediately)
		}

	},

	addPYUpdate: function(obj,pY) {

		obj.update = function() {
			this.y = Math.floor(this.pY*game.height);
		}

		if (pY) {
			obj.pY = pY;
		}
	},

	makeArrayGrid: function(width,height,defaultValue) {
		var grid = [];
		for (var col = 0; col < width; col++) {
			grid[col] = [];
			for (var row = 0; row < height; row++) {
				grid[col][row] = defaultValue;
			}

		}
		return grid;

	}
};

Griddlers.Window = function(type) {

	Phaser.Group.call(this, game);
	this.buttonsList = [];
	this.state = game.state.getCurrentState();

	if (type.constructor === Array) {
		this[type[0]].apply(this,type.slice(1));
	}else {
		this[type].apply(this,Array.prototype.slice.call(arguments,1));	
	}
	
	game.add.tween(this.scale).from({x:2},700,Phaser.Easing.Sinusoidal.In,true);
	game.add.tween(this).from({alpha:0},700,Phaser.Easing.Sinusoidal.In,true);

	this.state.onWindowOpened.dispatch(this);

	this.onResize = function() {
		this.x = game.width*0.5+game.world.bounds.x;
		this.y = game.height*0.5;
	};
	this.onResize();

	game.sfx.whoosh.play();

}

Griddlers.Window.prototype = Object.create(Phaser.Group.prototype);
Griddlers.Window.constructor = Griddlers.Window;

Griddlers.Window.prototype.makeOneLineText = function(y,font,text,size) {
	var txt = game.make.bitmapText(0,y,font,text,size);
  while (txt.width > 400) {
    txt.fontSize -= 2;
    txt.updateText();
  }
	txt.cacheAsBitmap = true;
	txt._cachedSprite.anchor.setTo(0.5);
	this.add(txt);
	return txt;
};

Griddlers.Window.prototype.closeWindow = function(callback,context) {

	game.add.tween(this.scale).to({x:2},300,Phaser.Easing.Quadratic.Out,true);
	game.add.tween(this).to({alpha: 0},300,Phaser.Easing.Sinusoidal.Out,true).onComplete.add(function() {
		
		this.state.onWindowClosed.dispatch();
		this.destroy();
		if (callback) {
			callback.call(context||false);
		}

	},this);
};

Griddlers.Window.prototype.gameOver = function() {

	game.sfx.lose.play();

	this.bg = game.make.image(0,0,'ssheet','griddlers-win-small');
	this.bg.anchor.setTo(0.5,0.5);
	this.add(this.bg);

	this.makeOneLineText(-100,'font-blue',game.getTxt("Time's up!"),60);

	this.buttons = game.make.group();
    this.buttons.y = 120;
    this.buttons.menuBtn = new Griddlers.Button(-65,0,'griddlers-complMenu',function() {
    	this.state.fader.goToState('MainMenu',2,this.state.category,this.state.levelNr);
    	this.buttons.children.forEach(function(e) {
    		e.inputEnabled = false;
    	});
    },this);
    this.buttons.retryBtn = new Griddlers.Button(65,0,'griddlers-replay',function() {
    	this.state.fader.goToState('Game',this.state.category,this.state.levelNr);
    	this.buttons.children.forEach(function(e) {
    		e.inputEnabled = false;
    	});
    },this);
    this.buttons.addMultiple([this.buttons.menuBtn,this.buttons.retryBtn]);

    this.add(this.buttons);

};

Griddlers.Window.prototype.youGainedHints = function() {
	this.bg = game.make.image(0,0,'ssheet','griddlers-win-small');
	this.bg.anchor.setTo(0.5,0.5);
	this.add(this.bg);

	Griddlers.saveState.data.availableHints = game.SETTINGS.hintsForWatchingAd;
	Griddlers.saveState.save();
	this.state.toolbar.refreshHints();

	this.thanksForWatchingTxt = this.makeOneLineText(-165,'font-blue',game.getTxt('Thanks for watching!'),40);

	this.youGainedTxt = this.makeOneLineText(-65,'font-blue',game.getTxt('You gained'),50);

	this.amountTxt = this.makeOneLineText(-10,'font-blue',game.SETTINGS.hintsForWatchingAd+'x',70);
	this.hintImg = game.make.image(0,-10,'ssheet','griddlers-buttonIcon-help');
	this.hintImg.anchor.setTo(0.5);

	this.amountTxt.x = (this.hintImg.width+this.amountTxt.width+5)*-0.5+(this.amountTxt.width*0.5);
	this.hintImg.x = this.amountTxt.x+(this.amountTxt.width*0.5)+5+(this.hintImg.width*0.5);

	this.add(this.hintImg);

	this.okBtn = new Griddlers.Button(0,150,'Button_back_pc',function() {
		this.children.forEach(function(e) {
			e.inputEnabled = false;
		});
		this.closeWindow();
	},this);
	this.okBtn.addTextLabel('font','OK');

	this.add(this.okBtn);

}

Griddlers.Window.prototype.noMoreVideos = function() {
    this.bg = game.make.image(0,0,'ssheet','griddlers-win-small');
    this.bg.anchor.setTo(0.5,0.5);
    this.add(this.bg);

    this.noVideoTxt = new Griddlers.MultiLineText(0,-100,'font-blue',game.getTxt('No more videos'),50,420,90,'center');
    this.add(this.noVideoTxt);

    this.okBtn = new Griddlers.Button(0,150,'Button_back_pc',function() {
        this.children.forEach(function(e) {
            e.inputEnabled = false;
        });
        this.closeWindow();
    },this);
    this.okBtn.addTextLabel('font','OK');

    this.add(this.okBtn);

}

Griddlers.Window.prototype.noMoreHints = function() {
	this.bg = game.make.image(0,0,'ssheet','griddlers-win-small');
	this.bg.anchor.setTo(0.5,0.5);
	this.add(this.bg);

	this.needMoreTxt = this.makeOneLineText(-150,'font-blue',game.getTxt('Need more HINTS?'),40);

	this.watchMovieTxt = new Griddlers.MultiLineText(0,-120,'font-blue',game.getTxt('Watch movie to gain extra hints!'),35,400,100,'center');
	this.add(this.watchMovieTxt);

	this.closeButton = new Griddlers.Button(200,-200,'window-close-x',function() {
		this.closeWindow();
		this.children.forEach(function(e) {
    		e.inputEnabled = false;
    	});
	},this);

	this.shines = game.make.group();
	for (var i = 0; i < 3; i++) {
		this.shines.add(game.make.image(0,0,'ssheet','movie-light'));
		this.shines.children[i].angle = Math.random()*360;
		this.shines.children[i].anchor.setTo(0.5);
	}
	this.shines.update = function() {
		this.children[0].angle += 0.5;
		this.children[1].angle -= 0.7;
		this.children[2].angle += 1.2;
	};
	this.shines.y = 120;

	this.movieButton = new Griddlers.Button(0,110,'movie',function() {
		this.children.forEach(function(e) {
    		e.inputEnabled = false;
    	});
                  game.sfx.music.volume = 0;
		SG_Hooks.triggerIncentivise((function(result) {
			if (result == true) {
				this.closeWindow(function() {
					new Griddlers.Window('youGainedHints');
				});
			} else {
                                    this.closeWindow(function() {
                                        new Griddlers.Window('noMoreVideos');
                                    });      
                            }
                            game.sfx.music.volume = 0.3;
		}).bind(this));

		
	},this);

	game.add.tween(this.movieButton).to({y: 100},1500,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);

	this.addMultiple([this.closeButton,this.shines,this.movieButton]);

};

Griddlers.Window.prototype.win = function() {

	

	var starsNumber = Griddlers.saveState.passLevel(this.state.category,this.state.levelNr,this.state.timer.passed);

	SG_Hooks.levelFinished(Griddlers.utils.getLvlNr(this.state.category.nr,this.state.levelNr), starsNumber);

	this.particlesEmitter = game.add.emitter(0,0,21);
  	this.particlesEmitter.makeParticles('ssheet','particles-white-star');
	this.particlesEmitter.setSize(0,0);
  	this.particlesEmitter.setXSpeed(-500, 500);
  	this.particlesEmitter.setYSpeed(-700, 200);
  	this.particlesEmitter.gravity = 1000;
  	this.particlesEmitter.setRotation(-30,30);
  	this.particlesEmitter.setScale(1, 1, 1, 1,0);
  	this.particlesEmitter.setAlpha(1,0,2000);
  	this.particlesEmitter.fixedToCamera = true;


  	game.time.events.add(900,function() {
  		game.sfx.win.play();
  	});
	
	this.bg = game.make.image(0,0,'ssheet','griddlers-complBack');
	this.bg.anchor.setTo(0.5,0.5);

	this.levelComplete = game.make.bitmapText(0,-290,'font-blue-shadow',game.getTxt('LEVEL COMPLETED!'),40);
	this.levelComplete.cacheAsBitmap = true;
	this.levelComplete._cachedSprite.anchor.setTo(0.5);

	this.stars = [0,0,0];
	this.stars.forEach(function(e,i,a) {
		a[i] = game.make.image(-90+(i*90),130,'ssheet', i < starsNumber ? 'griddlers-complStar' : 'griddlers-complStarGray');
		a[i].anchor.setTo(0.5);
		a[i].scale.setTo(0);
		a[i].angle = -10;
		game.add.tween(a[i]).to({angle:10},1000,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);
		game.add.tween(a[i].scale).to({x: 1, y: 1},600,Phaser.Easing.Elastic.Out,true,900+i*300);
		game.time.events.add(900+i*300,function(){game.sfx.pop.play()});
		if (i < starsNumber) {
			game.time.events.add(900+i*300,(function(x,y,particlesEmitter) {
				return function() {
					particlesEmitter.emitX = game.width*0.5+x+game.world.bounds.x;
					particlesEmitter.emitY = game.height*0.5+y;
					particlesEmitter.explode(2000,7);
					game.sfx.launchBall.play();

				}
			})(a[i].x,a[i].y,this.particlesEmitter))
		}
	},this);


	this.bitmapData = game.add.bitmapData(250,250);
	var cellSize = 250/this.state.level.data.length;
	var img = game.make.image(0,0,'ssheet','griddlers-board-cube')

	for (var x = 0; x < this.state.level.data.length; x++) {
        this.state.level.data[x].forEach(function(cell,y) {
            if (cell == 1) {
                this.bitmapData.draw(img,Math.floor(x*cellSize),Math.floor(y*cellSize),cellSize,cellSize,null,false);
            }
        },this); 
    };


    this.shines = game.make.group();
	for (var i = 0; i < 3; i++) {
		this.shines.add(game.make.image(0,0,'ssheet','movie-light'));
		this.shines.children[i].angle = Math.random()*360;
		this.shines.children[i].anchor.setTo(0.5);
	}
	this.shines.update = function() {
		this.children[0].angle += 0.5;
		this.children[1].angle -= 0.7;
		this.children[2].angle += 1.2;
	};
	this.shines.y = -105;


    this.bitmapImg = this.bitmapData.addToWorld(0, -110, 0.5, 0.5);
    game.add.tween(this.bitmapImg).to({y: -120},1000,Phaser.Easing.Sinusoidal.InOut,true,0,-1,true);

    this.timeTxt = game.make.bitmapText(0,50,'font-blue',game.getTxt('Time')+': '+Griddlers.utils.formatTime(this.state.timer.passed),40);
    this.timeTxt.cacheAsBitmap = true;
    this.timeTxt._cachedSprite.anchor.setTo(0.5);

    this.buttons = game.make.group();
    this.buttons.y = 270;
    this.buttons.menuBtn = new Griddlers.Button(-110,0,'griddlers-complMenu',function() {
    	this.state.fader.goToState('MainMenu',2,this.state.category,this.state.levelNr);
    	this.buttons.children.forEach(function(e) {
    		e.inputEnabled = false;
    	});
    },this);
    this.buttons.retryBtn = new Griddlers.Button(0,0,'griddlers-replay',function() {
    	this.state.fader.goToState('Game',this.state.category,this.state.levelNr);
    	this.buttons.children.forEach(function(e) {
    		e.inputEnabled = false;
    	});
    },this);

    var SG_Helper = {};
    this.buttons.nextBtn = new Griddlers.Button(110,0,'griddlers-play-green',function() {
         game.sfx.music.volume = 0;
    	SG_Hooks.levelUp(Griddlers.utils.getLvlNr(this.state.category.nr,this.state.levelNr), starsNumber, function() {
            game.sfx.music.volume = 0.3;
        });
    	if (this.state.levelNr < this.state.category.levels.length-1) {
    		this.state.fader.goToState('Game',this.state.category,this.state.levelNr+1);
    	}else {
    		this.state.fader.goToState('MainMenu',1);
    	}
    	
    	this.buttons.children.forEach(function(e) {
    		e.inputEnabled = false;
    	});
    },this);




    this.buttons.addMultiple([this.buttons.menuBtn,this.buttons.retryBtn,this.buttons.nextBtn]);


	this.addMultiple([this.bg,this.levelComplete,this.shines,this.bitmapImg,this.timeTxt,this.buttons]);
	this.addMultiple(this.stars);

}
Griddlers.makeBackground = function() {

	var s = game.state.getCurrentState();
	var bg;

	if (game.device.desktop) {
		
		bg = game.add.tileSprite(game.world.bounds.x, 0, game.width, game.height, 'ssheet', 'griddlers-bacground');
		bg.onResize = function() {
			this.tileScale.setTo(800/840);
			this.x = game.world.bounds.x;
			this.width = game.width;
		}
		bg.leftStripe = game.add.image(0,0,'ssheet','bg_stripe');
		bg.leftStripe.anchor.setTo(1,0);
		bg.rightStripe = game.add.image(640+bg.leftStripe.width,0,'ssheet','bg_stripe');
		bg.rightStripe.scale.x = -1;


	}else {
		bg = game.add.image(0,0,'ssheet','griddlers-bacground');
		bg.cacheAsBitmap = true;
		bg.onResize = function() {
			this.height = game.height;
       	 	this.updateCache();
		}
	}


	return bg;

};
Griddlers.makeButtonGroup0 = function() {

	var s = game.state.getCurrentState();
	
	var btnGroup = game.add.group();
	btnGroup.pY = 0.85;
	Griddlers.utils.addPYUpdate(btnGroup);
	Griddlers.utils.addShowHideY(btnGroup,0.85,1.2);

	btnGroup.moreGamesButtons = new Griddlers.Button(90,0,'griddlers-buttonMoreGames',function() {
	       SG.redirectToPortal();
                //window.top.location = "http://m.softgames.de/";
	});

	btnGroup.playButton = new Griddlers.Button(320,0,'Button_Middle',s.goToCategories,s);
	btnGroup.playButton.addTextLabel('font',game.getTxt('PLAY'));

	btnGroup.soundButton = new Griddlers.Button(550,0,game.sound.mute ? 'griddlers-button-soundOff' :'griddlers-button-soundOn', function() {
		game.sound.mute = !game.sound.mute;
		Griddlers.saveState.save();
		s.sb0.loadTexture('ssheet', game.sound.mute ? 'griddlers-button-soundOff' :'griddlers-button-soundOn');
		s.sb1.loadTexture('ssheet', game.sound.mute ? 'griddlers-button-soundOff' :'griddlers-button-soundOn');
		if (game.sound.mute) {
			game.sound.stopAll();
		}else {
			game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true);
		}
	},btnGroup.soundButton);

	s.sb0 = btnGroup.soundButton;

	btnGroup.addMultiple([btnGroup.moreGamesButtons,btnGroup.playButton,btnGroup.soundButton]);

	return btnGroup;

}
Griddlers.makeCategoryElements = function() {

	var s = game.state.getCurrentState();

	var categoriesGroup = game.add.group();

	categoriesGroup.x = 320;
	categoriesGroup.prevY = null;
	categoriesGroup.pY = 0.3;
	categoriesGroup.maxPY = categoriesGroup.pY;
	categoriesGroup.targetPY = categoriesGroup.pY;
	categoriesGroup.minPY = 0;
	categoriesGroup.cachedHeight = 0;
	categoriesGroup.update = function() {
		this.y = this.pY * game.height;
		//this.minPY = Math.min(this.maxPY,this.maxPY-((this.height-game.height*0.6)/game.height));
		  this.minPY = Math.min(this.maxPY,this.maxPY-((this.cachedHeight-game.height*0.6)/game.height));
		if (s.view == 1 && this.minPY != this.maxPY && game.input.activePointer.isDown) {
			if (this.prevY === null) {
				this.prevY = game.input.activePointer.y
			}else {
				this.targetPY -= (this.prevY-game.input.activePointer.y)*0.003;
				this.prevY = game.input.activePointer.y;
				this.targetPY = game.math.clamp(this.targetPY,this.minPY,this.maxPY);
			}
		}else {
			this.prevY = null;
		}
		this.pY = game.math.clamp(Griddlers.utils.lerp(this.pY,this.targetPY,0.05),this.minPY,this.maxPY);
	}
	//Griddlers.utils.addShowHide(categoriesGroup,0,-640,640);

	categoriesGroup.moveTo = function(x, immediately) {
		if (x == 0) {
			this.pY = this.maxPY;
			this.targetPY = this.maxPY;
		}

		if (immediately) {
			this.children.forEach(function(e) {
				e.x = x;
			});
		}else {
			var delayIncrease = Math.floor(250/this.children.length);
			var delay = 250;
			this.children.forEach(function(e) {
				game.add.tween(e).to({x: x},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
				delay += delayIncrease;
			});
		}
	};

	categoriesGroup.show = function(immediately) {

		this.moveTo(0,immediately);

		var delayIncrease = Math.floor(250/this.children.length);
		var delay = 250;
		this.children.forEach(function(e) {
			e.inputEnabled = true;
			e.input.useHandCursor = true;
			
				if (immediately) {
					e.alpha = 1;
				}else {
					e.alpha = 0;
					game.add.tween(e).to({alpha: 1},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
					delay += delayIncrease;
				}
			
		});

	}

	categoriesGroup.hideRight = function(immediately) {
		this.moveTo(640,immediately);

		var delayIncrease = Math.floor(250/this.children.length);
		var delay = 250;
		this.children.forEach(function(e) {
			e.inputEnabled = false;
			
				if (immediately) {
					e.alpha = 0;
				}else {
					e.alpha = 1;
					game.add.tween(e).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
					delay += delayIncrease;
				}
			
		});
	}

	categoriesGroup.hideLeft = function(immediately) {
		this.moveTo(-640,immediately);
		var delayIncrease = Math.floor(250/this.children.length);
		var delay = 250;
		this.children.forEach(function(e) {
			e.inputEnabled = false;
			
				if (immediately) {
					e.alpha = 0;
				}else {
					e.alpha = 1;
					game.add.tween(e).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
					delay += delayIncrease;
				}
			
		});
	}


	
	categoriesGroup.add(new Griddlers.Button(640,0,'how_to_play_button',function() {
		this.fader.goToState('Tutorial');
	},s));
	categoriesGroup.children[0].addTextLabel('font',game.getTxt("How to play?"));

	var usedIndex = 1;
	game.LEVELS.forEach(function(e,index) {
		if (e.active) {
			categoriesGroup.add(new Griddlers.CategoryButton(640,usedIndex*120,e));
			usedIndex++;
		}
	},s);
	//calling this.height in update messing inputs on/over
	categoriesGroup.cachedHeight = categoriesGroup.height;


	categoriesGroup.children.forEach(function(e) {
		e.inputEnabled = false;
		if (game.device.desktop) {
			e.alpha = 0;
		}
	});


	s.backButton = new Griddlers.Button(0,0,'griddlers-back',s.clickBackButton,s);
	s.backButton.x = Math.floor(s.backButton.width*-0.6);
	s.backButton.pY = 0.1;
	Griddlers.utils.addPYUpdate(s.backButton);
	Griddlers.utils.addShowHide(s.backButton,90,Math.floor(s.backButton.width*-0.6));
	s.backButton.inputEnabled = false;
	s.backButton.show = function(immediately) {
		this.moveTo(90,immediately);
		
		if (immediately) {
			this.alpha = 1;
		}else {
			this.alpha = 0;
			game.add.tween(this).to({alpha: 1},1000,Phaser.Easing.Sinusoidal.InOut,true);
		}

		this.inputEnabled = true;
		this.input.useHandCursor = true;
	};
	s.backButton.hide = function(immediately) {
		this.moveTo(Math.floor(s.backButton.width*-0.6),immediately);
		
		if (immediately) {
			this.alpha = 0;
		}else {
			this.alpha = 1;
			game.add.tween(this).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true);
		}
		
		this.inputEnabled = false;
	};
	s.backButton.hide(true);
	game.add.existing(s.backButton);


	s.moreGamesButtons = new Griddlers.Button(200,0,'griddlers-buttonMoreGames',function() {
		window.open("http://m.softgames.de/","_blank");
	});
	s.moreGamesButtons.x = Math.floor(s.moreGamesButtons.width*-0.6);
	s.moreGamesButtons.pY = 0.1;
	Griddlers.utils.addPYUpdate(s.moreGamesButtons);
	Griddlers.utils.addShowHide(s.moreGamesButtons,200,Math.floor(s.moreGamesButtons.width*-0.6
	));
	s.moreGamesButtons.inputEnabled = false;
	s.moreGamesButtons.show = function(immediately) {
		this.moveTo(200,immediately);

		if (immediately) {
			this.alpha = 1;
		}else {
			this.alpha = 0;
			game.add.tween(this).to({alpha: 1},1000,Phaser.Easing.Sinusoidal.InOut,true);
		}
		
		this.inputEnabled = true;
		this.input.useHandCursor = true;
	};
	s.moreGamesButtons.hide = function(immediately) {
		this.moveTo(Math.floor(s.moreGamesButtons.width*-0.6),immediately);
		
		if (immediately) {
			this.alpha = 0;
		}else {
			this.alpha = 1;
			game.add.tween(this).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true);
		}
		
		this.inputEnabled = false;
	};
	s.moreGamesButtons.hide(true);
	game.add.existing(s.moreGamesButtons);


	s.soundButton = new Griddlers.Button(750,0,game.sound.mute ? 'griddlers-button-soundOff' :'griddlers-button-soundOn', function() {
		game.sound.mute = !game.sound.mute;
		Griddlers.saveState.save();
		s.sb1.loadTexture('ssheet', game.sound.mute ? 'griddlers-button-soundOff' :'griddlers-button-soundOn');
		s.sb0.loadTexture('ssheet', game.sound.mute ? 'griddlers-button-soundOff' :'griddlers-button-soundOn');
		if (game.sound.mute) {
			game.sound.stopAll();
		}else {
			game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true);
		}
	},s.soundButton);
	s.sb1 = s.soundButton;
	s.soundButton.pY = 0.1;
	Griddlers.utils.addPYUpdate(s.soundButton);
	Griddlers.utils.addShowHide(s.soundButton,550,750);
	s.soundButton.inputEnabled = false;
	s.soundButton.show = function(immediately) {
		this.moveTo(550,immediately);
			
		if (immediately) {
			this.alpha = 1;
		}else {
			this.alpha = 0;
			game.add.tween(this).to({alpha: 1},1000,Phaser.Easing.Sinusoidal.InOut,true);
		}

		this.inputEnabled = true;
		this.input.useHandCursor = true;
	};
	s.soundButton.hide = function(immediately) {
		this.moveTo(750,immediately);
		
		if (immediately) {
			this.alpha = 0;
		}else {
			this.alpha = 1;
			game.add.tween(this).to({alpha: 0},1000,Phaser.Easing.Sinusoidal.InOut,true);
		}

		this.inputEnabled = false;
	};

	s.starCounter = game.add.group();
	s.starCounter.pY = 0.1;
	s.starCounter.x = 500
	Griddlers.utils.addPYUpdate(s.starCounter);
	s.starCounter.alpha = 0;
	s.starCounter.update = function() {
		this.y = Math.floor(this.pY*game.height);
		this.alpha = s.backButton.alpha*s.backButton.alpha;
	};

	

	s.starCounter.txt = game.add.bitmapText(0,0,'font-blue',Griddlers.saveState.getAllStars().toString(),60);
	s.starCounter.txt.anchor.setTo(1,0.5);
	s.starCounter.add(s.starCounter.txt);
	s.starCounter.ico = game.add.image(5,-2,'ssheet','griddlers-miniStar');
	s.starCounter.ico.anchor.setTo(0,0.5);
	s.starCounter.add(s.starCounter.ico);
	s.starCounter.hl = game.make.image(0,10,'ssheet','txt_hl');
	s.starCounter.hl.anchor.setTo(0,0.5);
	s.starCounter.hl.width = s.starCounter.width*1.5;
	s.starCounter.hl.x = s.starCounter.hl.width * -(s.starCounter.txt.width/s.starCounter.width);
	s.starCounter.addChildAt(s.starCounter.hl,0);

	s.starCounter.x = 355+(s.starCounter.txt.width*0.5); 

	game.add.existing(s.soundButton);

	return categoriesGroup;
}

Griddlers.makeClouds = function() {

	var s = game.state.getCurrentState();
	
	var clouds = game.add.group();

	clouds.onResize = function() {
		this.children.forEach(function(child) {
			child.y = child.pY*game.height;
			child.progressSpeed = 1/(game.width/child.spd);
			child.leftLine = game.world.bounds.x;
		});
	}


	for (var i = 0; i < 8; i++) {

		var cloud = game.add.image((game.world.bounds.x-200)+Math.random()*(game.width*1.5),i*70,'ssheet','griddlers-cloud'+game.rnd.between(1,5));

		cloud.update = function() {

			this.progress += this.progressSpeed;
			this.x = (game.world.bounds.x+game.width)-Math.floor(this.progress*game.width);
			
			game.clouds[this.i].progress = this.progress;

			if (this.x + this.width < this.leftLine) {

				this.progress = Math.random()*-0.5;
				this.x = (game.world.bounds.x+game.width)-Math.floor(this.progress*game.width);
				//this.x = (game.world.bounds.x+game.width)+Math.random(640);
				this.loadTexture('ssheet','griddlers-cloud'+game.rnd.between(1,5));
				game.clouds[this.i].frameName = this.frameName;
			}
		}

		cloud.progress = cloud.x/game.width;
		cloud.pY = (i*80)/800;
		cloud.y = cloud.pY * game.width;
		//cloud spd in pixels
		cloud.spd = 0.25 + (0.10*i);
		cloud.progressSpeed = 1/(game.width/cloud.spd);
		cloud.leftLine = game.world.bounds.x
		cloud.i = i;
		clouds.add(cloud);


		//check if not restore position of clouds from other state
		if (game.clouds && game.clouds[i]) {

			cloud.progress = game.clouds[i].progress;
			cloud.x = Math.floor(this.progress*game.width);
			cloud.loadTexture('ssheet',game.clouds[i].frameName)

		}else {

			if (!game.clouds) {
				game.clouds = [];
			}
			game.clouds[i] = {
				progress: cloud.progress,
				frameName: cloud.frameName
			}

		}
		
	}

	return clouds;

}
Griddlers.makeFadeLayer = function() {
	var s = game.state.getCurrentState();

	var fadeLayer = game.add.image(0,0,'ssheet','fader');
	fadeLayer.cacheAsBitmap = true;
	fadeLayer.onResize = function() {
		fadeLayer.width = game.width;
		fadeLayer.height = game.height;
		fadeLayer.x = game.world.bounds.x;
		this.updateCache();
	}

	
	game.add.tween(fadeLayer).to({alpha: 0},1500,Phaser.Easing.Sinusoidal.InOut,true);

	fadeLayer.goToState = function(state) {

		var argArray =  [].slice.call(arguments);
		argArray.splice(1,0,true,false);

		game.sfx.transition.play();

		game.input.enabled = false;
		game.canvas.style.cursor = "default";

		game.add.tween(this).to({alpha: 1},500,Phaser.Easing.Sinusoidal.InOut,true).onComplete.add(function() {
			
			game.input.enabled = true;
			game.state.start.apply(game.state,argArray);
		});

	};

	fadeLayer.blink = function() {
		this.alpha = 1;
		game.add.tween(this).to({alpha: 0},600,Phaser.Easing.Sinusoidal.Out,true);
	};

	return fadeLayer;
}
Griddlers.makeGameButtons = function(tutorial){
	var s = game.state.getCurrentState();

	var topButtons = game.add.group();
	topButtons.onResize = function() {
		this.y = game.height*0.07;
	}
	topButtons.onResize();

	topButtons.back = new Griddlers.Button(55,0,'griddlers-button-Levels',function() {
		if (s.EDITORMODE) {
			game.state.start("Editor",true,false,s.category,s.levelNr);
		}else {
			s.goBackToMenu()
		}
	}); 

	topButtons.soundButton = new Griddlers.Button(385,0,game.sound.mute ? 'griddlers-button-soundOff' :'griddlers-button-soundOn', function() {
		game.sound.mute = !game.sound.mute;
		Griddlers.saveState.save();
		this.loadTexture('ssheet', game.sound.mute ? 'griddlers-button-soundOff' :'griddlers-button-soundOn');
		if (game.sound.mute) {
			game.sound.stopAll();
		}else {
			game.sfx.music.play('', 0, game.ie10 ? 1 : 0.3, true);
		}
	},topButtons.soundButton);

	topButtons.tapControll = new Griddlers.Button(485,0,Griddlers.saveState.isTapControll() ? 'griddlers-button-SlideControl1' : 'griddlers-button-SlideControl2',function() {
		s.tapControll = !s.tapControll;
		Griddlers.saveState.setControll(s.tapControll);
		s.onModeChange.dispatch(s.tapControll);
		this.loadTexture('ssheet',Griddlers.saveState.isTapControll() ? 'griddlers-button-SlideControl1' : 'griddlers-button-SlideControl2')
	},topButtons.tapControll);

	topButtons.pauseButton = new Griddlers.Button(585,0,'griddlers-pause',s.pause,s);

	if (!tutorial) {
	topButtons.timeTxt = game.make.group();
	topButtons.timeTxt.timeObj = {};
	topButtons.timeTxt.seconds = game.make.bitmapText(0,0,'font-blue','00',50);
	topButtons.timeTxt.colon = game.make.bitmapText(-5,0,'font-blue',':',50);
	topButtons.timeTxt.minutes = game.make.bitmapText(-10,0,'font-blue','00',50);
	topButtons.timeTxt.seconds.anchor.setTo(0,0);
	topButtons.timeTxt.minutes.anchor.setTo(1,0);
	topButtons.timeTxt.colon.anchor.setTo(0.5,0);
	topButtons.timeTxt.addMultiple([topButtons.timeTxt.seconds,topButtons.timeTxt.minutes,topButtons.timeTxt.colon]);
	topButtons.timeTxt.seconds.cacheAsBitmap = true;
	topButtons.timeTxt.minutes.updateText();
	topButtons.timeTxt.minutes.cacheAsBitmap = true;
	topButtons.timeTxt.updateTime = function(seconds) {

		Griddlers.utils.formatTime(seconds,this.timeObj);

		this.seconds.setText(Griddlers.utils.formatZeros(this.timeObj.seconds));
		this.seconds.updateCache();

		var minutes = Griddlers.utils.formatZeros(this.timeObj.minutes);
		if (minutes !== this.minutes.text) {
			this.minutes.setText(minutes);
			this.minutes.updateCache();
			if (this.timeObj.hours > 0) {
				this.minutes.setText(this.timeObj.hours+':'+this.minutes.text);
				this.colon.x = 10;
				this.seconds.x = 15;
				this.minutes.x = 5;
			}
			this.minutes.updateCache();
		}

	};

	if (game.SETTINGS.timesUpGameOver) {
		topButtons.timeTxt.limit = game.add.bitmapText(0,60,'font-blue',game.getTxt("Limit")+': '+Griddlers.utils.formatTime(s.category.starsReq[2]),30);
		topButtons.timeTxt.limit.width = Math.min(190,topButtons.timeTxt.limit.width);
		topButtons.timeTxt.limit.cacheAsBitmap = true;
		topButtons.timeTxt.limit._cachedSprite.anchor.setTo(0.5);
		topButtons.timeTxt.add(topButtons.timeTxt.limit);
	}

	topButtons.add(topButtons.timeTxt);

	}else {
		topButtons.timeTxt = {x:0,y:0};
	}


	topButtons.addMultiple([topButtons.back,topButtons.soundButton,topButtons.tapControll,topButtons.pauseButton]);

	s.onWindowOpened.add(function() {
		this.children.forEach(function(e) {e.inputEnabled = false});
	},topButtons);

	s.onWindowClosed.add(function() {
		this.children.forEach(function(e) {e.inputEnabled = true; if (e.input) e.input.useHandCursor = true;});
	},topButtons);

	topButtons.onResize = function() {
		if (Griddlers.horizontalLayout) {
			this.back.x = -150;
			this.soundButton.x = 590 
			this.tapControll.x = 690
			this.pauseButton.x = 790
			this.timeTxt.x = 710;
			this.timeTxt.y = 130;
			if (game.SETTINGS.timesUpGameOver) {
				this.timeTxt.y = 110;
			}
		}else {
			this.back.x = 55;
			this.soundButton.x = 385 
			this.tapControll.x = 485
			this.pauseButton.x = 585
			this.timeTxt.x = 228;
			this.timeTxt.y = -30;
			if (game.SETTINGS.timesUpGameOver) {
				this.timeTxt.y = -40;
			}
		}
	}

	return topButtons;

}
Griddlers.makeLevelsGroup = function() {
		

	var s = game.state.getCurrentState();
	var levelsGroup = game.add.group();
	levelsGroup.rows = [];
	for (var i = 0; i < 4; i++) {
		levelsGroup.rows[i] = game.make.group();
		Griddlers.utils.addPYUpdate(levelsGroup.rows[i]);
		levelsGroup.rows[i].pY = 0.3 + (i*0.16);
		levelsGroup.rows[i].x = 640;
		levelsGroup.rows[i].addMultiple([new Griddlers.LevelButton(140,0,i*4,16),new Griddlers.LevelButton(260,0,i*4+1,16),new Griddlers.LevelButton(380,0,i*4+2,16),new Griddlers.LevelButton(500,0,i*4+3,16)]);
		levelsGroup.rows[i].children.forEach(function(child) {
			child.inputEnabled = false;
		});
		levelsGroup.add(levelsGroup.rows[i]);
	}
	levelsGroup.pageButtons = game.make.group();
	levelsGroup.pageButtons.pY = 0.90;
	levelsGroup.visible = false;
	Griddlers.utils.addPYUpdate(levelsGroup.pageButtons);
	levelsGroup.add(levelsGroup.pageButtons);

	levelsGroup.buttons = Array.prototype.concat(levelsGroup.rows[0].children,levelsGroup.rows[1].children,levelsGroup.rows[2].children,levelsGroup.rows[3].children);


	game.input.onDown.add(function(pointer) {
		if (s.view == 2) {
			levelsGroup.onDown(pointer);
		}
	});
	game.input.onUp.add(function(pointer) {
		if (s.view == 2) {
			levelsGroup.onUp(pointer);
		}
	});


	levelsGroup.onDown = function(pointer) {
		this.clickTime = new Date().getTime();
		this.clickX = pointer.x;
	};

	levelsGroup.onUp = function(pointer) {

		if (this.clickTime && this.clickX) {
			if ((new Date().getTime()-this.clickTime)/1000 < 0.5 && Math.abs(this.clickX-pointer.x) > 150) {
				this.changePage(this.page + (Math.sign(this.clickX-pointer.x)));
			}
		}
	};



	levelsGroup.show = function(cat,immediately,lastLevel) {

		this.visible = true;
		var passedLevels = lastLevel || Math.min(cat.levels.length-1,Griddlers.saveState.getNumberOfPassedLevels(cat));
		
		this.init(cat,Math.floor(passedLevels/16));

		this.rows.forEach(function(e){e.x = 640});
		this.pageButtons.x = 640;
		
		var targetX = 0;

		if (immediately) {
			this.rows.forEach(function(e){
				e.x = targetX;
				if (game.device.desktop) e.alpha = 1;
				e.children.forEach(function(btn) {
					btn.inputEnabled = true;
					btn.input.useHandCursor = true;
				});
			});

			this.pageButtons.x = targetX;
		}else {
			var delayIncrease = Math.floor(250/5);
			var delay = 250;
			this.rows.forEach(function(e) {

				if (game.device.desktop) {
					
					e.alpha = 0;
					game.add.tween(e).to({alpha: 1},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
				}

				game.add.tween(e).to({x: targetX},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
				delay += delayIncrease;

				e.children.forEach(function(btn) {
					btn.inputEnabled = true;
					btn.input.useHandCursor = true;
				});
			});

			game.add.tween(this.pageButtons).to({x: targetX},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
			if (game.device.desktop) {
				this.pageButtons.alpha = 0;
				game.add.tween(this.pageButtons).to({alpha: 1},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
			}

		}
	}

	levelsGroup.hide = function(immediately) {
		if (immediately) {
			this.x = 640;
			this.visible = false;
			this.pageButtons.removeAll();
		}else {
			var delayIncrease = Math.floor(250/5);
			var delay = 250;
			this.rows.forEach(function(e) {

				if (game.device.desktop) {
					e.alpha = 1;
					game.add.tween(e).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
				}

				game.add.tween(e).to({x: 640},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
				delay += delayIncrease;

				e.children.forEach(function(btn) {
					btn.inputEnabled = false;
				});

			});

			game.add.tween(this.pageButtons).to({x: 640},500,Phaser.Easing.Sinusoidal.InOut,true,delay).onComplete.add(function() {
				this.pageButtons.removeAll(true,true);
				this.visible = false;
			},this);

			if (game.device.desktop) {
				this.pageButtons.alpha = 1;
				game.add.tween(this.pageButtons).to({alpha: 0},500,Phaser.Easing.Sinusoidal.InOut,true,delay);
			}
		}
	}

	levelsGroup.changeLock = false;

	levelsGroup.changePage = function(page) {
		if (this.changeLock) return;

		if (page >= 0 && page < this.pages && page != this.page) {
			this.page = page;
			this.buttons.forEach(function(b) {
				b.refresh(page);
			});

			this.pageButtons.forEach(function(child) {
				child.refresh(page);
			});
		}

		this.changeLock = true;
		game.time.events.add(600,function() {
			this.changeLock = false;
		},this)
	}

	levelsGroup.init = function(cat,page,immediately) {

		this.buttons.forEach(function(b) {
			b.init(cat,page);
		});
		this.pages = Math.ceil(cat.levels.length/16);
		this.page = page;

		if (this.pages > 1) {
			var xx = 320 + ((this.pages-2)*38*-0.5);
			for (var i = 0; i < this.pages; i++) {
				this.pageButtons.add(new Griddlers.PageButton(xx,i))
				if (page == i) {
					this.pageButtons.children[this.pageButtons.length-1].hl.alpha = 1;
				} 
				xx+=38;
			}
		}

	}
	
	return levelsGroup;
	
}
Griddlers.makeLogo = function() {

	var s = game.state.getCurrentState();
	
	var logo = game.add.group();
	logo.pY = 0.35;

	Griddlers.utils.addPYUpdate(logo);
	Griddlers.utils.addShowHideY(logo,0.35,-0.2);

	logo.logo = game.add.image(320,0,'ssheet','griddlers-logo');
	logo.logo.anchor.setTo(0.5);
	logo.deluxe = game.add.image(473,67,'ssheet','griddlers-deluxe');
	logo.deluxe.anchor.setTo(0.5);

	logo.addMultiple([logo.logo,logo.deluxe]);

	return logo;

}
Griddlers.makeWindowLayer = function() {

	var s = game.state.getCurrentState();

	

	var winLayer = game.add.group();

	winLayer.bg = game.add.image(0,0,'ssheet','windowfader');
	winLayer.bg.alpha = 0;
	winLayer.bg.cacheAsBitmap = true;
	winLayer.bg.onResize = function() {
		this.width = game.width;
		this.height = game.height;
		this.x = game.world.bounds.x;
		this.updateCache();
	}

	winLayer.nrOfWin = 0;

	s.onWindowOpened.add(function(win) {
	
		this.add(win);
		
		this.nrOfWin++;
	},winLayer);
	s.onWindowClosed.add(function(win) {this.nrOfWin--;},winLayer);

	winLayer.add(winLayer.bg);

	winLayer.bg.update = function() {
		if (this.parent.nrOfWin > 0) {
			this.alpha = Math.min(0.5,this.alpha + 0.01);
		}else {
			this.alpha = Math.max(0,this.alpha - 0.01);
		}
	}

	winLayer.onResize= function() {
		this.children.forEach(function(e) {
			if (e.onResize) {
				e.onResize();
			}
		})
	}

	return winLayer;
}