import axios from "axios";

export interface Author {
  authorId: string;
  authorName: string;
  biography: string;
}

export async function populateAuthors (setAuthor : React.Dispatch<React.SetStateAction<Author[]>>) {
  axios.get(`/api/Authors`).then(function (response) { setAuthor(response.data) })
}

