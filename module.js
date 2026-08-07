var buffer = []
class audio extends AudioWorkletProcessor{
    constructor(){
        super()
        this.port.onmessage = (e)=>{
             //console.log(e.data)
            buffer.push(new Float32Array(e.data))
            //console.log(buffer)
        }
    }
    //console.log(_init)
process(inp, out){
    //console.log(buffer)
    if(buffer.length==1){
        try{out[0][0].set(buffer[0])}catch{}
    }else{
        try{out[0][0].set(buffer.shift())}catch{}
    }
    this.port.postMessage(inp[0][0])
    return true;
}
}
registerProcessor("stream_module",audio)