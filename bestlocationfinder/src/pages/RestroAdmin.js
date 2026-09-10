import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
  const API_URL = process.env.REACT_APP_API_URL;

function RestroAdmin() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  // ================= GET STATES =================
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/location/states`
        );

        const stateList = res.data.map((item) => item.state);
        setStates(stateList);
      } catch (err) {
        console.log(err);
      }
    };

    fetchStates();
  }, []);

  // ================= GET CITIES =================
  useEffect(() => {
    if (!state) return;

    const fetchCities = async () => {
      try {
        const res = await axios.get(
           `${API_URL}/api/location/cities/${state}`
        );

        setCities(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCities();
  }, [state]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT RESTRO =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("state", state);
      formData.append("city", city);
      formData.append("name", form.name);
      formData.append("location", form.location);
      formData.append("description", form.description);
      formData.append("image", image);

      await axios.post(
        `http://${API_URL}/api/data/cafe`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Restaurant Created Successfully 🍽️");

      setForm({
        name: "",
        location: "",
        description: "",
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
        <h3 className="mb-3">Create Restaurant / Cafe</h3>

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
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Restaurant name"
            />
          </Form.Group>

          {/* LOCATION */}
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Restaurant location"
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

          {/* IMAGE */}
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          <Button type="submit" className="w-100">
            Create Restaurant
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default RestroAdmin;