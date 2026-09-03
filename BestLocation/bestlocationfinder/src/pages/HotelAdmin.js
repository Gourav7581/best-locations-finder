import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

function HotelAdmin() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ GET STATES
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/location/states"
        );

        const stateList = res.data.map((item) => item.state);
        setStates(stateList);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStates();
  }, []);

  // ✅ GET CITIES BY STATE
  useEffect(() => {
    if (!state) return;

    const fetchCities = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/location/cities/${state}`
        );

        setCities(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCities();
  }, [state]);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ SUBMIT HOTEL
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("state", state);
      formData.append("city", city);
      formData.append("name", form.name);
      formData.append("location", form.location);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:5000/api/data/hotel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
        console.log(res)
      setMessage("Hotel Created Successfully 🚀");

      setForm({
        name: "",
        location: "",
        description: "",
        price: "",
      });

      setState("");
      setCity("");
      setImage(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <Container className="py-5">
      <Card className="p-4 shadow-lg">
        <h3 className="mb-3">Create Hotel</h3>

        {message && <Alert>{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* STATE */}
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Select
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* CITY */}
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Select
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* NAME */}
          <Form.Group className="mb-3">
            <Form.Label>Hotel Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Hotel name"
            />
          </Form.Group>

          {/* LOCATION */}
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Hotel location"
            />
          </Form.Group>

          {/* DESCRIPTION */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Form.Group>

          {/* PRICE */}
          <Form.Group className="mb-3">
            <Form.Label>Price per night</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </Form.Group>

          {/* IMAGE */}
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Button type="submit" className="w-100">
            Create Hotel
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default HotelAdmin;