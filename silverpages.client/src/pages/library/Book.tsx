import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Form, Container, FormGroup, Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Publisher, populatePublishers } from '../../services/Publisher';
import { Author, populateAuthors } from '../../services/Author';

export interface ISimpleBook {
    bookId: string;
    title: string;
    authors: string[];
    genre: string;
    publisher: string;
    publishDate: Date;
    isbn: string;
}

export interface IBook {
    bookId: string;
    title: string;
    authors: Author[] | null;
    description: string;
    genre: string;
    publisher: Publisher | null;
    publishDate: Date;
    isbn: string;
}

export interface PostableBook {
    title: string;
}

export interface OpenLibraryPostableBook {
    title: string;
    authorName: string;
    publisherName: string;
    isbn: string;
}

export interface PuttableBook {
    bookId: string;
    title: string;
    authorNames: string[];
    description: string;
    genre: string;
    publisherName: string;
    publishDate: string;
    isbn: string;
}

export function Book() {
    const { bookId } = useParams();
    const [book, setBook] = useState<IBook>();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            title: { value: string };
            authors: { value: string };
            genre: { value: string };
            publisher: { value: string };
            publishDate: { value: string };
            isbn: { value: string }; 
            description: { value: string };
          };
        // ToDo: Add validation
        const putBook : PuttableBook = {
            bookId: bookId!, 
            title: target.title.value,
            // ToDo: Make this nicer
            authorNames: target.authors.value.split(', '),
            genre: target.genre.value,
            publisherName: target.publisher.value,
            publishDate: target.publishDate.value,
            isbn: target.isbn.value,
            description: target.description.value};
        axios.put(`/api/Books/${bookId}`, putBook).then(() => populateBook());
    };

    useEffect(() => {
        populateBook();
    }, []);

    // Todo: For Publisher and Authors I'd rather have populated dropdowns and a pop up for creating a new author/publisher
    const contents = book === undefined
        ? <p> Loading.... </p>
        : <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" defaultValue={book.title} />
            </FormGroup>
            <FormGroup>
                <Form.Label>Authors</Form.Label>
                <Form.Control name="authors" defaultValue={book.authors?.map(a => a.authorName).join(', ')} />
            </FormGroup>
            <FormGroup>
                <Form.Label>Genre</Form.Label>
                <Form.Control name="genre" defaultValue={book.genre} />
            </FormGroup>
            <FormGroup>
                <Form.Label>Publisher</Form.Label>
                <Form.Control name="publisher" defaultValue={book.publisher?.publisherName} />
            </FormGroup>
            <FormGroup>
                <Form.Label>PublishDate</Form.Label>
                <Form.Control name="publishDate" defaultValue={book.publishDate.toString()} />
            </FormGroup>
            <FormGroup>
                <Form.Label>isbn</Form.Label>
                <Form.Control name="isbn" defaultValue={book.isbn} />
            </FormGroup>
            <FormGroup>
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" defaultValue={book.description} />
            </FormGroup>
            <Button type='submit'>
                Save
            </Button>
        </Form>

    return (
        <Container>
            {contents}
        </Container>
    );

    async function populateBook() {
        axios.get(`/api/Books/${bookId}`).then(function (response) { setBook(response.data) })
    }
}