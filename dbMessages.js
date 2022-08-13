import mongoose from "mongoose";

const whatsAppSchema = mongoose.Schema({
  message: String,
  name: String,
  timeStamp: String,
  received: Boolean,
});

export default mongoose.model("messageContent", whatsAppSchema);
