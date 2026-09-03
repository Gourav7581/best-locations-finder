const express = require("express");
const {
  searchCities,
  searchPlaces,
} = require("../controllers/freePlacesController");

const router = express.Router();

router.get("/cities", searchCities);
router.get("/places", searchPlaces);

module.exports = router;
