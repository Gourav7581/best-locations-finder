import { Container, Button } from "react-bootstrap";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCity, FaSearch } from "react-icons/fa";

function HeroSection({ states, selectedState, selectedCity, setSelectedState, setSelectedCity, loadCities }) {
  const stateOptions = states.map((state) => ({ value: state, label: state }));
  const selectStyles = {
    control: (base) => ({ ...base, border: "none", boxShadow: "none", background: "transparent", minHeight: 34, cursor: "pointer" }),
    valueContainer: (base) => ({ ...base, padding: 0 }),
    input: (base) => ({ ...base, color: "#172033", margin: 0 }),
    placeholder: (base) => ({ ...base, color: "#8b94a7", fontWeight: 500, fontSize: 15 }),
    singleValue: (base) => ({ ...base, color: "#172033", fontWeight: 700, fontSize: 15 }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({ ...base, color: "#8b94a7", padding: 4 }),
    menu: (base) => ({ ...base, zIndex: 9999, borderRadius: 16, overflow: "hidden", border: "1px solid #e6e9f0", boxShadow: "0 20px 50px rgba(20,30,55,.16)" }),
    option: (base, state) => ({ ...base, padding: "12px 16px", background: state.isSelected ? "#5b5bd6" : state.isFocused ? "#f0f0ff" : "#fff", color: state.isSelected ? "#fff" : "#172033", cursor: "pointer", fontWeight: 600 }),
  };
  const portalStyles = { ...selectStyles, menuPortal: (base) => ({ ...base, zIndex: 99999 }) };

  return (
    <section className="hero-section">
      <div className="overlay" />
      <Container>
        <motion.div className="hero-content" initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="hero-text">
            <h1>Find places worth<br /><span>exploring</span></h1>
            <p>Discover the best places to visit, stay, eat and experience<br className="d-none d-md-block" /> handpicked for you.</p>
          </div>
          <div className="booking-search-bar">
            <div className="search-item">
              <span className="search-icon-box"><FaMapMarkerAlt /></span>
              <div className="search-field-wrap">
                <span className="field-label">State</span>
                <Select options={stateOptions} placeholder="Select state" value={stateOptions.find((item) => item.value === selectedState)} onChange={(selected) => setSelectedState(selected?.value || "")} menuPortalTarget={document.body} menuPosition="fixed" styles={portalStyles} />
              </div>
            </div>
            <div className="divider" />
            <div className="search-item">
              <span className="search-icon-box coral"><FaCity /></span>
              <div className="search-field-wrap">
                <span className="field-label">City</span>
                <AsyncSelect key={selectedState} cacheOptions loadOptions={loadCities} isDisabled={!selectedState} placeholder="Select city" noOptionsMessage={({ inputValue }) => inputValue.length < 2 ? "Type at least 2 letters" : "No Indian city found"} value={selectedCity} onChange={setSelectedCity} menuPortalTarget={document.body} menuPosition="fixed" styles={portalStyles} />
              </div>
            </div>
            <Button className="search-btn" disabled={!selectedCity} onClick={() => document.querySelector(".discovery-content")?.scrollIntoView({ behavior: "smooth" })}>
              <FaSearch /> Explore
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default HeroSection;
