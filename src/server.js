import http from 'http';
import express from "express";
import { routes, protectRouteMiddleware } from "./routes";
import * as admin from 'firebase-admin';
import socketIo from 'socket.io';
import credentials from './credentials.json';
import { db } from './db';
import { getConversation } from './db';
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

io.use(async (socket, next) => {
    console.log('Verifying user auth token...');
    if (!socket.handshake.query || !socket.handshake.query.token) {
        socket.emit('error', 'You need to include an auth token');
    }

    // Added this so it doesn't crash... will need to figure this out.
    if (socket.handshake.query.token) {
        const user = await admin.auth().verifyIdToken(socket.handshake.query.token);
        socket.user = user;
    }

    next();
});

io.on('connection', async socket => {
    const { conversationId } = socket.handshake.query;
    console.log('A new client connected to socket.io!');
    io.emit('userJoined', socket.user);
    const conversation = await getConversation(conversationId)
    socket.emit('heresYourConversation', conversation);

    socket.on('postMessage', () => {
        // make sure user is memeber
        // add their message to the conversation
        // get the updated conversation
        //  emit an event 
    })

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