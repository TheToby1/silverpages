import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookItemObject } from './BookItem';
import { Table } from 'react-bootstrap';

export interface ShelfObject {
  shelfName: string;
  shelfDescription: string;
  books: BookItemObject[];
}

export function Shelf() {
  const { shelfName } = useParams();
  const [shelf, setShelf] = useState<ShelfObject>();
  const navigate = useNavigate();

  useEffect(() => {
    populateShelf();
  }, []);

  const contents = shelf === undefined
    ? <p> Loading.... </p>
    : <div>
      <p>{shelf.shelfName}</p>
      <p>{shelf.shelfDescription}</p>
      <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Tags</th>
                </tr>
            </thead>
            <tbody>
                {shelf.books.map(book =>
                    <tr key={book.bookId} onClick={() => navigate(`/book/${book.bookId}`)}>
                        <td>{book.bookId}</td>
                        <td>{book.tags}</td>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>

  return (
    <div>
      {contents}
    </div>
  );

  async function populateShelf() {
    const response = await fetch(`/api/Shelves/${shelfName}`);
    const data = await response.json();
    setShelf(data);
  }
}