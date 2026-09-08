import { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import NavbarSection from "../Components/NavbarSection";
import HeroSection from "../Components/HeroSection";
import CardSection from "../Components/CardSection";
import FooterSection from "../Components/FooterSection";
import { indiaStates } from "../data/indiaStates";
import { API_BASE_URL } from "../config";
import { Building2, Coffee, Landmark, Map } from "lucide-react";

const categoryImageSets = {
  places: [
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
  ],
  hotels: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
  ],
  cafes: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  ],
};

const DISCOVERY_CACHE_KEY = "exploreplace-discovery-state";
const RETURN_MARKER_KEY = "exploreplace-returning-from-details";
const SCROLL_POSITION_KEY = "exploreplace-results-scroll-y";

const readDiscoveryCache = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(DISCOVERY_CACHE_KEY));
    if (!saved || typeof saved !== "object") return null;

    return {
      selectedState: typeof saved.selectedState === "string" ? saved.selectedState : "Rajasthan",
      selectedCity:
        saved.selectedCity?.name &&
        Number.isFinite(Number(saved.selectedCity.latitude)) &&
        Number.isFinite(Number(saved.selectedCity.longitude))
          ? saved.selectedCity
          : null,
      places: Array.isArray(saved.places) ? saved.places : [],
      hotels: Array.isArray(saved.hotels) ? saved.hotels : [],
      cafes: Array.isArray(saved.cafes) ? saved.cafes : [],
    };
  } catch {
    sessionStorage.removeItem(DISCOVERY_CACHE_KEY);
    return null;
  }
};

function Home() {
  const [initialCache] = useState(readDiscoveryCache);
  const [selectedState, setSelectedState] = useState(initialCache?.selectedState || "Rajasthan");
  const [selectedCity, setSelectedCity] = useState(initialCache?.selectedCity || null);
  const [places, setPlaces] = useState(initialCache?.places || []);
  const [hotels, setHotels] = useState(initialCache?.hotels || []);
  const [cafes, setCafes] = useState(initialCache?.cafes || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const skipInitialFetch = useRef(Boolean(initialCache?.selectedCity));

  useEffect(() => {
    try {
      sessionStorage.setItem(DISCOVERY_CACHE_KEY, JSON.stringify({
        selectedState,
        selectedCity,
        places,
        hotels,
        cafes,
      }));
    } catch {
      // Storage can be unavailable or full; discovery continues in memory.
    }
  }, [selectedState, selectedCity, places, hotels, cafes]);

  useLayoutEffect(() => {
    let isReturning = false;
    let savedScrollY = 0;

    try {
      isReturning = sessionStorage.getItem(RETURN_MARKER_KEY) === "true";
      savedScrollY = Number(sessionStorage.getItem(SCROLL_POSITION_KEY));
    } catch {
      return;
    }

    if (!isReturning) return;

    const firstFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (Number.isFinite(savedScrollY)) window.scrollTo(0, savedScrollY);
        try {
          sessionStorage.removeItem(RETURN_MARKER_KEY);
          sessionStorage.removeItem(SCROLL_POSITION_KEY);
        } catch {
          // Scroll restoration already completed; storage cleanup is optional.
        }
      });
    });

    return () => window.cancelAnimationFrame(firstFrame);
  }, []);

  const loadCities = async (inputValue) => {
    if (!selectedState || inputValue.trim().length < 2) return [];

    try {
      const response = await axios.get(`${API_BASE_URL}/api/free/cities`, {
        params: { input: inputValue.trim(), state: selectedState },
      });

      return response.data.map((city) => ({
        value: city.placeId,
        label: city.label,
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
      }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Cities could not be loaded"
      );
      return [];
    }
  };

  useEffect(() => {
    if (!selectedState || !selectedCity?.name) {
      setPlaces([]);
      setHotels([]);
      setCafes([]);
      return;
    }

    if (skipInitialFetch.current) {
      skipInitialFetch.current = false;
      return;
    }

    const fetchGooglePlaces = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_BASE_URL}/api/free/places`, {
          params: {
            lat: selectedCity.latitude,
            lng: selectedCity.longitude,
          },
        });

        const withPhotoUrls = (items, category) => {
          const imageFrequency = items.reduce((counts, item) => {
            if (item.image) counts[item.image] = (counts[item.image] || 0) + 1;
            return counts;
          }, {});

          return items.map((item, index) => {
            const repeatedImage = item.image && imageFrequency[item.image] > 1;
            const displayImage = repeatedImage
              ? categoryImageSets[category][index % categoryImageSets[category].length]
              : item.image;

            return {
              ...item,
              image: displayImage
                ? displayImage.startsWith("http")
                  ? displayImage
                  : `${API_BASE_URL}${displayImage}`
                : categoryImageSets[category][index % categoryImageSets[category].length],
            };
          });
        };

        setPlaces(withPhotoUrls(response.data.places, "places"));
        setHotels(withPhotoUrls(response.data.hotels, "hotels"));
        setCafes(withPhotoUrls(response.data.cafes, "cafes"));
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Places could not be loaded"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGooglePlaces();
  }, [selectedState, selectedCity]);

  const cityName = selectedCity?.name || "your city";

  return (
    <>
      <NavbarSection />
      <HeroSection
        states={indiaStates}
        selectedState={selectedState}
        selectedCity={selectedCity}
        setSelectedState={(state) => {
          setSelectedState(state);
          setSelectedCity(null);
        }}
        setSelectedCity={setSelectedCity}
        loadCities={loadCities}
      />

      <main className="discovery-content results-page">
      <div className="results-content">
      {error && <div className="modern-alert container mt-4">{error}</div>}
      {loading && (
        <div className="loading-state container text-center py-5">
          <div className="modern-spinner" role="status" />
          <h3>Finding the best of {cityName}</h3>
          <p>Gathering places, stays and local flavours for you...</p>
        </div>
      )}

      <section className="stats-section count-summary">
        <div className="stat-item"><span className="stat-icon lavender"><Landmark size={20} /></span><div><h3>{places.length}</h3><p>Places to see</p></div></div>
        <div className="stat-divider" />
        <div className="stat-item"><span className="stat-icon sky"><Building2 size={20} /></span><div><h3>{hotels.length}</h3><p>Places to stay</p></div></div>
        <div className="stat-divider" />
        <div className="stat-item"><span className="stat-icon peach"><Coffee size={20} /></span><div><h3>{cafes.length}</h3><p>Places to eat</p></div></div>
        <div className="stat-divider" />
        <div className="stat-item"><span className="stat-icon mint"><Map size={20} /></span><div><h3>India</h3><p>Nationwide</p></div></div>
      </section>

      {!loading && !selectedCity && (
        <section className="empty-discovery container">
          <span className="empty-icon"><Map size={28} /></span>
          <span className="section-eyebrow">Your next story starts here</span>
          <h2>Choose a city to begin exploring</h2>
          <p>Search any Indian city above and we’ll surface attractions, hotels, cafés and restaurants nearby.</p>
        </section>
      )}

      {!loading && selectedCity && (
        <>
          <section className="places-section">
            <CardSection eyebrow="Popular destinations" title={`Most loved places in ${cityName}`} data={places} showPrice={false} />
          </section>
          <section className="hotel-section">
            <CardSection eyebrow="Top stays" title={`Handpicked stays in ${cityName}`} data={hotels} showPrice={false} />
          </section>
          <section className="cafe-section">
            <CardSection eyebrow="Local favourites" title={`Cafes and flavours in ${cityName}`} data={cafes} showPrice={false} />
          </section>
        </>
      )}

      <div className="container text-center text-muted small py-3">
        City data by GeoNames · Place data © OpenStreetMap contributors
      </div>
      </div>
      </main>

      <FooterSection />
    </>
  );
}

export default Home;
