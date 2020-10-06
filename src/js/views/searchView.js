import {elements} from './base'

export const getInput=()=>{
    return elements.searchInput.value;
}

export const clearInput=()=>{
    elements.searchInput.value = '';
}

export const clearResults=()=>{
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link--active'));
    resultsArr.forEach(el=>{
        el.classList.remove('results__link--active');
    })

    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}

const limitRecipeTitle = (title,limit=17)=>{
    const newTitle =[];
    if(title.length > limit ){
        title.split(' ').reduce((acc,curr) =>{
            if(acc + curr.length <= limit){
                newTitle.push(curr);
            }
            return acc+ curr.length;
        },0);
    }
    else{
        return title;
    }

    return `${newTitle.join(' ')}...`;
}

const renderRecipes = recipe =>{
    const markup = `<li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src= "${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`
    elements.searchResList.insertAdjacentHTML("beforeend",markup);
};

const createButton = (page, type)=>
    
    `<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`;


const renderButtons = (page, numResults, resPerPage) =>{
    const pages = Math.ceil(numResults / resPerPage); //always rounds up by division
    let button;
    if ( page ===1 && pages > 1){
        //Button only to go next page
        button = createButton(page, 'next');

    }else if(page < pages){
        //Buttons to go previous and next
        button = `${createButton(page, 'next')}
                  ${createButton(page, 'prev')}`;
    }else if(page === pages && pages > 1){      
        //Button only to go previous page
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults = (recipes, page=1, resPerPage=10) => {
    //Render result of current page
    const start = (page - 1) * resPerPage;
    const end = page *resPerPage ;
    recipes.slice(start, end).forEach(renderRecipes);
    renderButtons( page ,recipes.length , resPerPage );
};