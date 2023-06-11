
import axios from 'axios';

const KEY = '25984471-7a84e08c038d080117271d053';

axios.defaults.baseURL = 'https://pixabay.com/api';

export const fetchImages = async (q, per_page, page) => {
  try {
    const response = await axios.get(
      `/?key=${KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${per_page}&page=${page}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

