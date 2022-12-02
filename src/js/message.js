import { Notify } from 'notiflix';

function totalHitsCounr(params) {
  Notify.info(`Hooray! We found ${params} images.`);
}
function failure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}
function endInfo() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}

export { totalHitsCounr, failure, endInfo };
