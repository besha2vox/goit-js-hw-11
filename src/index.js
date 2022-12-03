import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { API } from './js/api';
import { cardTemplate } from './js/card-template';
import { LoadMore } from './js/load-more';
import { totalHitsCounr, failure } from './js/message';
import { renderTheme, onThemeToggle } from './js/theme-switcher';
import { smoothScroll } from './js/scroll';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  themeSwitcher: document.querySelector('.theme-switch__toggle'),
};
console.log('refs', refs.gallery.getBoundingClientRect());

const loadMore = new LoadMore(refs.loadMore);

let api = null;
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMoreClick);
refs.themeSwitcher.addEventListener(
  'change',
  onThemeToggle.bind(this, refs.themeSwitcher)
);

renderTheme();

// SUBMIT FORM>-----------------------

async function onFormSubmit(e) {
  e.preventDefault();
  loadMore.loadingVisible();

  const query = e.target.searchQuery.value;
  if (api !== null && query === api.query && api.page === 1) return;

  api = new API(query);
  api.page = 1;

  const data = await createData();

  render(data);
  loadMore.loadingHidden();
  lightbox.refresh();
  loadMore.loadingHidden();
}

// Fetch>-----------------------

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
    .catch(error => failure());
}

// Render>-----------------------

function render({ totalHits, hits }) {
  const template = hits.map(cardTemplate).join('');
  if (api.page === 1) {
    totalHitsCounr(totalHits);
    refs.gallery.innerHTML = template;
    return;
  }
  refs.gallery.insertAdjacentHTML('beforeend', template);
}

// LoadMore Button>-----------------------

async function onLoadMoreClick() {
  if (!api) return;
  loadMore.loadingVisible();
  api.pageIncrement();

  const data = await createData();

  render(data);
  smoothScroll(refs.gallery);
  lightbox.refresh();
  loadMore.loadingHidden();

  if (data.totalHits <= refs.gallery.children.length) loadMore.stopLoad();
}
