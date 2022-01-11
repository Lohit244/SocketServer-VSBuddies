# Websocket backend for VSBuddies

This is a simple(ish) backend written in NodeJS using socket.io for [VSBuddies](https://vsbuddies.netlify.app) and helps in enabling the online/offline status functionality.

# How to deploy on localhost

1. Install the dependencies using
```bash
npm i
```
2. Create a .env file with the firebase keys using the .env.example file as an example
3. (Optional) Install nodemon using
```bash
npm i -g nodemon
```
4. (Optional) Change the port from 3001(Default) to desired port
5. Start the server
```bash
# nodemon
nodemon server.js

#node
node server.js
```
