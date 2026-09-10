import { useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
  const API_URL = process.env.REACT_APP_API_URL;

function LocationAdmin() {
  const [stateName, setStateName] = useState("");
  const [cities, setCities] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cityArray = cities
        .split(",")
        .map((city) => city.trim())
        .filter((city) => city !== "");
console.log(stateName,cityArray)
      const response = await axios.post(
        `${API_URL}/api/location/create`,
        {
          state: stateName,
          cities: cityArray,
        }
      );

      setMessage("Location Added Successfully");
              setTimeout(() => {
      setMessage("");
    }, 3000);
      setStateName("");
      setCities("");

      console.log(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message 
      );
       setTimeout(() => {
      setMessage("");
    }, 3000)
      console.log('can not enter data',error.response?.data?.message)
    }
  };

  return (
    <Container className="py-5">
      <Card
        className="shadow-lg border-0"
        style={{
          maxWidth: "700px",
          margin: "auto",
        }}
      >
        <Card.Body className="p-4">
          <h2 className="fw-bold mb-4 text-center">
            Add Location
          </h2>

          {message && (
            <Alert variant="info">
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                State Name
              </Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter State"
                value={stateName}
                onChange={(e) =>
                  setStateName(e.target.value)
                }
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                Cities
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Jaipur, Jodhpur, Udaipur, Ajmer"
                value={cities}
                onChange={(e) =>
                  setCities(e.target.value)
                }
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
            >
              Save Location
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LocationAdmin;