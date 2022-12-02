import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { API } from './js/api';
import { cardTemplate } from './js/card-template';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

let api = null;
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMoreClick);

async function onFormSubmit(e) {
  e.preventDefault();

  const query = e.target.searchQuery.value;
  if (api !== null && query === api.query && api.page === 1) return;

  api = new API(query);
  api.page = 1;

  const data = await createData();
  render(data);

  lightbox.refresh();
}

//* Fetch

async function createData() {
  try {
    return await fetchPhotos();
  } catch (error) {
    console.log(error.message);
  }
}

async function fetchPhotos() {
  return await api
    .getPhotos()
    .then(async resp => {
      const data = await resp.data;
      if (data.hits.length < 1) throw Error();

      return data;
    })
    .catch(error => {
      console.log(error);
      message(false);
    });
}

//* Render

function render({ totalHits, hits }) {
  const template = hits.map(cardTemplate);
  if (api.page === 1) {
    message(totalHits);
    refs.gallery.innerHTML = template;
    return;
  }
  refs.gallery.insertAdjacentHTML('beforeend', template);
}

//* message

function message(params) {
  if (params) {
    Notify.info(`Hooray! We found ${params} images.`);
    return;
  }
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

//* infinity scroll

// const options = {
//   root: document.body,
//   rootMargin: '-30px',
//   threshold: 1.0,
// };

// function onInfiniteScroll() {
//   if (!api) return;
//   api.pageIncrement();
//   fetchPhotos();
// }

// function infiniteScroll() {
//   const observer = new IntersectionObserver(onInfiniteScroll, options);
//   observer.observe(refs.loadMore);
// }
