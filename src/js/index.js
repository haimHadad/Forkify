import Search from './models/Search'
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/likes';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as likesView from './views/likesView'
import * as listView from './views/listView'
import {elements,renderLoader,clearLoader} from './views/base'

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
            let liked = false;
            if(state.likes){
                if(state.likes.isLiked(id)){
                    liked = true;
                }
            }

            recipeView.renderRecipe(
                state.recipe,
                liked
            );
            
            
        }catch(error){
            alert('Error processing with recipe !!');
        }
    }
    
 };


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));






/**
 * LIST CONTROLLER
 */

const controlList = ()=>{

    //Create a new list if not exist
    if(!state.list){
        state.list = new List();
    }

    //Add all ingredients to list and the UI
    state.recipe.ingredients.forEach(el =>{
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);

        
    });


}

elements.shopping.addEventListener('click', e =>{
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete , .shopping__delete *')){
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
    }else  if(e.target.matches('.shopping__count-value')){
        //Handle count value
       var val = parseFloat(e.target.value);
       state.list.updateCount(id, val);
    }
})


/**
 * LIKE CONTROLLER
 */

const controlLike = () =>{
     if(!state.likes) state.likes = new Likes();
     const currentID = state.recipe.id;

     //User has not liked curret recipe
     if(!state.likes.isLiked(currentID)){
         //Add like to the state
        const newLike = state.likes.addLikes(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
        
        //Toggle the like button
        likesView.toggleLikeBtn(true);
        //Add like to likeslist in UI
        console.log(state.likes)
        likesView.renderLike(newLike);

     }else{ //User already has liked curret recipe

        //Remove like from state
        state.likes.deleteItem(currentID);

        //Toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove like to likeslist in UI
        console.log(state.likes)
        likesView.deleteLike(currentID);
     }
     likesView.toggleLikeMenu(state.likes.getNumLikes());
}



//Handlings recipe button clicks

elements.recipe.addEventListener('click', e=>{
    
    if(e.target.matches('.btn-decrease , .btn-decrease *')){ //elements and its children elements
        if(state.recipe.servings > 1){
        //Decrease button is clicked
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngresients(state.recipe);
    }
    }else if(e.target.matches('.btn-increase , .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngresients(state.recipe);
    }
    else if(e.target.matches('.recipe__btn--add , .recipe__btn--add *')){
        //Add ingredient to shopping list
        controlList();
    }
    else if(e.target.matches('.recipe__love , .recipe__love *')){
        //Call likes conroller
        controlLike();
    }
    
});


