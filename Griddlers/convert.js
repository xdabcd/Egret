var fs = require('fs-extra')
    
fs.readFile('./spritesheet.json', 'utf8', function(err, data) {
    if (err) {
        return console.error(err)
    }

    console.log(data)
    // var json = data.toJson();
    

    // fs.writeFile(`${Config.DeploySettings.DeployDist}index.html`, result, 'utf8', function(err) {
    //     if (err) return console.error(err)
    //     else log("generate index.html success")
    // })
})