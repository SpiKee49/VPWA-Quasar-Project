import { Manager, Socket } from 'socket.io-client'

function emitAsync<T>(
    socket: Socket,
    event: string,
    ...args: any[]
): Promise<T> {
    return new Promise((resolve, reject) => {
        socket.emit(event, ...args, (error: Error | null, response: T) => {
            error ? reject(error) : resolve(response)
        })
    })
}

const SocketManager: Manager = new Manager(process.env.API_URL)

export { SocketManager, emitAsync }
