const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      unique: true,
    },

    cities: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Location",
  locationSchema
);