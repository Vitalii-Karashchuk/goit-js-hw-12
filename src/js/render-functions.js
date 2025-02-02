export const templateCard = (photoCard => {
    return `
   <a href="${photoCard.largeImageURL}">
        <li class="gallary-card">
            <img class="gallary-img" src="${photoCard.webformatURL}" alt=""> </img>
            <div class="description">
                <p>Likes ${photoCard.likes}</p>
                <p>Views ${photoCard.views}</p>
                <p>Comments ${photoCard.comments}</p>
                <p>Downloads ${photoCard.downloads}</p>
            </div>
        </li>
    </a>`;
});