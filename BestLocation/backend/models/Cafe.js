const mongoose = require("mongoose");

const cafeSchema = new mongoose.Schema({
  state: String,
  city: String,

  name: String,
  image: String,

  location: String,
  description: String,

  rating: {
    type: Number,
    default: 4.5,
  },
});

module.exports = mongoose.model("Cafe", cafeSchema);