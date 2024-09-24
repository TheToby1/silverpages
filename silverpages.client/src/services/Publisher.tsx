import axios from "axios";

export interface Publisher {
  publisherId: string;
  publisherName: string;
}

export async function populatePublishers (setPublisher : React.Dispatch<React.SetStateAction<Publisher[]>>) {
  axios.get(`/api/Publishers`).then(function (response) { setPublisher(response.data) })
}

