const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  ordName: { type: String, required: true },
  ordPrice: { type: String, required: true },
  discounted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Post", postSchema);
