import Search from './models/Search'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if(state.search){
            searchView.highlightSelected(id);
        }
        

        //Create new Recipe object
        state.recipe = new Recipe(id);
        
        try{
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            
        }catch(error){
            alert('Error processing with recipe !!');
        }
    }
    
 };


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//Handlings recipe button clicks

elements.recipe.addEventListener('click', e=>{
    
    if(e.target.matches('.btn-decrease , .btn-decrease *')){ //elements and its children elements
        if(state.recipe.servings > 1){
        //Decrease button is clicked
        state.recipe.updateServings('dec');
        }
    }else if(e.target.matches('.btn-increase , .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc');
    }
    recipeView.updateServingsIngresients(state.recipe);
});
