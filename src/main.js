// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

// Описаний у документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

import {searchApi} from './js/pixabay-api'; 
import {templateCard} from './js/render-functions';

const formEl = document.querySelector('.search-form');
const listItemsEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');
const btnLoadMoreEl = document.querySelector('.btn-load-more');


let page = 1;
let searchData = '';
const per_page = 15;

loaderEl.style.display = 'none';

const handleSubmit = async event => {
    try{
        event.preventDefault();
        loaderEl.style.display = 'block';
    
        searchData = event.currentTarget.elements.user_query.value.trim();
    
        if(searchData === ''){
            iziToast.show({ 
            title: 'Error',
            message: 'Поле пошуку порожнє, заповніть поле пошуку!',
            position: 'center',
         });
         btnLoadMoreEl.classList.add('is-hidden');
         btnLoadMoreEl.removeEventListener('click', handleBtnLoadMoreClick);
            return;
        };
        
        page = 1;
        const response = await searchApi(searchData, page);
                                         
     if (response.data.total === 0) {
                iziToast.error({ 
                    title: 'Error',
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    position: 'center',
                 }); 
                 
                 listItemsEl.innerHTML = ''              
                 btnLoadMoreEl.classList.add('is-hidden');
                 btnLoadMoreEl.removeEventListener('click', handleBtnLoadMoreClick);
                 formEl.reset();
            };                   

                formEl.reset();

                if(response.data.totalHits > 1){
                    btnLoadMoreEl.classList.remove('is-hidden');
                    btnLoadMoreEl.addEventListener('click', handleBtnLoadMoreClick);
                }

                if(response.data.total <= per_page){
                    btnLoadMoreEl.classList.add('is-hidden');
                    btnLoadMoreEl.removeEventListener('click', handleBtnLoadMoreClick);
                }
    
            const cardImg = response.data.hits.map(element => templateCard(element)).join('');

            listItemsEl.innerHTML = cardImg;
            
            loaderEl.style.display = 'none';

            
            let gallery = new SimpleLightbox('.gallery a');
            gallery.refresh();
            
            return;
         }catch(err){
             iziToast.error({ 
                title: 'Error',
                message: 'Error!',
                position: 'center',
                });
        };
           
       
 } 
    const handleBtnLoadMoreClick = async event => { 
       
                try{
                    loaderEl.style.display = 'block';
                    page++;
                
                    const response = await searchApi(searchData, page);
                        
                    const cardImg = response.data.hits.map(element => templateCard(element)).join('');
            
                        listItemsEl.insertAdjacentHTML('beforeend', cardImg);

                        let gallery = new SimpleLightbox('.gallery a');
                    gallery.refresh();

                    
                    setTimeout(() => {
                        const gallaryCards = document.querySelectorAll('.gallary-card');
                        if (gallaryCards.length > 0) {
                            const cardHeight = gallaryCards[0].getBoundingClientRect().height;
                            window.scrollBy({
                                top: cardHeight * 2,
                                left: 0,
                                behavior: 'smooth'
                            });
                        }
                    }, 300);

                    const totalPages = Math.ceil( response.data.totalHits / per_page);
                                
                        if(page >= totalPages){
                            loaderEl.style.display = 'none';
                            iziToast.show({ 
                                title: 'Error',
                                message: "We're sorry, but you've reached the end of search results",
                                position: 'topRight',
                                });
                            btnLoadMoreEl.classList.add('is-hidden');
                            btnLoadMoreEl.removeEventListener('click', handleBtnLoadMoreClick);
                            return;
                        };
                    }catch(err){
                    iziToast.error({ 
                        title: 'Error',
                        message: 'Error!',
                        position: 'center',
                        });
                };                  
    
            }                  
    formEl.addEventListener('submit', handleSubmit);

   
