
import Notiflix from 'notiflix';
import { fetchImages } from './js/fetchimages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const form = document.querySelector('#search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let PER_PAGE = 40;
let images = [];
let q = '';
let page = 1;
let totalHits = 0;

loadMoreBtn.style.display = 'none';



const renderGallery = () => {
 const gallery = images
    .map(
      image => `<a class="photo-link" href="${image.largeImageURL}"> <div class="photo-card">
      <div class="photo">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /> </div>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${image.likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${image.views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${image.downloads}
    </p>
  </div>
</div> </a>`
    )
    .join('');

  galleryList.insertAdjacentHTML('beforeend', gallery);
  simpleLightBox.refresh();
};

const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const fetchPhotos = () => 
 fetchImages(q, PER_PAGE, page)
    .then(data => {
      images = data.hits;
      totalHits = data.totalHits;
      if (totalHits === 0) {
        loadMoreBtn.style.display = 'none';
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      renderGallery();
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    })
    .catch(error => {
      console.log('error:', error);
    });


const onSubmit = e => {
  e.preventDefault();
  galleryList.innerHTML = '';
  const searchValue = e.target.elements.searchQuery.value;
  q = searchValue;
  page = 1;
  if (q !== '') {
    fetchPhotos();
     //Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
    
  }
  e.target.elements.searchQuery.value = '';

};


const onloadMore = e => {
  page += 1;
  fetchPhotos();
   //const totalPages = Math.ceil(data.totalHits / PER_PAGE);
  if (page*PER_PAGE > totalHits) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
  }
};

 form.addEventListener('submit', onSubmit);
 loadMoreBtn.addEventListener('click', onloadMore);


