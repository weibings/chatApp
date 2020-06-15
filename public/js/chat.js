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

document.querySelector("#send-location").addEventListener('click', () =>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) =>{
        socket.emit("sendLocation", {lat: position.coords.latitude, long: position.coords.longitude})
    })
})