import axios from 'axios';

const host = 'https://tools.texoit.com/backend-java/api/movies';
const api = axios.create({ baseURL: host });

export default api;
