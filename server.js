const io = require("socket.io")(3001,{
    cors:{
        origin:["http://localhost:3000"]
    }
});

console.log("Server listening at port 3001");

io.on("connection",(socket)=>{
    console.log(socket.id);
})