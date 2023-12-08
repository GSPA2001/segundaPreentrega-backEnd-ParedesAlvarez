document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox')
    const userDisplay = document.getElementById('user')
    const messagesLogs = document.getElementById('messagesLogs')

    const setUsername = async () => {
        const { value: username } = await Swal.fire({
            title: 'Autenticación',
            input: 'text',
            text: 'Establecer nombre de usuario para el Chat',
            inputValidator: (value) => {
                return (
                !value.trim() && 'Por favor, escriba un nombre de usuario válido'
                )
            },
            allowOutsideClick: false,
        })

        userDisplay.innerHTML = `<b>${username}: </b>`

        return username
    }

    const initSocket = (username) => {
        const socket = io()

        chatBox.addEventListener('keyup', (event) => {
            if (event.key === 'Enter' && chatBox.value.trim().length > 0) {
                const newMessage = {
                    user: username,
                    message: chatBox.value,
                }
                socket.emit('message', newMessage)

                chatBox.value = ''
            }
        })

        socket.on('logs', (data) => {
            const messagesHTML = data
                .reverse()
                .map((message) => {
                    return `<div class='bg-secondary p-2 my-2 rounded-2'>
                                <p><i>${message.user}</i>: ${message.message}</p>
                            </div>`
                })
                .join('')

            messagesLogs.innerHTML = messagesHTML
        })

        socket.on('alerta', () => {
            Toastify({
                text: 'Un nuevo cliente conectado',
                duration: 1500,
                newWindow: true,
                close: true,
                gravity: 'top',
                position: 'right',
                stopOnFocus: true,
                style: {
                background: "#b1ffa4d1",
                background: "-webkit-linear-gradient(to right, #28b487, #7dd56f)",
                background: "linear-gradient(to right, #28b487, #7dd56f)",
                },
                onClick: function () {},
            }).showToast()
        })
    }

    setUsername().then((username) => initSocket(username))
})