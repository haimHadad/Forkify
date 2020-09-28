import Search from './models/search'
import * as searchView from './views/searchView'
import {elements,renderLoader,clearLoader} from './views/base'
/*Global state of the app
*-Search object
*Current recipe object
*-Shopping list object
*-Liked recipes

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
    
    //4)Search for recipe
    await state.search.getResults();
    
    //5)Render results on UI
    console.log(state.search.result);
    clearLoader();
    searchView.renderResults(state.search.result);
    
}

elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();

});




