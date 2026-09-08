const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const connectDB = require(
  "./config/db"
);

const locationRoutes = require(
  "./routes/locationRoutes"
);

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/location", locationRoutes);

// static images access
app.use("/uploads", express.static("uploads"));

app.use("/api/data", require("./routes/dataRoutes"));

app.use("/api/google", require("./routes/googlePlacesRoutes"));

app.use("/api/free", require("./routes/freePlacesRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});
