import { Server as HttpServer } from "http"
import { Server, Socket } from "socket.io"
import {logger} from "@/server"
import * as handlers from "./handlers"

export function socketAPI(httpServer: HttpServer) {
    const io = new Server(httpServer, {cors: {origin: '*'}})

    io.on('connection', (socket: Socket) => {
        logger.info(`Socket connected: ${socket.id}`)

        // Register all handlers
        Object.values(handlers).forEach(handler => handler(socket))
    })
}
