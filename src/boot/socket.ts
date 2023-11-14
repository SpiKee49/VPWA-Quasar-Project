import { Socket, io } from 'socket.io-client'

import { boot } from 'quasar/wrappers'

const socketInstance: Socket = io(process.env.API_URL!)

export default boot(() => {
    socketInstance.on('connect', () => {
        console.log('WebSockets successfully connected id:' + socketInstance.id)
    })
})

export { socketInstance }
