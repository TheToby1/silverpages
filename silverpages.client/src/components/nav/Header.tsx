import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">Silver Pages</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" role="navigation">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="Books">Books</Nav.Link>
                        <Nav.Link as={Link} to="Shelves">Shelves</Nav.Link>
                        <Nav.Link as={Link} to="OpenLibrary">Open Library</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title="Account" id="basic-nav-dropdown" className="d-flex">
                            <NavDropdown.Item as={Link} to="Login">Login</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="Account">My Account</NavDropdown.Item>
                            <NavDropdown.Divider />
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}