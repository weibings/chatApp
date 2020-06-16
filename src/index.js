const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { generateMessage, generateLocationMessage }= require("./utils/messages");
const {addUser, removeUser, getUser, getUsersInRoom} = require("./utils/users");
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
// app.use(session());
app.use(require('flash')());

// app.use((res ,req)=>{
//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success");
//     next();
// })

io.on('connection', (socket) => {

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser(socket.id, username, room);
        if(error){
            return callback(error);
        }
        socket.join(user.room);
        socket.emit("message", generateMessage("Admin", "Welcome!"));
        io.to(user.room).emit('roomDate', {
            room: user.room,
            users: getUsersInRoom(user.room),
        })
        socket.broadcast.to(user.room).emit("message", generateMessage(user.username, `${user.username} has joined!`));
        // callback();
    })
    
    socket.on("sendMessage", (message, callback) =>{
        // console.log(message);
        const user = getUser(socket.id);
        const filter = new Filter();
        if(filter.isProfane(message)){
            return callback("Profanity is not allowed");
        }
        io.to(user.room).emit("message", generateMessage(user.username, message));
        callback();
    })

    socket.on("sendLocation", (position, callback) =>{
        const user = getUser(socket.id);
        io.to(user.room).emit("locationMessage",generateLocationMessage(user.username, `https://google.com/maps?q=${position.lat},${position.long}`));
        callback();
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit("message", generateMessage("Admin", `${user.username} has left!`));
            io.to(user.room).emit('roomDate', {
                room: user.room,
                users: getUsersInRoom(user.room),
            })
        }
        
    })

})
server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`);
})