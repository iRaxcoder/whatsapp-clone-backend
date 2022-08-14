import express from "express";
import pkg from "nodemon";
const { restart } = pkg;
import mongoose from "mongoose";
import dbMessage from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";
//app config

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1462561",
  key: "5f1ef9f0bd441f452a6b",
  secret: "65d8e19100c2ca773232",
  cluster: "eu",
  useTLS: true,
});

//middleware

app.use(express.json());

app.use(cors());

//db config

const connectionUrl =
  "mongodb+srv://admin:MhsLM_HXUWUGH4!@cluster0.yo3dopn.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connectionUrl);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Mongo DB connected");
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timeStamp: messageDetails.timeStamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

//api routes

app.get("/", (req, res) => res.status(200).send("hello world!"));

app.get("/api/v1/messages/sync", (req, res) => {
  dbMessage.find((err, data) => {
    err ? res.status(500).send(err) : res.status(200).send(data);
  });
});

app.post("/api/v1/messages/new", (req, res) => {
  const message = req.body;

  dbMessage.create(message, (err, data) => {
    err
      ? res.status(500).send(err)
      : res.status(201).send("new message created \n" + data);
  });
});

//listen

app.listen(port, () => console.log("listening on localhost:" + port));
