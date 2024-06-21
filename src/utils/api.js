import axios from "axios";

export const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const options = {
    params: {
        maxResults: 48,
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
    }
};

export const fetchFromAPI = async (url) => {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    console.log(data);
    return data;
}
