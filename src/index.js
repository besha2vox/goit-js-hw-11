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

//* SUBMIT FORM>-----------------------

async function onFormSubmit(e) {
  e.preventDefault();
  loadingVisible();

  const query = e.target.searchQuery.value;
  if (api !== null && query === api.query && api.page === 1) return;

  api = new API(query);
  api.page = 1;

  const data = await createData();

  render(data);
  loadingHidden();
  lightbox.refresh();
  loadingHidden();
}

//* Fetch>-----------------------

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

//* Render>-----------------------

function render({ totalHits, hits }) {
  const template = hits.map(cardTemplate).join('');
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

//* infinity scroll>------------------

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

//* LoadMore Button>-----------------------

async function onLoadMoreClick() {
  if (!api) return;
  loadingVisible();
  api.pageIncrement();

  const data = await createData();

  render(data);
  lightbox.refresh();
  loadingHidden();
  console.log(
    `data.totalHits: ${data.totalHits} <= refs.gallery.children.length: ${refs.gallery.children.length} =>`,
    data.totalHits <= refs.gallery.children.length
  );

  if (data.totalHits <= refs.gallery.children.length) stopLoad();
}

//* Boleans for LOADMORE >-----------------------

const isHiddenLoadMore = refs.loadMore.hasAttribute('hidden');
const isHiddenLoading = refs.loadMore.classList.contains('is-loading-hidden');
const isVisibleLoading = refs.loadMore.classList.contains('is-loading');

//* HIDDEN LOADING>-----------------------

function loadingHidden() {
  loadMoreVisible();

  refs.loadMore.classList.add('is-loading-hidden');

  if (isVisibleLoading) return;
  refs.loadMore.classList.remove('is-loading');
}

//* LOADING VISIBLE

function loadingVisible() {
  loadMoreVisible();

  refs.loadMore.classList.add('is-loading');

  if (isHiddenLoading) return;
  refs.loadMore.classList.remove('is-loading-hidden');
}

//* VISIBLE LOADMORE>-----------------------

function loadMoreVisible() {
  if (!isHiddenLoadMore) return;
  refs.loadMore.removeAttribute('hidden');
}

//* LOADMORE IS HIDDEN>-----------------------

function loadMoreIsHidden() {
  refs.loadMore.setAttribute('hidden', true);
}

//* STOP LOADING>-----------------------
function stopLoad() {
  loadMoreIsHidden();

  Notify.info("We're sorry, but you've reached the end of search results.");

  refs.loadMore.insertAdjacentHTML(
    'afterend',
    `<div class="stop-load">
  <span>We're sorry, but you've reached the end of search results.</span>
  <a href="#search-form">Click to go up</a>
</div>`
  );
}
