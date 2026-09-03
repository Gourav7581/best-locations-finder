import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/LocationAdmin";
import PlaceAdmin from "./pages/PlaceAdmin";
import HotelAdmin from "./pages/HotelAdmin";
import RestroAdmin from "./pages/RestroAdmin";
import Details from "./pages/Details";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/locationadmin" element={<Admin />} />
        <Route path="/placeadmin" element={<PlaceAdmin />} />
        <Route path="/hoteladmin" element={<HotelAdmin />} />
        <Route path="/restroadmin" element={<RestroAdmin />} />
        <Route path="/details/:id" element={<Details />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
