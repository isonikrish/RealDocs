import mongoose from "mongoose";
const docSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

});
const Doc = mongoose.model("Doc", docSchema);
export default Doc;
