
const chatroomHeader = document.getElementById('chatroomHeader')
const inputTextBox = document.getElementById('inputTextBox')
const sendButton = document.getElementById('sendButton')

const chatroomTextList = document.getElementById('chatroomTextList')

let roomsAvailable = []
let selectedChatroom = 'Main'
let currentUser = ''



function sendMessage () {
    const chatMessage = {user: currentUser, message: inputTextBox.value}
    console.log(chatMessage)
    
    socket.emit(selectedChatroom, chatMessage)
}

fetch('/chatroom/info')
.then((res) => {
    console.log(res)
    return res.json()
})
.then((info) => {
    console.log(info)
    roomsAvailable = info.currentRooms
    currentUser = info.username
})

socket.on(selectedChatroom, (chat) => {
    const messageElement = `<li>
    <span>${chat.user}</span>
    <p>${chat.message}</p>
</li>`
    chatroomTextList.insertAdjacentHTML('beforeend', messageElement)
})