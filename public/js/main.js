const socket = io('');

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get Username and room from URL
const { username, room } = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

// Join Chatroom
socket.emit('joinRoom', { username, room });

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
      <p class="meta">${message.username}&nbsp;<span>${message.time}</span></p>
      <p class="text">
          ${message.text}
      </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputRoomUsers(users) {
  userList.innerHTML = `
    ${users
      .map(
        (user) =>
          `<li>${user.username} &nbsp;
            <span  style="height:2px; width:2px; background-color:#00FFFF; border-radius:50%; 
            box-shadow: 0 0 20px 5px #00FFFF, 0 0 30px 6px #00FFFF; color:#00FFFF; font-size:5px;">
              ----
            </span>
          </li>`
      )
      .join('')}
    `;
}

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit('chatMessage', msg);

  // Clear Input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
