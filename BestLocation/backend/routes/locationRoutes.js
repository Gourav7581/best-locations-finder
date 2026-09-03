const express = require("express");

const router = express.Router();

const {
  createLocation,
  getStates,
  getCitiesByState,
} = require("../controllers/locationController");

router.post("/create", createLocation);

router.get("/states", getStates);

router.get(
  "/cities/:state",
  getCitiesByState
);

module.exports = router;