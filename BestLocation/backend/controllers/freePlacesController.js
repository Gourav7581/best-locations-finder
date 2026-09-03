const GEONAMES_URL = "https://secure.geonames.org/searchJSON";
const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME || "gourav95";
const cache = new Map();

const FALLBACK_IMAGES = {
  places:
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
  hotels:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
  cafes:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
};

const cached = async (key, ttl, loader) => {
  const saved = cache.get(key);
  if (saved && Date.now() - saved.createdAt < ttl) return saved.value;

  const value = await loader();
  cache.set(key, { createdAt: Date.now(), value });
  return value;
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    const serverMessage = text
      .match(/<remark>(.*?)<\/remark>/s)?.[1]
      ?.replace(/<[^>]+>/g, " ")
      .trim();
    const error = new Error(
      serverMessage || `Location service returned an invalid response (${response.status})`
    );
    error.status = response.ok ? 502 : response.status;
    throw error;
  }

  if (!response.ok || data.status) {
    const error = new Error(
      data.status?.message || data.remark || "Location service request failed"
    );
    error.status = response.status || 502;
    throw error;
  }

  return data;
};

const fetchOverpass = async (query) => {
  let lastError;

  for (const url of OVERPASS_URLS) {
    try {
      return await fetchJson(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "ExplorePlace/1.0 (educational travel discovery app)",
        },
        body: new URLSearchParams({ data: query }),
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    `OpenStreetMap is temporarily busy. Please try again shortly. ${lastError?.message || ""}`.trim()
  );
};

const searchCities = async (req, res) => {
  try {
    const input = req.query.input?.trim();
    const state = req.query.state?.trim();

    if (!input || input.length < 2) return res.json([]);

    const cacheKey = `cities:${state}:${input}`.toLowerCase();
    const cities = await cached(cacheKey, 60 * 60 * 1000, async () => {
      const url = new URL(GEONAMES_URL);
      url.searchParams.set("name_startsWith", input);
      url.searchParams.set("country", "IN");
      url.searchParams.set("featureClass", "P");
      url.searchParams.set("maxRows", "20");
      url.searchParams.set("orderby", "relevance");
      url.searchParams.set("username", GEONAMES_USERNAME);

      const data = await fetchJson(url);
      const normalizedState = state?.toLowerCase();
      const matchingState = data.geonames.filter(
        (city) => !normalizedState || city.adminName1?.toLowerCase() === normalizedState
      );
      const source = (matchingState.length ? matchingState : data.geonames)
        .sort((a, b) => (b.population || 0) - (a.population || 0));

      return source.slice(0, 10).map((city) => ({
        placeId: String(city.geonameId),
        name: city.name,
        label: `${city.name}, ${city.adminName1 || state}, India`,
        latitude: Number(city.lat),
        longitude: Number(city.lng),
      }));
    });

    res.json(cities);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const categoryFor = (tags) => {
  if (["hotel", "guest_house", "hostel", "motel", "resort"].includes(tags.tourism)) {
    return "hotels";
  }
  if (["restaurant", "cafe", "fast_food", "food_court"].includes(tags.amenity)) {
    return "cafes";
  }
  return "places";
};

const labelFor = (tags) => {
  const value = tags.tourism || tags.amenity || "place";
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const imageFor = (tags, category) => {
  if (tags.image?.startsWith("http")) return tags.image;

  if (tags.wikimedia_commons?.startsWith("File:")) {
    const filename = tags.wikimedia_commons.slice(5);
    return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(filename)}`;
  }

  return FALLBACK_IMAGES[category];
};

const normalizeElement = (element) => {
  const tags = element.tags || {};
  const category = categoryFor(tags);
  const latitude = element.lat || element.center?.lat;
  const longitude = element.lon || element.center?.lon;
  const address = [
    tags["addr:housename"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
  ].filter(Boolean).join(", ");

  return {
    id: `osm-${element.type}-${element.id}`,
    name: tags.name || tags["name:en"],
    location: address || "Location available on OpenStreetMap",
    description: labelFor(tags),
    about: tags.description || tags["description:en"] || null,
    address: address || null,
    latitude: latitude || null,
    longitude: longitude || null,
    openingHours: tags.opening_hours || null,
    phone: tags.phone || tags["contact:phone"] || null,
    email: tags.email || tags["contact:email"] || null,
    website: tags.website || tags["contact:website"] || null,
    fee: tags.fee || tags.charge || null,
    wheelchair: tags.wheelchair || null,
    operator: tags.operator || null,
    heritage: tags.heritage || tags["heritage:operator"] || null,
    stars: tags.stars || null,
    rooms: tags.rooms || null,
    cuisine: tags.cuisine?.replaceAll(";", ", ") || null,
    outdoorSeating: tags.outdoor_seating || null,
    takeaway: tags.takeaway || null,
    delivery: tags.delivery || null,
    internetAccess: tags.internet_access || null,
    wikipedia: tags.wikipedia || null,
    wikidata: tags.wikidata || null,
    rating: null,
    userRatingCount: 0,
    image: imageFor(tags, category),
    googleMapsUri:
      latitude && longitude
        ? `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`
        : `https://www.openstreetmap.org/${element.type}/${element.id}`,
  };
};

const searchPlaces = async (req, res) => {
  try {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ message: "Valid city coordinates are required" });
    }

    const cacheKey = `places:${latitude.toFixed(3)}:${longitude.toFixed(3)}`;
    const result = await cached(cacheKey, 6 * 60 * 60 * 1000, async () => {
      const query = `[out:json][timeout:25];(
        nwr(around:10000,${latitude},${longitude})["tourism"~"^(attraction|museum|viewpoint|gallery|theme_park|zoo)$"]["name"];
        node(around:10000,${latitude},${longitude})["tourism"~"^(hotel|guest_house|hostel|motel|resort)$"]["name"];
        node(around:10000,${latitude},${longitude})["amenity"~"^(restaurant|cafe|fast_food|food_court)$"]["name"];
      );out center tags 180;`;

      const data = await fetchOverpass(query);

      const grouped = { places: [], hotels: [], cafes: [] };
      const seen = new Set();

      for (const element of data.elements || []) {
        const item = normalizeElement(element);
        const key = `${item.name?.toLowerCase()}:${categoryFor(element.tags || {})}`;
        if (!item.name || seen.has(key)) continue;
        seen.add(key);
        grouped[categoryFor(element.tags || {})].push(item);
      }

      for (const category of Object.keys(grouped)) grouped[category] = grouped[category].slice(0, 12);
      return grouped;
    });

    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = { searchCities, searchPlaces };
