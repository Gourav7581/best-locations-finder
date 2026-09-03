import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import NavbarSection from "../Components/NavbarSection";
import FooterSection from "../Components/FooterSection";

function Contact() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <>
      <NavbarSection />
      <main className="contact-page">
        <section className="inner-hero contact-modern-hero">
          <div className="inner-hero-orb orb-one" /><div className="inner-hero-orb orb-two" />
          <div className="container position-relative">
            <span className="page-kicker"><Sparkles size={14} /> Let’s talk</span>
            <h1>We’d love to hear<br /><em>what you’re planning.</em></h1>
            <p>Questions, feedback, missing places or a travel idea? Send a note and help us make ExplorePlace more useful.</p>
          </div>
        </section>

        <section className="contact-modern-section">
          <div className="container">
            <div className="row g-4 g-lg-5">
              <div className="col-lg-5">
                <span className="section-eyebrow">Get in touch</span>
                <h2 className="modern-section-title">A real conversation starts here.</h2>
                <p className="contact-intro">Whether you found an incorrect listing, have a feature idea or simply want to say hello—we’re listening.</p>
                <div className="contact-methods">
                  <a href="mailto:grprem75@gmail.com" className="contact-method"><span className="contact-method-icon violet"><Mail /></span><div><small>Email us</small><strong>info@exploreplace.com</strong></div><ArrowRight size={17} /></a>
                  <a href="tel:+919571070183" className="contact-method"><span className="contact-method-icon coral"><Phone /></span><div><small>Call us</small><strong>+91 98765 43210</strong></div><ArrowRight size={17} /></a>
                  <a href="https://www.openstreetmap.org/search?query=Udaipur%20Rajasthan" target="_blank" rel="noreferrer" className="contact-method"><span className="contact-method-icon blue"><MapPin /></span><div><small>Find us</small><strong>Udaipur, Rajasthan</strong></div><ArrowRight size={17} /></a>
                </div>
                <div className="response-note"><Clock3 size={19} /><div><strong>We usually reply within 1–2 working days.</strong><span>Monday to Friday · 10:00 AM–6:00 PM IST</span></div></div>
              </div>

              <div className="col-lg-7">
                <div className="modern-contact-card">
                  <div className="form-heading"><span className="form-heading-icon"><MessageCircle /></span><div><h3>Send us a message</h3><p>Tell us how we can help.</p></div></div>
                  {sent && <div className="form-success"><CheckCircle2 size={19} /><div><strong>Message captured!</strong><span>This demo currently stores no messages; connect a backend endpoint before production.</span></div></div>}
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6"><label>Your name</label><input required type="text" placeholder="Gourav Sharma" /></div>
                      <div className="col-md-6"><label>Email address</label><input required type="email" placeholder="you@example.com" /></div>
                      <div className="col-12"><label>What is this about?</label><select defaultValue=""><option value="" disabled>Choose a topic</option><option>General question</option><option>Suggest a place</option><option>Report incorrect information</option><option>Partnership</option><option>Other</option></select></div>
                      <div className="col-12"><label>Your message</label><textarea required rows="6" placeholder="Write your message here..." /></div>
                      <div className="col-12"><button type="submit" className="form-submit-btn">Send message <Send size={17} /></button></div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-map-banner">
          <div className="container"><div className="map-banner-inner"><div className="map-pin-pulse"><MapPin /></div><div><span className="section-eyebrow">Our home</span><h2>Inspired by the city of lakes.</h2><p>ExplorePlace is imagined in Udaipur and built for travellers across India.</p></div><a href="https://www.openstreetmap.org/search?query=Udaipur%20Rajasthan" target="_blank" rel="noreferrer">Open map <ArrowRight size={17} /></a></div></div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}

export default Contact;
