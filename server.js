W = require("ws")
fs = require("fs")
http = require("http")

http.createServer((q,s)=>{
    if(q.url.includes("module.js")){
    fs.readFile("module.js",(e,d)=>{
s.writeHeader(200,{"Content-Type":"application/javascript"})
        s.end(d.toString())

    })
    }else{
    fs.readFile("audiotest.html",(e,d)=>{
        s.writeHeader(200,{"Content-Type":"text/html"})
        s.end(d.toString())
    })
}
}).listen(80)


srv = new W.Server({port:8080})
war = []

function broadcast(buf){
    for(n=0;n<war.length;n++){
        war[n].send(buf)
    }
}
buf = new Float32Array(128)
setInterval(()=>{
    console.log(war.length,acc)
},1000)
acc = 0

function reset(){
    for(let n=0;n<war.length;n++){
        war[n].acc = 0
        acc=0
    }
    buf = new Float32Array(128)
}

function add(data1,data2){
    var ans = new Float32Array(Math.min(data1.length,data2.length))
    for(let n=0;n<Math.min(data1.length,data2.length);n++){
        ans[n]=(data1[n]+data2[n])
    }
    return ans
}
srv.on("connection",(ws)=>{
ws.id = war.push(ws)
ws.acc = 0
    ws.onmessage=(e)=>{
        //ws.send(e.data)
        if(!ws.acc){
            ws.acc=1
            acc++
buf = add(e.data,buf)
if(acc>=war.length){
    broadcast(buf)
    reset()
}
        }
    }
    ws.onclose=()=>{

        for(let n=ws.id+1;n<war.length;n++){
            war[n].id--
        }
        
        war.splice(this.id,1)
    }
})
