const socket = io();
socket.on("message", (welcome)=>{
    console.log(welcome);
})

socket.on("send", (data)=>{
    console.log(data);
})

// document.querySelector("#formSample").addEventListener("submit", (e) =>{
//     e.preventDefault();
//     const message = document.querySelector("input").value;

//     socket.emit("sendMessage", message);
// })