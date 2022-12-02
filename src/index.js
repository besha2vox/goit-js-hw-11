import { Notify } from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
// import InfiniteScroll from 'infinite-scroll';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { API } from './js/api';
import { cardTemplate } from './js/card-template';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

let api = null;

// let infScroll = new InfiniteScroll('.gallery', {
//   path: infiniteScroll,
//   append: '.post',
//   scrollThreshold: 100,
//   status: '.page-load-status',
// });

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();

  const query = e.target.searchQuery.value;
  if (api !== null && query === api.query && api.page === 1) return;

  api = new API(query);
  api.page = 1;

  fetchPhotos();
}

// function infiniteScroll() {
//   if (!api) return;
//   api.pageIncrement();
//   fetchPhotos();
// }

function fetchPhotos() {
  api
    .getPhotos()
    .then(resp => {
      if (resp.data.hits.length < 1) throw Error();
      render(resp.data);
    })
    .catch(error => {
      console.log(error);
      message(false);
    });
}

function render({ totalHits, hits }) {
  const template = hits.map(cardTemplate);
  if (api.page === 1) {
    message(totalHits);
    refs.gallery.innerHTML = template;
    return;
  }
  refs.gallery.insertAdjacentHTML('beforeend', template);
}

function message(params) {
  if (params) {
    Notify.info(`Hooray! We found ${params} images.`);
    return;
  }
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
