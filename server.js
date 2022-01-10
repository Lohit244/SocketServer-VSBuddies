const io = require("socket.io")(3001,{
    cors:{
        origin:["http://localhost:3000"]
    }
});

console.log("Server listening at port 3001");

const socketId = {};
const usersList = {};

io.on("connection",async(socket)=>{
    console.log(socket.id);

    // on connecting client is sending user's email
    socket.on("message",(email)=>{
        // map socketId to email 
        socketId[socket.id] = email;
        // checks if this email has already established a connection with the server
        if(email in usersList){
            // only inc the no. of connnetion this email has established to server
            usersList[email]=usersList[email]+1;
        } else {
            // this user established connetion to server for the first time
            usersList[email] = 1;
            // set this user's status in ONLINE
        }
    })
    // on disconnecting
    socket.on("disconnect",()=>{
        // getting the user's email who disconnected
        email = socketId[socket.id];
        // remove this socket connection from socketId list
        delete socketId[socket.id];
        // decrease the no. of connections this user established
        usersList[email] = usersList[email]-1;

        if(usersList[email]===0){
            // since this user has 0 connection with the server
            // user has closed all the windows with VSBuddies signed in or/ may have signed out
            // set this user's status offline
            delete usersList[email]; 
        } 
    })
})