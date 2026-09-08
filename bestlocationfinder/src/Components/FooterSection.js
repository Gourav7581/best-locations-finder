import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

function FooterSection() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4">
            <h3 className="footer-logo">Explore<span style={{ color: "#8f8ff5" }}>Place</span></h3>
            <p className="footer-text">Thoughtful travel discovery for curious people exploring the many stories, flavours and landscapes of India.</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>
          <div className="col-lg-2 col-md-4">
            <h5>Discover</h5>
            <ul className="footer-links">
              <li><Link to="/">Explore</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer">OpenStreetMap</a></li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-4">
            <h5>Resources</h5>
            <ul className="footer-links"><li>Travel guide</li><li>Saved places</li><li>Privacy policy</li><li>Terms</li></ul>
          </div>
          <div className="col-lg-4 col-md-4">
            <h5>Say hello</h5>
            <div className="contact-item"><FaMapMarkerAlt /><span>Udaipur, Rajasthan, India</span></div>
            <div className="contact-item"><FaEnvelope /><span>info@exploreplace.com</span></div>
            <div className="contact-item"><FaPhone /><span>+91 98765 43210</span></div>
          </div>
        </div>
        <hr />
        <div className="footer-bottom">© 2026 ExplorePlace. Built for curious travellers across India.</div>
      </div>
    </footer>
  );
}

export default FooterSection;
