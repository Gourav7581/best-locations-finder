import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Building2, Clock3, Globe, Mail, MapPin, Phone, Star, Users } from "lucide-react";
import NavbarSection from "../Components/NavbarSection";
import FooterSection from "../Components/FooterSection";

function Details() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const storedItem = sessionStorage.getItem(`exploreplace-detail-${id}`);
  const item = location.state?.item || (storedItem ? JSON.parse(storedItem) : null);

  const extraDetails = item ? [
    ["Opening hours", item.openingHours],
    ["Phone", item.phone],
    ["Email", item.email],
    ["Entry fee", item.fee],
    ["Wheelchair access", item.wheelchair],
    ["Operator", item.operator],
    ["Heritage", item.heritage],
    ["Hotel stars", item.stars],
    ["Rooms", item.rooms],
    ["Cuisine", item.cuisine],
    ["Outdoor seating", item.outdoorSeating],
    ["Takeaway", item.takeaway],
    ["Delivery", item.delivery],
    ["Internet access", item.internetAccess],
    ["Latitude", item.latitude],
    ["Longitude", item.longitude],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "") : [];

  const googleMapsUrl = item
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        [item.name, item.address || item.location].filter(Boolean).join(", ")
      )}`
    : null;

  if (!item) {
    return (
      <>
        <NavbarSection />
        <main className="detail-missing">
          <h1>Place details unavailable</h1>
          <p>Please return to Explore and select a card again.</p>
          <button onClick={() => navigate("/")}><ArrowLeft size={17} /> Back to Explore</button>
        </main>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <NavbarSection />
      <main className="detail-page">
        <section className="detail-hero" style={{ backgroundImage: `linear-gradient(180deg,rgba(9,18,33,.18),rgba(9,18,33,.78)), url("${item.image}")` }}>
          <div className="container detail-hero-content">
            <button className="detail-back" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>
            <span className="detail-category">{item.category || "ExplorePlace discovery"}</span>
            <h1>{item.name}</h1>
            <p><MapPin size={18} /> {item.location || "Location available on map"}</p>
          </div>
        </section>

        <section className="detail-content container">
          <div className="detail-main-card">
            <span className="section-eyebrow">About this place</span>
            <h2>Everything you need to know</h2>
            <p className="detail-description">{item.about || `${item.name} is one of the discoveries available around your selected city. Open its map location to plan your visit and explore the surrounding area.`}</p>

            <div className="detail-facts">
              <div><span><Star size={20} /></span><small>Rating</small><strong>{item.rating || "Not rated"}</strong></div>
              <div><span><Users size={20} /></span><small>Reviews</small><strong>{item.userRatingCount || "No reviews"}</strong></div>
              <div><span><Building2 size={20} /></span><small>Type</small><strong>{item.description || "Destination"}</strong></div>
              {item.price && <div><span>₹</span><small>Price</small><strong>₹{item.price}</strong></div>}
            </div>

            {extraDetails.length > 0 && (
              <div className="available-details">
                <h3>Available information</h3>
                <div className="available-details-grid">
                  {extraDetails.map(([label, value]) => (
                    <div key={label}><small>{label}</small><strong>{String(value)}</strong></div>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-links">
              {item.website && <a href={item.website} target="_blank" rel="noreferrer"><Globe size={17} /> Official website</a>}
              {item.phone && <a href={`tel:${item.phone}`}><Phone size={17} /> Call</a>}
              {item.email && <a href={`mailto:${item.email}`}><Mail size={17} /> Email</a>}
              {item.wikipedia && <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(item.wikipedia.replace(/^\w+:/, "").replaceAll(" ", "_"))}`} target="_blank" rel="noreferrer"><Building2 size={17} /> Wikipedia</a>}
              {item.wikidata && <a href={`https://www.wikidata.org/wiki/${item.wikidata}`} target="_blank" rel="noreferrer"><ArrowUpRight size={17} /> Wikidata</a>}
            </div>
          </div>

          <aside className="detail-side-card">
            <img src={item.image} alt={item.name} />
            <div>
              <h3>Plan your visit</h3>
              {item.openingHours && <p className="visit-hours"><Clock3 size={16} /> {item.openingHours}</p>}
              <p>View the exact location and directions before starting your journey.</p>
              <a href={googleMapsUrl} target="_blank" rel="noreferrer">View on Google Maps <ArrowUpRight size={17} /></a>
            </div>
          </aside>
        </section>
      </main>
      <FooterSection />
    </>
  );
}

export default Details;
