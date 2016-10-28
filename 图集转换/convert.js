var fs = require('fs-extra')
 debugger
fs.readFile(global.process.argv[2], 'utf8', function(err, data) {
	debugger
    if (err) {
        return console.error(err)
    }
    debugger;
    data = data.replace(" ", "");
    var source = JSON.parse(data);
    var frames = source.frames;
    var target = "";
    target += '{"file":"' + global.process.argv[2].replace("json", "png") + '","frames":{\n'
    for(var key in frames) {
    	var obj = frames[key];
    	target += '"' + key + '":{';
    	target += '"x":' + obj.frame.x + ',';
    	target += '"y":' + obj.frame.y + ',';
    	target += '"w":' + obj.frame.w + ',';
    	target += '"h":' + obj.frame.h + ',';
    	target += '"offX":' + obj.spriteSourceSize.x + ',';
    	target += '"offY":' + obj.spriteSourceSize.y + ',';
    	target += '"sourceW":' + obj.spriteSourceSize.w + ',';
    	target += '"sourceH":' + obj.spriteSourceSize.h;
    	target += '},\n';
    }
    target += '}}';
    target = target.replace(',\n}}', '}}');
    console.log(target);
    fs.writeFile(`new_` + global.process.argv[2], target, 'utf8', function(err) {
        if (err) return console.error(err)
        else console.log("generate index.html success")
    })
})
