import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import ApiService from './fetchImages.js';
import { marcupImageCard } from './marcup';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;

const refs = {
  form: document.querySelector('#search-form'),
  imageCard: document.querySelector('.gallery'),
  // loadMoreBTN: document.querySelector('.load-more'),
  box: document.querySelector('.box'),
};

refs.form.addEventListener('submit', onFormSubmit);
// refs.loadMoreBTN.addEventListener('click', onloadMoreClick);
const apiPhotoService = new ApiService();

const lightBox = new SimpleLightbox('.gallery a', {
  caotions: true,
  captionDelay: 250,
  captionPosition: 'bottom',
  captionsData: 'alt',
  overlayOpacity: '1',
  doubleTapZoom: '2',
});

let imagesValue = 0;

export async function onFormSubmit(e) {
  e.preventDefault();

  const searchQuery = e.currentTarget.elements.searchQuery.value;

  apiPhotoService.query = searchQuery;
  apiPhotoService.page = 1;
  try {
    const [images, total] = await apiPhotoService.getImages();
    refs.imageCard.innerHTML = marcupImageCard(images);
    lightBox.refresh();
    apiPhotoService.hitsTotal = total;
    createObserver();
    imagesValue += images.length;
  } catch (error) {
    Notiflix.Notify.failure(
      `❌ Sorry, there are no images matching your search query. Please try again.`
    );
    // Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  }
}

async function onloadMoreClick() {
  apiPhotoService.incrementPage();
  if (imagesValue >= apiPhotoService.hitsTotal) {
    Notiflix.Notify.warning(
      `❌ We're sorry, but you've reached the end of search results.`
    );

    return;
  }
  const [images, total] = await apiPhotoService.getImages();
  refs.imageCard.insertAdjacentHTML('beforeend', marcupImageCard(images));
  lightBox.refresh();
  imagesValue += images.length;
  Notiflix.Notify.info(`Hooray! We found ${total} images.`);
}

function createObserver() {
  let options = {
    root: null,
    rootMargin: '100px',
  };
  const observer = new IntersectionObserver(onloadMoreClick, options);
  observer.observe(refs.box);
}
