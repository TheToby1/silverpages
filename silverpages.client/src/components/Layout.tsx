import Header from './nav/Header.tsx';
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { Row } from 'react-bootstrap';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div>
      <Header/>
      <Container>
        <Row>
          {children ?? <Outlet />}
        </Row>
      </Container>
    </div>
  );
}