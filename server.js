const dotenv = require("dotenv");
dotenv.config();

const io = require("socket.io")(process.env.PORT||3001,{
    cors:{
        origin:"*"
    }
});


const firebase = require("firebase");


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

console.log("Server listening up at port "+(process.env.PORT || 3001));

const socketId = {};
const usersList = {};

io.on("connection",(socket)=>{
    console.log(socket.id);

    // on connecting client is sending user's email
    socket.on("message",async(email)=>{
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
            await db.collection("Users").doc(email).collection("Status").doc("Status").set({
                status: true
            });
        }
        console.log(socketId);
        console.log(usersList);
    })
    // on disconnecting
    socket.on("disconnect",async()=>{
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
            await db.collection("Users").doc(email).collection("Status").doc("Status").set({
                status: false
            });
            delete usersList[email]; 
        }
        console.log(socketId); 
        console.log(usersList);
    })
})