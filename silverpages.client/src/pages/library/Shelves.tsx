import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from 'react-bootstrap';
import { ShelfObject } from './Shelf';
import axios from 'axios';

export default function Shelves() {
  const [shelves, setShelves] = useState<ShelfObject[]>();
  const navigate = useNavigate();
  const [newShelfName, setNewShelfName] = useState('');

  useEffect(() => {
    populateShelves();
  }, []);

  const contents = shelves === undefined
    ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
    : <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Number of Books</th>
        </tr>
      </thead>
      <tbody>
        {shelves.map(shelf =>
          <tr key={shelf.shelfName} onClick={() => navigate(`/shelf/${shelf.shelfName}`)}>
            <td>{shelf.shelfName}</td>
            <td>{shelf.books ? shelf.books.length : 0}</td>
          </tr>
        )}
      </tbody>
    </Table>;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const newShelf = await createShelf(newShelfName);
      navigate(`/shelf/${newShelf.shelfName}`);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1 id="tableLabel">Shelves</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formShelf">
          <Form.Label>Shelf Name</Form.Label>
          <Form.Control
            placeholder="Name"
            aria-label="Shelf Name"
            aria-describedby="basic-addon1"
            value={newShelfName}
            onChange={(e) => setNewShelfName(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
      {contents}
    </div>
  );

  async function populateShelves() {
    axios.get('/api/Shelves').then(function (response) { setShelves(response.data) });
  }

  async function createShelf(ShelfName: string): Promise<ShelfObject> {
    return axios.post(`/api/Shelves`, { ShelfName }).then(function (response) { return response.data });
  };
}