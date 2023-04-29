let ingredients = "";
var searchBtn = $("#search-btn");
var searchForm = $("form");
var searchQuery = $("#ingredients");
var foodType = "";
let recipes = [];
const APP_KEY = "b87396b95d96489c874444040e12c773";
const baseURL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${APP_KEY}`;
let mealList = document.getElementById("recipe");

//search button to submit ingredients
searchBtn.on("click", (e) => {
  e.preventDefault();
  // searchQuery = input.value;
  ingredients = searchQuery
    .val()
    .split(",")
    .map((word) => word.trim())
    .join(",+");
  fetchRecipesAPI();
});

//event listener to "I want this one" btn
mealList.addEventListener("click", getMealRecipe);

//save ingredients in local storage
function ingredientStorage() {
  localStorage.setItem("ingredients", ingredients);
}

//fetch the first endpoint to generate the list of recipes
async function fetchRecipesAPI() {
  // formst url to do request
  const fetchURL = `${baseURL}&ingredients=${ingredients}`;
  // fetch recipes
  const request = await fetch(fetchURL);

  // convert request into a readable json
  const recipesJson = await request.json(); // []
  console.log(recipesJson);
  generateHTML(recipesJson);
}

//insert the HTML
function generateHTML(recipesJson) {
  let html = "";

  $.each(recipesJson, function (index, recipe) {
    const title = recipe.title;
    const image = recipe.image;
    const id = recipe.id;
    let container = $("#recipe-selection");

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
  if (e.target.classList.contains("view-recipe")) {
    let mealItem = e.target.parentElement.parentElement;
    console.log(mealItem);
    fetch(
      `https://api.spoonacular.com/recipes/${mealItem.dataset.id}/information/?apiKey=${APP_KEY}`
    )
      .then((response) => response.json())
      .then((recipe) => {
        generateModalHTML(recipe);
        console.log(recipe);
      });
  }
}

//Generate modal HTML
async function generateModalHTML(recipe) {
  let generatedModalHTML = "";
  //let recipeImg = data.image;
  let recipeName = recipe.title;
  let summary = recipe.summary;
  var modal = document.querySelector(".modal");
  const modalTitle = document.getElementById('modal-title')
  const modalSummary = document.getElementById('modal-summary')
  const nutriCalories = document.getElementById('nutri-calories')
  // empty array ready to recive API data
  const nutritionQuery = [];

  await recipe.extendedIngredients.forEach(async (ingredient) => {
    const ingText = ingredient.original;

    const response = await fetch(
      "https://api.api-ninjas.com/v1/nutrition?query=" + ingText,
      {
        method: "GET",
        headers: { "X-Api-Key": "cDxmeJpmVNhqPAllzxJX+A==kiF4qqk9jASFyhRS" },
        "Content-Type": "application/json",
      }
    );

    const result = await response.json();
    console.log(result);
    nutritionQuery.push(result[0]);
  });

  const sourceUrl = "";

  const calories = 0;
  const totalFats = 0;
  const saturatedFats = 0;
  const cholesterol = 0;
  const sodium = 0;
  const carbs = 0;
  const fiber = 0;
  const sugars = 0;
  const protein = 0;

  nutritionQuery.forEach((nutritional) => {
    calories += nutritional["calories"];
    carbs += nutritional["carbohydrates_total_g"];

    console.log(calories)
  });



  modalTitle.innerText = recipeName
  modalSummary.innerHTML = summary;

  console.log(sourceUrl);

  const modalBg = document.querySelector(".modal-background");

  //Open modal
  modal.classList.add("is-active");

  //Close modal
  modalBg.addEventListener("click", () => {
    modal.classList.remove("is-active");
  });

  const link = document.getElementById("recipe-link");
  link.setAttribute("target", "_blank");
}
