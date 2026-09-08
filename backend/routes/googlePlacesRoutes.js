const express = require("express");

const {
  autocompleteCities,
  searchPlaces,
  getPhoto,
} = require("../controllers/googlePlacesController");

const router = express.Router();

router.get("/cities", autocompleteCities);
router.get("/places", searchPlaces);
router.get("/photo", getPhoto);

module.exports = router;
