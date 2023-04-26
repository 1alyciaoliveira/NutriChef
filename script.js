let ingredients = "";
var searchBtn = $("#search-btn");
var searchForm = $("form");
var searchQuery = $("#ingredients");
var foodType = "";
let recipes = [];
const APP_KEY = "b87396b95d96489c874444040e12c773";
const baseURL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${APP_KEY}`;
let mealList = document.getElementById("recipe");


searchBtn.on("click", (e) => {
  e.preventDefault();
  // searchQuery = input.value;
  ingredients = searchQuery.val().split(',').map(word => word.trim()).join(',+');
  fetchRecipesAPI();
 
});

mealList.addEventListener('click', getMealRecipe);


function ingredientStorage() {
  localStorage.setItem("ingredients", ingredients);
};


async function fetchRecipesAPI () {
  // formst url to do request
  const fetchURL = `${baseURL}&ingredients=${ingredients}`;
  // fetch recipes
  const request = await fetch(fetchURL);


  // convert request into a readable json
  const recipesJson = await request.json(); // []
  console.log(recipesJson)
  generateHTML(recipesJson);
}



function generateHTML(recipesJson) {

  let html = "";

  //check the possibility to add the $ each inside a if, so we can have an else "Sorry, we didnt find any meal" 29:53

  $.each(recipesJson, function (index, recipe) {
    const title = recipe.title;
    const image = recipe.image;
    const id = recipe.id;
    // const url = recipe.url;
    let container = $('.recipe-selection')
    
    
    
//Crear botton, eventlistener y apendear a box
    html = `
      <div class="column" data-id="${id}">
        <div class="box"> 
          <div class="media-center">
            <figure class="image is-64x64">
              <img src="${image}">
            </figure>
          </div>
          <p class="name">${title}</p>
          <button class="button view-recipe">I want this one!</button>
        </div>
      </div>
    `;
    container.append(html);
  });
  
  return html;
}

var modal = document.querySelector('.modal');

function getMealRecipe(e) {
  e.preventDefault();
  if(e.target.classList.contains('view-recipe')) {
    let mealItem = e.target.parentElement.parentElement;
    console.log(mealItem);
    fetch(`https://api.spoonacular.com/recipes/${mealItem.dataset.id}/information/?apiKey=${APP_KEY}`);
    console.log(mealItem.dataset.id);
    modal.classList.add('is-active');
  }
}



function generateModalHTML (results) {
  let generatedModalHTML = '';
  let recipeImg = results.image;
  let recipeName = results.title;

  generatedModalHTML +=
  `
  <div class="modal">
            <div class="modal-background"></div>
            <div class="modal-content has-background-white">
                    <h3 class="title mb-6">${recipeName}</h3>
            </div>
            </div>
    </div>
  `;

  modal.innerHTML = generatedModalHTML;
  
  const modalBg = document.querySelector('.modal-background');


modalBg.on('click', () => {
  modal.classList.remove('is-active');
});

}

