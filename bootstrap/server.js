import http from "http";
//import https from "https";
import { WebSocketServer as websocket } from 'ws';
import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import morgan from "morgan";
import setRoutes from "./routes";
// import setGraphql from "./graphql";
import helmetEncapsulation from "./helmet";
import handleSocketConnection from "./socket";
import socket_middleware from "../src/middleware/socket/socketMiddleware";
import app_auth from "../src/middleware/auth/app_auth";
// import config from "config";

const server = express();
const accessLogStream = fs.createWriteStream(
    path.normalize(__dirname + "/../logs/access.log"), {
    flags: "a",
}
);

// server.use((req, res, next) => {
//     const message = 'new incomming request'
//     UDP_CONNECTION.send(message, 0, message.length, config.get('s_port'), config.get('s_ip'))
//     next();
// });

server.use(morgan("combined", { stream: accessLogStream }));
server.use(
    morgan(function (tokens, req, res) {
        const message = [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ');
        // UDP_CONNECTION.send(message, 0, message.length, config.get('s_port'), config.get('s_ip'));
        return message;
    })
);
helmetEncapsulation(server);
server.use(morgan("dev"));

server.use(
    cors({
        origin: [
            "http://localhost:8080",
            "http://192.168.43.212:8080",
            "http://localhost:8081",
            "http://localhost:5173",
            "http://royal.bar",
            "http://192.168.62.173:8080",
        ],
    })
);
server.use(app_auth());
server.use(express.json({ limit: "100kb" }));
server.use("/api/photo", express.static("storage/images"));
setRoutes(server);
// setGraphql(server);

server.use((err, req, res, next) => {
    res.send(err.message);
});


const app = http.createServer(
    // {
    //   key: fs.readFileSync(path.normalize(__dirname + "/../keys/server-key.pem")),
    //   cert: fs.readFileSync(
    //     path.normalize(__dirname + "/../keys/server-cert.pem")
    //   ),
    // },
    server
);

const ws = new websocket({ server: app, verifyClient: socket_middleware });
ws.on("connection", handleSocketConnection);

export {
    app,
    ws as io
};
