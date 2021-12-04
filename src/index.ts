import * as express from "express";
import v1 from "../route/v1";
import * as jwt from "jsonwebtoken";
import CONFIG from "../config";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

var cors = require("cors");
var app = express();

app.use(cors());

app.use(express.json());
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origins: ["http://localhost:8080"],
  },
});

//SOCKET IO
// socket auth
io.use(async function (socket, next) {
  try {
    if (socket.handshake.query && socket.handshake.query.token) {
      //check token
      let payload = jwt.verify(
        socket.handshake.query.token,
        CONFIG.jwtUserSecret
      );
      let user;
      user = await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });
      // if exists  next ok
      if (user) {
        socket.user = user;
        next();
      } else {
        next(new Error("Authentication error"));
      }
    } else {
      next(new Error("Authentication error"));
    }
  } catch {
    next(new Error("Authentication error"));
  }
});

//SOCKET events
let onlineUsers = [];
io.on("connection", async (socket) => {
  onlineUsers[socket.user.id] = {
    ...socket.user,
    socketId: socket.id,
  };
  socket.on("disconnect", () => {
    delete onlineUsers[socket.user.id];
  });
  socket.on("send-message", async (data) => {
    let messsage = await prisma.message.create({
      data: {
        senderId: socket.user.id,
        reciverId: data.reciver,
        content: data.message,
      },
    });
    //if user online
    if (onlineUsers[data.reciver]) {
      io.to(onlineUsers[data.reciver].socketId).emit(
        "message-" + socket.user.id,
        messsage
      );
    }
  });
  socket.on("typing", async (data) => {
    //if user online
    if (onlineUsers[data.reciver]) {
      io.to(onlineUsers[data.reciver].socketId).emit(
        "typing-" + socket.user.id,
        data.typing
      );
    }
  });
});

app.use(v1);
http.listen(3000, () => {
  console.log("listening on *:3000");
});
