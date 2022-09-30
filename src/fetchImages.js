import axios from 'axios';

// const BASE_URL = 'pixabay.com/api';
// const KEY = '30168156-67acd7ab620ceb0f9c67e2ca5';

const options = axios.create({
  baseURL: 'https://pixabay.com/api',
  params: {
    key: '30168156-67acd7ab620ceb0f9c67e2ca5',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  },
});
export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
  }

  async getImages() {
    const {
      data: { hits, totalHits },
      
    } = await options.get(`?q=${this.searchQuery}&page=${this.page}`);
    
    if (!hits.length) {
      throw new Error();
    }
    return [hits, totalHits];
  }
  
  get query() {
    return this.searchQuery;
  }
  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }
  incrementPage() {
    this.page += 1;
  }
  get hitsTotal() {
    return this.totalHits;
  }
  set hitsTotal(total) {
    this.totalHits = total;
  }
}
