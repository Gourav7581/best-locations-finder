import { Link } from "react-router-dom";
import { ArrowRight, Building2, Coffee, Compass, Database, Heart, Landmark, Map, Search, Sparkles } from "lucide-react";
import NavbarSection from "../Components/NavbarSection";
import FooterSection from "../Components/FooterSection";

function About() {
  return (
    <>
      <NavbarSection />
      <main className="about-page">
        <section className="inner-hero about-modern-hero">
          <div className="inner-hero-orb orb-one" /><div className="inner-hero-orb orb-two" />
          <div className="container position-relative">
            <span className="page-kicker"><Sparkles size={14} /> Our story</span>
            <h1>Making India feel a little<br /><em>closer to explore.</em></h1>
            <p>ExplorePlace brings attractions, stays and local food into one calm, inspiring place—so your next journey starts with curiosity, not endless tabs.</p>
            <div className="hero-mini-stats">
              <div><strong>36</strong><span>States & territories</span></div>
              <div><strong>3</strong><span>Discovery categories</span></div>
              <div><strong>₹0</strong><span>Cost to explore</span></div>
            </div>
          </div>
        </section>

        <section className="story-section">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="story-collage">
                  <img className="story-image-main" src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1100&q=85" alt="Taj Mahal in India" />
                  <div className="story-float-card"><span><Heart size={18} fill="currentColor" /></span><div><strong>Made for discovery</strong><small>Every city has a story</small></div></div>
                  <div className="story-pattern" />
                </div>
              </div>
              <div className="col-lg-6">
                <span className="section-eyebrow">Why we exist</span>
                <h2 className="modern-section-title">Travel planning should feel exciting—not exhausting.</h2>
                <p className="story-copy">India is full of remarkable places, from celebrated landmarks to a neighbourhood café worth remembering. Finding them should be simple.</p>
                <p className="story-copy">ExplorePlace uses open geographic data to help travellers discover what to see, where to stay and what to eat in cities across the country.</p>
                <div className="story-points">
                  <div><Search size={19} /><span><strong>Simple discovery</strong><small>State and city-based exploration</small></span></div>
                  <div><Database size={19} /><span><strong>Open-data powered</strong><small>GeoNames and OpenStreetMap</small></span></div>
                  <div><Compass size={19} /><span><strong>Built for India</strong><small>From major cities to smaller towns</small></span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-value-section">
          <div className="container">
            <div className="center-heading"><span className="section-eyebrow">Everything in one place</span><h2 className="modern-section-title">A better way to find your way</h2><p>Less searching. More discovering.</p></div>
            <div className="row g-4">
              <div className="col-md-4"><div className="value-card"><span className="value-icon violet"><Landmark /></span><span className="value-number">01</span><h3>See what matters</h3><p>Find museums, landmarks, viewpoints and attractions around your selected city.</p></div></div>
              <div className="col-md-4"><div className="value-card"><span className="value-icon blue"><Building2 /></span><span className="value-number">02</span><h3>Stay with confidence</h3><p>Explore hotels, guest houses, hostels and resorts close to where you want to be.</p></div></div>
              <div className="col-md-4"><div className="value-card"><span className="value-icon coral"><Coffee /></span><span className="value-number">03</span><h3>Taste something local</h3><p>Discover restaurants, cafés and local food spots that give each city its flavour.</p></div></div>
            </div>
          </div>
        </section>

        <section className="about-data-strip">
          <div className="container">
            <div className="data-strip-inner"><span className="data-strip-icon"><Map /></span><div><span className="section-eyebrow">Open by design</span><h2>Discovery powered by community data.</h2><p>Location information comes from GeoNames and OpenStreetMap contributors around the world.</p></div><a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer">Learn about the data <ArrowRight size={17} /></a></div>
          </div>
        </section>

        <section className="modern-cta">
          <div className="container text-center"><span className="page-kicker"><Compass size={14} /> Ready when you are</span><h2>Where will curiosity take you next?</h2><p>Choose a city and start building your next memorable day.</p><Link to="/" className="primary-pill-btn">Start exploring <ArrowRight size={17} /></Link></div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}

export default About;
