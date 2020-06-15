const socket = io();

//Elements
const $messageForm = document.querySelector("#messageForm");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $locationButton = document.querySelector("#send-location");

socket.on("message", (welcome)=>{
    console.log(welcome);
})

socket.on("send", (data)=>{
    console.log(data);
})

$messageForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    $messageFormButton.setAttribute("disabled", "disabled");
    const message = document.querySelector("input").value;

    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();

        if(error){
            return console.log(error);
        }
        console.log("Message delivered");
    });
})

$locationButton.addEventListener('click', () =>{
    $locationButton.setAttribute("disabled", "disabled");
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) =>{
        socket.emit("sendLocation", {lat: position.coords.latitude, long: position.coords.longitude}, ()=>{
            $locationButton.removeAttribute("disabled");
            console.log("Location shared!");
        })
    })
})