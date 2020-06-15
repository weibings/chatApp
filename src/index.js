const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count  = 0;

io.on('connection', (socket) => {
    // socket.emit("message", {welcome: "hello"});
    socket.broadcast.emit("message", "A new user has joined!");

    socket.on("sendMessage", (message) =>{
        // console.log(message);
        io.emit("send", `${message} received`);
    })

    socket.on("sendLocation", (position) =>{
        io.emit("message",`https://google.com/maps?q=${position.lat},${position.long}`)
    })

    socket.on("disconnect", () => {
        io.emit("message", "A user has left!");
    })

})
server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`);
})