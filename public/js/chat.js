const socket = io();

//Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $locationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");


//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", (message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML('beforeend', html);
    
})

socket.on("send", (data)=>{
    console.log(data);
})

socket.on("locationMessage", (url) => {
    console.log(url);
    const html = Mustache.render(locationTemplate, {
        url: url.url,
        createdAt: moment(url.createdAt).format("h:mm a"),});
    $messages.insertAdjacentHTML('beforeend', html);
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