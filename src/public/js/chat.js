/* global Swal, io */

const userID = JSON.parse(document.querySelector('script[data]').getAttribute('data'))
const chatBox = document.getElementById('chatBox')

const socket = io()

socket.emit('chat:newParticipant', userID)

chatBox.addEventListener('keyup', (evt) => {
  if (evt.key === 'Enter') {
    if (chatBox.value.trim().length > 0) {
      socket.emit('chat:message', { user: userID, message: chatBox.value.trim() })
      chatBox.value = ''
    }
  }
})

socket.on('chat:messageLogs', (data) => {
  const logs = document.getElementById('logs')
  let message = ''
  data.forEach((log) => {
    if (log.user === userID) {
      message += `<strong>YO</strong>: ${log.message} <br/>`
    } else {
      message += `${log.user} dice: ${log.message} <br/>`
    }
  })
  logs.innerHTML = message
})

socket.on('chat:newConnection', (data) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    title: `${data} se unió al chat`,
    icon: 'success',
  })
})
