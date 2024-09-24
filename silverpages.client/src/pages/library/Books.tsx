import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Table, Col, Row, Form, Pagination, Container, FormGroup, Button } from 'react-bootstrap';
import axios from 'axios';

import { ISimpleBook, PostableBook } from "./Book"
import { Genre, populateGenres } from "../../services/Genre"
import { Publisher, populatePublishers } from '../../services/Publisher';
import { Author, populateAuthors } from '../../services/Author';
import useHash from '../../services/useHash';

const API_URI = '/api/Books/filtered';

export default function Books() {
  const navigate = useNavigate();

  const [bookData, setBooks] = useState<{ count: number; data: ISimpleBook[] }>({ count: 0, data: [] });

  const [hash, setHash] = useHash();

  const [paginationDetails, setPagination] = useState<{ pageSize: number; position: number }>({ pageSize: 10, position: 1 });

  const [orderBy, setOrderBy] = useState('title');
  const [orderDir, setOrderDir] = useState('asc');

  const [authorFilter, setAuthorFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [publisherFilter, setPublisherFilter] = useState('');
  const [isbnSearch, setIsbnSearch] = useState('');
  const [titleSearch, setTitleSearch] = useState('');
  const [searchFilter, setSearchFilter] = useState<{ title: string, isbn: string }>({ title: '', isbn: '' });

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSearchFilter({ title: titleSearch, isbn: isbnSearch });
  }


  const [newBookTitle, setNewBookTitle] = useState('');
  const handleNewBook = async (event: FormEvent) => {
    event.preventDefault();
    const book : PostableBook = {title:newBookTitle};
    axios.post('/api/Books', book).then((response) => navigate(`/book/${response.data.bookId}`));
  }

  // Needs page refresh to update
  const [genres, setGenres] = useState<Genre[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);


  useEffect(() => {
    populateBooks();
  }, [paginationDetails, orderBy, orderDir, authorFilter, genreFilter, publisherFilter, searchFilter]);
  useEffect(() => {
    setPagination({
      pageSize: paginationDetails.pageSize,
      position: (hash === null || hash.match(/^ *$/) !== null) ? 1 : +hash.substring(1)
    });
  }, [hash])
  useEffect(() => {
    populateGenres(setGenres);
  }, []);
  useEffect(() => {
    populatePublishers(setPublishers);
  }, []);
  useEffect(() => {
    populateAuthors(setAuthors);
  }, []);
  // ToDo: Make these populate functions a generic

  return (

    <Container>
      <h1 id="tableLabel">Books</h1>
      <Row>
        <Col md={{ span: 2 }}>
          <Form>
            <Form.Label>Filter Options</Form.Label>
            <FormGroup>
              <FormGroup>
                <Form.Label>Author</Form.Label>
                <Form.Select aria-label="author" defaultValue={10} onChange={(e) => setAuthorFilter(e.currentTarget.value)}>
                  {populateDropdown(authors.map(a => { return { label: a.authorName, value: a.authorId } }))}
                </Form.Select>
              </FormGroup>
              <Form.Label>Genre</Form.Label>
              <Form.Select aria-label="genre" defaultValue={10} onChange={(e) => setGenreFilter(e.currentTarget.value)}>
                {populateDropdown(genres.map(a => { return { label: a.genre, value: a.genre } }))}
              </Form.Select>
            </FormGroup>

            <FormGroup>
              <Form.Label>Publisher</Form.Label>
              <Form.Select aria-label="publisher" defaultValue={10} onChange={(e) => setPublisherFilter(e.currentTarget.value)}>
                {populateDropdown(publishers.map(a => { return { label: a.publisherName, value: a.publisherId } }))}
              </Form.Select>
            </FormGroup>
          </Form>
          <Form onSubmit={handleSearchSubmit}>
            <Form.Label>Search Options</Form.Label>
            <FormGroup>
              <Form.Label>ISBN</Form.Label>
              <Form.Control id='isbnSearch' aria-label="isbnSearch" value={isbnSearch} onChange={(e) => setIsbnSearch(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Form.Label>Title</Form.Label>
              <Form.Control id='titleSearch' aria-label="titleSearch" value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} />
            </FormGroup>
            <Button variant="primary" type="submit">
              Search
            </Button>
            {/* Setting Both here might be causing a double refresh*/}
            <Button variant="primary" type="submit" onClick={() => { setIsbnSearch(''); setTitleSearch('') }}>
              Clear
            </Button>
          </Form>

          <Form onSubmit={handleNewBook}>
            <Form.Label>Create New Book</Form.Label>
            <FormGroup>
              <Form.Label>Title</Form.Label>
              <Form.Control id='newBookTitle' aria-label="title" value={newBookTitle} onChange={(e) => setNewBookTitle(e.target.value)} />
            </FormGroup>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Form>
        </Col>

        <Col>
          <Row>
            <Col>
              <FormGroup>
                <Form.Label>Select Page Size</Form.Label>
                {/* Setting Hash here is causing a double refresh but for now it fixes a bug */}
                <Form.Select aria-label="Page Size" defaultValue={10} onChange={(e) => { setPagination({ pageSize: +e.currentTarget.value, position: 1 }); setHash('1'); }}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </Form.Select>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Form.Label>Order By</Form.Label>
                <Form.Select aria-label="Order By" defaultValue="title" onChange={(e) => setOrderBy(e.currentTarget.value)}>
                  <option value="title">Title</option>
                  <option value="genre">Genre</option>
                  <option value="publishDate">Publish Date</option>
                </Form.Select>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Form.Label>Order Direction</Form.Label>
                <Form.Select aria-label="Order Direction" defaultValue={10} onChange={(e) => setOrderDir(e.currentTarget.value)}>
                  <option value='asc'>Ascending</option>
                  <option value='desc'>Descending</option>
                </Form.Select>
              </FormGroup>
            </Col>
          </Row>

          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Title</th>
                <th>Authors</th>
                <th>Genre</th>
                <th>Publish Date</th>
                <th>ISBN</th>
                <th>Publisher</th>
              </tr>
            </thead>
            <tbody>
              {bookData.data.map(book =>
                <tr key={book.bookId} onClick={() => navigate(`/book/${book.bookId}`)}>
                  <td>{book.title}</td>
                  <td>{book.authors.join(', ')}</td>
                  <td>{book.genre}</td>
                  <td>{book.publishDate.toString()}</td>
                  <td>{book.isbn}</td>
                  <td>{book.publisher}</td>
                </tr>
              )}
            </tbody>
          </Table>
          <Pagination className='justify-content-center'>
            {paginate()}
          </Pagination>
        </Col>
      </Row>

    </Container>
  );

  async function populateBooks() {
    // Build query string
    const params = new URLSearchParams({
      pageSize: `${paginationDetails.pageSize}`,
      position: `${paginationDetails.position - 1}`,
      orderBy: orderBy,
      orderDir: orderDir,
    });
    if (genreFilter) {
      params.append('genre', genreFilter);
    }
    if (authorFilter != '') {
      params.append('authorId', authorFilter);
    }
    if (publisherFilter) {
      params.append('publisherId', publisherFilter);
    }
    if (searchFilter.isbn) {
      params.append('isbn', searchFilter.isbn);
    }
    if (searchFilter.title) {
      params.append('title', searchFilter.title);
    }
    const uri = `${API_URI}?${params.toString()}`;
    axios.get(uri).then(function (response) { setBooks(response.data); });
  }

  // This function is horrible but it works for now. Should be out in a service and unit tested at least.
  function paginate(): JSX.Element[] {
    let items = [];
    const toShow = 5;
    const maxPos = Math.ceil(bookData.count / paginationDetails.pageSize);
    const position = paginationDetails.position;
    items.push(<Pagination.First disabled={position === 1} href='#1' />);
    items.push(<Pagination.Prev disabled={position === 1} href={`#${position - 1}`} />);
    if (position > Math.ceil(toShow / 2)) {
      items.push(<Pagination.Ellipsis />);
    }
    for (let curPos = Math.min(Math.max(position - 2, 1), Math.max(maxPos - toShow + 1, 1)), count = 0; curPos <= maxPos && count < toShow; curPos++, count++) {
      items.push(<Pagination.Item active={curPos === position} href={`#${curPos}`}>
        {curPos}
      </Pagination.Item>)
    }
    if (position < maxPos - Math.floor(toShow / 2)) {
      items.push(<Pagination.Ellipsis />);
    }
    items.push(<Pagination.Next disabled={position === maxPos} href={`#${position + 1}`} />);
    items.push(<Pagination.Last disabled={position === maxPos} href={`#${maxPos}`} />);
    return items;
  }

  function populateDropdown(options: { label: string; value: string }[]): JSX.Element[] {
    const items: JSX.Element[] = [];
    items.push(<option value=''></option>)
    options.forEach(o => {
      items.push(<option value={o.value}>{o.label}</option>)
    });

    return items;
  }
}