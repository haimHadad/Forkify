import axios from 'axios'
import{proxy} from '../config'

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }
        catch(error){
            console.log(error);
            alert('Somthing went wrong !!');
        }
    }

    calcTime(){
        //Assuming that we need 15 minutes per 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons','tablespoon', 'ounces','ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort =['tbsp','tbsp', 'oz', 'oz', 'tsp','tsp', 'cup', 'pounds'];
        const units =[...unitsShort, 'kg', 'gr'];
        const newIngredients = this.ingredients.map(el =>{
           // 1) Uniform units
           let ingredient = el.toLowerCase();
           unitsLong.forEach((unit,i) => {
            ingredient = ingredient.replace( unit , unitsShort[i] );
           });

           // 2) Remove parentheses
           ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

           // 3) Parse ingredients into count, unit and ingredients
           const arrIng = ingredient.split(' ');
           
           const unitIndex = arrIng.findIndex(el2 =>units.includes(el2));
            let objIng;
            

            if(unitIndex > -1){
                //There is a unit
                //Exchange 4 1/2 cups to arrCount [4,1/2] --> eval("4+1/2") --> 4.5
                const arrCount = arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length === 1){
                    count = eval(arrCount[0].replace('-', '+'));
                }else{
                    count = eval(arrCount.slice(0, unitIndex).join('+'));
                }

                objIng ={
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }

            }else if(parseInt(arrIng[0],10)){
                //There is NO unit, but 1st element is a number
                objIng ={
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else if(unitIndex === -1){
                //There is NO unit and No number in 1st position
                objIng ={
                    count:1,
                    unit: '',
                    ingredient
                }
            }

           return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type){
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        //Ingredients
         this.ingredients.forEach(ing =>{
            ing.count *= (newServings / this.servings);
        });      
        this.servings = newServings;    
        
    }
} 