const Place = require("../models/Place");
const Hotel = require("../models/Hotel");
const Cafe = require("../models/Cafe");


// ================= CREATE =================

// PLACE
const createPlace = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.file?.filename,
    };

    const place = await Place.create(data);
    res.status(201).json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// HOTEL
const createHotel = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.file?.filename,
    };

    const hotel = await Hotel.create(data);
    res.status(201).json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CAFE
const createCafe = async (req, res) => {
  try {
    const data = {
      ...req.body,
      image: req.file?.filename,
    };

    const cafe = await Cafe.create(data);
    res.status(201).json(cafe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET (FILTER) =================

// PLACES
const getPlaces = async (req, res) => {
  try {
    const { state, city } = req.query;

    const data = await Place.find({ state, city });

    const result = data.map((item) => ({
      ...item._doc,
      image: item.image
        ? `${API_URL}/uploads/images/${item.image}`
        : null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// HOTELS
const getHotels = async (req, res) => {
  try {
    const { state, city } = req.query;

    const data = await Hotel.find({ state, city });

    const result = data.map((item) => ({
      ...item._doc,
      image: item.image
        ?  `${API_URL}/uploads/images/${item.image}`
        : null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CAFES
const getCafes = async (req, res) => {
  try {
    const { state, city } = req.query;

    const data = await Cafe.find({ state, city });

    const result = data.map((item) => ({
      ...item._doc,
      image: item.image
        ?  `${API_URL}/uploads/images/${item.image}`
        : null,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPlace,
  createHotel,
  createCafe,
  getPlaces,
  getHotels,
  getCafes,
};