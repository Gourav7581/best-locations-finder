const express = require("express");
const router = express.Router();

const upload = require("../config/upload");

const {
  createPlace,
  createHotel,
  createCafe,
  getPlaces,
  getHotels,
  getCafes,
} = require("../controllers/dataController");


// CREATE APIs (WITH IMAGE)
router.post("/place", upload.single("image"), createPlace);
router.post("/hotel", upload.single("image"), createHotel);
router.post("/cafe", upload.single("image"), createCafe);


// GET APIs
router.get("/places", getPlaces);
router.get("/hotels", getHotels);
router.get("/cafes", getCafes);

module.exports = router;