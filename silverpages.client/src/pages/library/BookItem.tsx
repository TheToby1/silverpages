import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export interface BookItemObject {
    bookId: string;
    shelfName: string;
    note: string;
    tags: string[];
}

export function BookItem() {
    const { bookItemId } = useParams();
    const [bookItem, setBookItem] = useState<BookItemObject>();
    const navigate = useNavigate();

    useEffect(() => {
        populateBookItem();
    }, []);

    const contents = bookItem === undefined
        ? <p> Loading.... </p>
        : <div>
            <p onClick={() => navigate(`/book/${bookItem.bookId}`)}>{bookItem.bookId}</p>
            <p>{bookItem.note}</p>
            <p>{bookItem.tags}</p>
        </div>

    return (
        <div>
            <h1>BookItem</h1>
            {contents}
        </div>
    );

    async function populateBookItem() {
        const response = await fetch(`/api/Books/${bookItemId}`);
        const data = await response.json();
        setBookItem(data);
    }
}