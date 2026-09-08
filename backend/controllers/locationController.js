const Location = require("../models/Location");

// CREATE LOCATION

const createLocation = async (req, res) => {
  try {
    const { state, cities } = req.body;

    if (!state || !cities || !cities.length) {
      return res.status(400).json({
        success: false,
        message: "State and cities are required",
      });
    }

    const existingState = await Location.findOne({
      state,
    });

    // STATE ALREADY EXISTS
    if (existingState) {
      const newCities = cities.filter(
        (city) =>
          !existingState.cities.includes(city)
      );

      existingState.cities.push(...newCities);

      await existingState.save();

      return res.status(200).json({
        success: true,
        message:
          newCities.length > 0
            ? "Cities added successfully"
            : "All cities already exist",
        data: existingState,
      });
    }

    // NEW STATE
    const location = await Location.create({
      state,
      cities,
    });

    res.status(201).json({
      success: true,
      message: "State created successfully",
      data: location,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL STATES

const getStates = async (req, res) => {
  try {
    const states = await Location.find().select(
      "state"
    );

    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET CITIES BY STATE

const getCitiesByState = async (
  req,
  res
) => {
  try {
    const { state } = req.params;

    const location = await Location.findOne({
      state,
    });

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    res.status(200).json(location.cities);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLocation,
  getStates,
  getCitiesByState,
};