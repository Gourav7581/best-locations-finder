const { Readable } = require("stream");

const PLACES_BASE_URL = "https://places.googleapis.com/v1";

const getApiKey = () => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    const error = new Error("Google Maps API key is not configured");
    error.status = 500;
    throw error;
  }

  return apiKey;
};

const googleRequest = async (path, body, fieldMask) => {
  const response = await fetch(`${PLACES_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getApiKey(),
      "X-Goog-FieldMask": fieldMask,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.error?.message || "Google Places request failed"
    );
    error.status = response.status;
    throw error;
  }

  return data;
};

const autocompleteCities = async (req, res) => {
  try {
    const input = req.query.input?.trim();
    const state = req.query.state?.trim();

    if (!input || input.length < 2) {
      return res.json([]);
    }

    const data = await googleRequest(
      "/places:autocomplete",
      {
        input: state ? `${input}, ${state}` : input,
        includedPrimaryTypes: ["(cities)"],
        includedRegionCodes: ["in"],
        languageCode: "en",
      },
      "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat"
    );

    const cities = (data.suggestions || [])
      .map((suggestion) => suggestion.placePrediction)
      .filter(Boolean)
      .map((prediction) => ({
        placeId: prediction.placeId,
        name:
          prediction.structuredFormat?.mainText?.text ||
          prediction.text?.text,
        label: prediction.text?.text,
      }));

    res.json(cities);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const normalizePlace = (place) => ({
  id: place.id,
  name: place.displayName?.text || "Unnamed place",
  location: place.formattedAddress || "",
  description: place.primaryTypeDisplayName?.text || "",
  rating: place.rating || null,
  userRatingCount: place.userRatingCount || 0,
  googleMapsUri: place.googleMapsUri || null,
  image: place.photos?.[0]?.name
    ? `/api/google/photo?name=${encodeURIComponent(place.photos[0].name)}`
    : null,
});

const searchCategory = (city, state, category) => {
  const queries = {
    places: `tourist attractions in ${city}, ${state}, India`,
    hotels: `hotels in ${city}, ${state}, India`,
    cafes: `restaurants and cafes in ${city}, ${state}, India`,
  };

  return googleRequest(
    "/places:searchText",
    {
      textQuery: queries[category],
      regionCode: "IN",
      languageCode: "en",
      pageSize: 12,
    },
    "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.primaryTypeDisplayName,places.googleMapsUri"
  );
};

const searchPlaces = async (req, res) => {
  try {
    const city = req.query.city?.trim();
    const state = req.query.state?.trim();

    if (!city || !state) {
      return res.status(400).json({ message: "State and city are required" });
    }

    const categories = ["places", "hotels", "cafes"];
    const results = await Promise.all(
      categories.map((category) => searchCategory(city, state, category))
    );

    res.json(
      Object.fromEntries(
        categories.map((category, index) => [
          category,
          (results[index].places || []).map(normalizePlace),
        ])
      )
    );
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const getPhoto = async (req, res) => {
  try {
    const name = req.query.name?.trim();

    if (!name || !/^places\/[^/]+\/photos\/[^/]+$/.test(name)) {
      return res.status(400).json({ message: "Invalid photo name" });
    }

    const url = new URL(`${PLACES_BASE_URL}/${name}/media`);
    url.searchParams.set("maxWidthPx", "800");
    url.searchParams.set("skipHttpRedirect", "false");
    url.searchParams.set("key", getApiKey());

    const response = await fetch(url);

    if (!response.ok || !response.body) {
      return res.status(response.status).json({
        message: "Google place photo could not be loaded",
      });
    }

    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    Readable.fromWeb(response.body).pipe(res);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { autocompleteCities, searchPlaces, getPhoto };
