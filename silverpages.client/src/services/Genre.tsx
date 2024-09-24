import axios from "axios";

export interface Genre {
  genre: string;
}

export async function populateGenres (setGenre : React.Dispatch<React.SetStateAction<Genre[]>>) {
  axios.get(`/api/BookGenres`).then(function (response) { setGenre(response.data) });
}

