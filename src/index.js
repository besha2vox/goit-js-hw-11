import { Notify } from 'notiflix';
import { API } from './js/api';
import { cardTemplate } from './js/card-template';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();

  const query = e.target.searchQuery.value;

  const api = new API(query);
  api.page = 1;

  fetchPhotos(api);
}

function fetchPhotos(api) {
  api
    .getPhotos()
    .then(resp => {
      const photos = resp.data.hits;
      if (photos.length < 1) throw Error();
      refs.gallery.innerHTML = photos.map(cardTemplate);
    })
    .catch(error =>
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}
