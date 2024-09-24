import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, Col, Row, Form, Container, FormGroup, Button } from 'react-bootstrap';
import axios from 'axios';

import { OpenLibraryPostableBook, PuttableBook } from "./Book"

interface IOpenLibraryBook {
  title: string,
  author_name: string,
  isbns: string[],
  publishers: string[]
}

const API_URI = 'https://openlibrary.org/search.json';

export default function OpenLibraryBooks() {
  const navigate = useNavigate();
  const [bookData, setBooks] = useState<{ count: number; data: IOpenLibraryBook[] }>({ count: 0, data: [] });
  const [titleSearch, setTitleSearch] = useState('');
  const [searchFilter, setSearchFilter] = useState<{ title: string }>({ title: '' });

  const handleCreate = async (book : IOpenLibraryBook) => {
    const newBook : OpenLibraryPostableBook = {
      title: book.title,
      authorName: book.author_name,
      publisherName: book.publishers[0],
      isbn: book.isbns[0]};
      axios.post('/api/Books/OpenLibrary', book).then((response) => navigate(`/book/${response.data.bookId}`));
  }

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    setSearchFilter({ title: titleSearch });
  }

  useEffect(() => {
    populateBooks();
  }, [searchFilter]);

  return (

    <Container>
      <h1 id="tableLabel">Books</h1>
      <Row>
        <Col>
          <Row>
            <Form onSubmit={handleSearch}>

              <Row>
                <FormGroup>
                  <Col>
                    <Form.Label>Select Page Size</Form.Label>
                  </Col>
                  <Col>
                    <Form.Control defaultValue='' value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} />
                  </Col>
                </FormGroup>
                <Col>
                  <Button type='submit'>
                    Search
                  </Button>
                </Col>


              </Row>

            </Form>
          </Row>

          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Authors</th>
                <th>ISBN</th>
                <th>Publisher</th>
                <th>Create</th>
              </tr>
            </thead>
            <tbody>
              {bookData.data.map(book =>
              // This is weird handle
                <tr key={book.isbns[0]} onClick={() => handleCreate(book)}>
                  <td>{book.title}</td>
                  <td>{book.author_name}</td>
                  <td>{book.isbns[0]}</td>
                  <td>{book.publishers[0]}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

    </Container>
  );

  async function populateBooks() {
    // Build query string
    if(!searchFilter.title)
    {
      return;
    }

    const params = new URLSearchParams({
      title: `${searchFilter.title}`,
    });
    const uri = `${API_URI}?${params.toString()}`
    axios.get(uri).then(function (response) { setBooks(response.data); });
  }
}