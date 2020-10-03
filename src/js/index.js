import Search from './models/Search'
import * as searchView from './views/searchView'
import {elements,renderLoader,clearLoader} from './views/base'
import Recipe from './models/Recipe';
/*Global state of the app
*-Search object
*Current recipe object
*-Shopping list object
*-Liked recipes
*/


/**
 * SEARCH CONTROLLER
 */
const state = {};
const controlSearch = async ()=>{
    //1) Get query from view
    var query= searchView.getInput();
    //query = document.querySelector('.search__field').textContent
    if(query){
        //2) New search object and add to state
        state.search = new Search(query);
    }

    //3)Prepare UI for result
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.result);
    
    try{
        //4)Search for recipe
        await state.search.getResults();
        
        //5)Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);

    }catch(error){
        alert('Somthing wrong with the search...');
    }
    
}

elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();

});

elements.searchResPages.addEventListener('click', e=>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt( btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/**
 * RECIPE CONTROLLER
 */

 const controlRecipe = async ()=>{
    const id = window.location.hash.replace('#','');
    if(id){
        //Prepare UI for changes

        //Create new Recipe object
        state.recipe = new Recipe(id);
        //Get recipe data
        try{
            await state.recipe.getRecipe();
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render recipe
            console.log(state.recipe);
        }catch(error){
            alert('Error processing with recipe !!');
        }
    }
    
 };


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
