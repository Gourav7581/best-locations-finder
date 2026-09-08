const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  state: String,
  city: String,

  name: String,
  image: String,

  location: String,
  description: String,

  price: Number,

  rating: {
    type: Number,
    default: 4.5,
  },
});

module.exports = mongoose.model("Hotel", hotelSchema);