console.log("hello world")
let ingredients = "";
var searchBtn = $("#search-btn");
var foodTypeButtons = $('button[name="foodType"]');
var searchForm = $("form");
var searchQuery = $("#ingredients");
var selectedFoodType = "";
var foodType = "";
let recipes = [];
const APP_KEY = "b87396b95d96489c874444040e12c773";
const baseURL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${APP_KEY}`;


searchBtn.on("click", (e) => {
  e.preventDefault();
  // searchQuery = input.value;
  ingredients = searchQuery.val().split(',').map(word => word.trim()).join(',+');
  fetchRecipesAPI();
 
});


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

  $.each(recipesJson, function (index, recipe) {
    const title = recipe.title;
    const image = recipe.image;
    const id = recipe.id;
    const url = recipe.url;
    let container = $('.recipe-selection')
    
    const modalBg = document.querySelector('.modal-background');
    var modal = document.querySelector('.modal');
    var viewRecipeBtn = document.querySelector('.view-recipe');
//Crear botton, eventlistener y apendear a box
    html = `
      <div class="column">
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

  viewRecipeBtn.on('click', (event) => {
    event.preventDefault();
    modal.classList.add('is-active');
    fetchAPIRecipe(id);
  });
  
  modalBg.on('click', () => {
    modal.classList.remove('is-active');
  });

  return html;
}

async function fetchAPIRecipe () {
  const APIRecipeBaseURL = `https://api.spoonacular.com/recipes/${id}/information/?apiKey=${APP_KEY}`;
  const recipeBase = await fetch(APIRecipeBaseURL).then(response => response.json());
  console.log(recipeBase);
  generateModalHTML(recipeBase);

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
  
}

}

