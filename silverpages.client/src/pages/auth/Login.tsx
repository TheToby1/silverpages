import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FormEvent, useState } from "react";
import axios from 'axios';
import './Login.css';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{[key:string]:any}>({});
  // const { userInfo } = useSelector((state) => state.userLogin);

  const validateForm = () => {
    const newErrors:{[key:string]:any} = {};
    if (!email) newErrors.email = 'email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      console.log('Login attempted with:', { email, password });

      try {
        const userData = await login(email, password);
        console.log('Login successful:', userData);
        // Here you would typically store the user data and redirect
      } catch (error) {
        setErrors({ form: 'Login failed. Please try again.' });
      }
    }
  };

  return (
    <Container className="login-wrapper">
      <Row className="justify-content-md-center">
        <Col md="auto" className="login-form-container">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                aria-label="Email"
                value={email}
                aria-describedby="basic-addon1"
                isInvalid={!!errors.email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                isInvalid={!!errors.password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );

  async function login(email: string, password: string) {
    try {
      const response = await axios.post(`/api/login?useCookies=true`, { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}