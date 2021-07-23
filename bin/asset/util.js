const fs = require("fs")
fs.readdir("./",(err,data)=>{
    if(err){
        console.error(err)
        return;
    }
    for(let p of data){
        if(p.indexOf(".json") == -1) continue;
        fs.readFile("./" + p,(err,data) => {
            if(err) return
            let target = {}
            let json = JSON.parse(String.fromCharCode(...data))
            for(let k in json.mc){
                let {frameRate,frames} = json.mc[k];
                target.mc = {frameRate,frames};
            }
            target.res = json.res;
            fs.writeFile("./out/" + p,JSON.stringify(target),(e)=>{
                if(e) console.error(e)
            })
        })
    }
})