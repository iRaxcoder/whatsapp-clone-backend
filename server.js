import express from "express";
import pkg from "nodemon";
const { restart } = pkg;
import mongoose from "mongoose";
import dbMessage from "./dbMessages.js";

//app config

const app = express();
const port = process.env.PORT || 9000;

//middleware

app.use(express.json());

//db config

const connectionUrl =
  "mongodb+srv://admin:MhsLM_HXUWUGH4!@cluster0.yo3dopn.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connectionUrl);

//api routes

app.get("/", (req, res) => res.status(200).send("hello world!"));

app.get("/api/v1/messages/sync", (req, res) => {
  dbMessage.find((err, data) => {
    err
      ? res.status(500).send(err)
      : res.status(200).send("new message created \n" + data);
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
