import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { ArrowUpRight, Heart, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CardSection({ title, eyebrow = "Curated for you", data, showPrice = true }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(new Set());
  const toggleSaved = (id) => {
    setSaved((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openDetails = (item, id) => {
    const details = { ...item, category: eyebrow, showPrice };
    try {
      sessionStorage.setItem(`exploreplace-detail-${id}`, JSON.stringify(details));
      sessionStorage.setItem("exploreplace-results-scroll-y", String(window.scrollY));
      sessionStorage.setItem("exploreplace-returning-from-details", "true");
    } catch {
      // Navigation still works when browser storage is unavailable.
    }
    navigate(`/details/${encodeURIComponent(id)}`, { state: { item: details } });
  };

  return (
    <Container className="destination-container">
      <div className="section-header">
        <div><span className="section-eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      </div>
      <Row className="g-4">
        {data.map((item, index) => {
          const id = item.id || `${item.name}-${index}`;
          return (
            <Col xl={3} lg={4} md={6} xs={12} key={id}>
              <article
                className="travel-card clickable-card"
                role="link"
                tabIndex="0"
                onClick={() => openDetails(item, id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") openDetails(item, id);
                }}
              >
                <div className="travel-card-image">
                  <img src={item.image || "https://placehold.co/800x600?text=ExplorePlace"} alt={item.name} loading="lazy" />
                  <span className="type-badge">{item.description || "Explore"}</span>
                  {item.rating && <span className="rating-badge"><Star size={13} fill="currentColor" /> {item.rating}</span>}
                  <button className={`wishlist-btn${saved.has(id) ? " saved" : ""}`} onClick={(event) => { event.stopPropagation(); toggleSaved(id); }} aria-label="Save place">
                    <Heart size={18} fill={saved.has(id) ? "currentColor" : "none"} />
                  </button>
                  {showPrice && item.price && <div className="price-badge">₹{item.price}<small>/night</small></div>}
                </div>
                <div className="travel-card-body">
                  <h5>{item.name}</h5>
                  <div className="location"><MapPin size={15} /><span>{item.location || "View on OpenStreetMap"}</span></div>
                  {item.googleMapsUri && (
                    <a href={item.googleMapsUri} target="_blank" rel="noreferrer" className="card-action" onClick={(event) => event.stopPropagation()}>
                      View location <ArrowUpRight size={15} />
                    </a>
                  )}
                </div>
              </article>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default CardSection;
