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
const gallaryCard = document.querySelectorAll('.gallary-card');


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
        
            return;
        };
        
        page = 1;
        // btnLoadMoreEl.classList.add('is-hidden');
     const response = await searchApi(searchData, page);
                                         
     if (response.data.total === 0) {
                iziToast.error({ 
                    title: 'Error',
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    position: 'center',
                 }); 
                 
                 listItemsEl.innerHTML = ''              

                 formEl.reset();
            };                   

                formEl.reset();

                if(response.data.totalHits > 1){
                    btnLoadMoreEl.classList.remove('is-hidden');
                    btnLoadMoreEl.addEventListener('click', handleBtnLoadMoreClick);
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
};
                      
    formEl.addEventListener('submit', handleSubmit);
   
        const {heigt: cardHeight} = listItemsEl.firstElementChild.getBoundingClientRect();
            window.scrollBy({
            top: cardHeight * 2,
            left: 0,
            behavior: 'smooth'
         });
  
    
   