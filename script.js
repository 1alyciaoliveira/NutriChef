let ingredients = "";
var searchBtn = $("#search-btn");
var searchForm = $("form");
var searchQuery = $("#ingredients");
var foodType = "";
let recipes = [];
const APP_KEY = "b87396b95d96489c874444040e12c773";
const baseURL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${APP_KEY}`;
let mealList = document.getElementById("recipe");
let selectedRecipeURL = "";
let selectedRecipeTitle = "";

//search button to submit ingredients
searchBtn.on("click", (e) => {
  e.preventDefault();
  if(searchQuery.val().length === 0) return
  // searchQuery = input.value;
  ingredients = searchQuery.val().split(',').map(word => word.trim()).join(',+');
  fetchRecipesAPI();
 
});

//event listener to "I want this one" btn
mealList.addEventListener('click', getMealRecipe);


//fetch the first endpoint to generate the list of recipes
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


//insert the HTML 
function generateHTML(recipesJson) {

  let html = "";

  $.each(recipesJson, function (index, recipe) {
    const title = recipe.title;
    const image = recipe.image;
    const id = recipe.id;
    let container = $('#recipe-selection')
    
    html = `
      <div class="column" data-id="${id}">
        <div class="box"> 
          <div class="media-center">
            <figure class="image is-128x128">
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


//fetchs the other endpoint info once we click at "I want this one" btn
function getMealRecipe(e) {
  e.preventDefault();
  if(e.target.classList.contains('view-recipe')) {
    let mealItem = e.target.parentElement.parentElement;
    fetch(`https://api.spoonacular.com/recipes/${mealItem.dataset.id}/information/?apiKey=${APP_KEY}`)
    .then(response => response.json())
    .then(recipe => {
      selectedRecipeURL = recipe.sourceUrl;
      selectedRecipeTitle = recipe.title;
      generateModalHTML(recipe);
      saveRecipeURL(selectedRecipeTitle, selectedRecipeURL);
    }); 
  }
}

//Generate modal HTML
async function generateModalHTML (recipe) {
  let generatedModalHTML = '';
  let recipeName = recipe.title;
  let summary = recipe.summary;
  let sourceUrl = recipe.sourceUrl;
  var modal = document.querySelector('.modal');

    // empty array ready to recive API data
  const nutritionQuery = [];

  await Promise.all(recipe.extendedIngredients.map(async (ingredient) => {
    const ingText = ingredient.original;
  
    const response = await fetch("https://api.api-ninjas.com/v1/nutrition?query=" + ingText, {
        headers: { "X-Api-Key": "cDxmeJpmVNhqPAllzxJX+A==kiF4qqk9jASFyhRS" }
      });

    const result = await response.json();
    nutritionQuery.push(result[0]);

    console.log(nutritionQuery);

    }));

  generatedModalHTML +=
  `
    <div class="modal-background"></div>
    <div class="modal-content has-background-white">
      <h3 class="title mb-6">${recipeName}</h3>
      <p class="summary">${summary.replace(/\. /g, ".<br>")}</p>
      <br>
      <h3 class="title mb-1">Curious about the ingredients nutritional facts?</h3>
    <div class="columns" id="nutriFacts">
    `;
    
    for (let i=0; i < nutritionQuery.length; i++) {
    generatedModalHTML +=
    `
      <div class="column" id="ing=${i}">
        <div class="box">
        <p><b>Ingredient:</b> ${nutritionQuery[i].name}</p>
        <p><b>Calories:</b> ${nutritionQuery[i].calories}</p>
        <p><b>Carbs:</b> ${nutritionQuery[i].carbohydrates_total_g}</p>
        <p><b>Fat:</b> ${nutritionQuery[i].fat_total_g}</p>
        <p><b>Protein:</b> ${nutritionQuery[i].protein_g}</p>
        </div>
      </div>
  `;
}

  generatedModalHTML +=
  `
  </div>
  <div class="sourceUrl">
    <a href="${sourceUrl}" id="recipe-link">Check Recipe</a>
  </div>
  `;

  modal.innerHTML = generatedModalHTML;
  
  console.log(sourceUrl);
  
  const modalBg = document.querySelector('.modal-background');

  //Open modal
  modal.classList.add('is-active');

  //Close modal
  modalBg.addEventListener('click', () => {
    modal.classList.remove('is-active');
  });

  const link = document.getElementById("recipe-link");
  link.setAttribute("target", "_blank");

}

  //save ingredients in local storage
  function saveRecipeURL(title, url) {
    let savedRecipe = window.localStorage.getItem("recipesURL") ? JSON.parse(window.localStorage.getItem("recipesURL")) : [];

    if (!savedRecipe.find(recipe => recipe.title === title && recipe.url === url)) {
      savedRecipe.push({title, url});
      window.localStorage.setItem("recipesURL", JSON.stringify(savedRecipe));
      showRecipeBtn();
    }
    }

  function showRecipeBtn () {
    let mostVistedRecipesContainer = document.querySelector('#most-visited-recipes');
    let savedRecipe = window.localStorage.getItem("recipesURL") ? JSON.parse(window.localStorage.getItem("recipesURL")) : [];
    let generatedHistoryHTML = '';

    generatedHistoryHTML +=
    `
    <div class="column">
        <p>Last recipes: </p>
    </div>
    `

    for(let i= savedRecipe.length - 1; i >= Math.max(savedRecipe.length -3, 0); i--) {
      generatedHistoryHTML +=
      `
      <div class="column">
        <a href="${savedRecipe[i].url}" class="button" id="previous-recipe-btn">${savedRecipe[i].title}</a>
      </div>
      `;
    }
    mostVistedRecipesContainer.innerHTML = generatedHistoryHTML;

 }

 showRecipeBtn();