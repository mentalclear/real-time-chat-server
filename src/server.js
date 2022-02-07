import http from 'http';
import express from "express";
import { routes, protectRouteMiddleware } from "./routes";
import * as admin from 'firebase-admin';
import socketIo from 'socket.io';
import credentials from './credentials.json';
import { db } from './db';
import bodyParser from "body-parser";

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});


const app = express();

app.use(bodyParser.json());

routes.forEach(route => {
    app[route.method](route.path, protectRouteMiddleware, route.handler);
});

const server = http.createServer(app);
// Added CORS here since it didn't work otherwise.
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
});

io.on('connection', async socket => {
    console.log("A new client has connected to socket.io");
    console.log(socket.handshake.query.conversationId);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const start = async () => {
    await db.connect('mongodb://localhost:27017');
    server.listen(8080,() => {
        console.log('Server is listening on port 8080');
    });
}

start();