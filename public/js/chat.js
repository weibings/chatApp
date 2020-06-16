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
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;


//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const autoscroll = ()=>{
    // new message element
    $newMessage = $messages.lastElementChild;

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    //visible height
    const visibleHeight = $messages.offsetHeight;

    //height of message container
    const containerHeight = $messages.scrollHeight;

    //how far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight;
    }
}
socket.on("message", (message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username.charAt(0).toUpperCase() + message.username.slice(1),
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
    
})

socket.on("send", (data)=>{
    console.log(data);
})

socket.on("locationMessage", (message) => {
    console.log(message);
    const html = Mustache.render(locationTemplate, {
        username: message.username.charAt(0).toUpperCase() + message.username.slice(1),
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a"),});
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('roomDate', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    })
    document.querySelector("#sidebar").innerHTML = html
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

socket.emit('join', {username, room}, (error)=>{
    // req.flash(error);
    // req.redirect("back");
    alert(error);
    location.href = "/";
});