import express from "express";
import { routes, protectRouteMiddleware } from "./routes";
import * as admin from 'firebase-admin';
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

const start = async () => {
    await db.connect('mongodb://localhost:27017');
    app.listen(8080,() => {
        console.log('Server is listening on port 8080');
    });
}

start();