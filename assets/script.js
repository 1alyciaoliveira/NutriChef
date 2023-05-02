let ingredients = "";
let searchBtn = $("#search-btn");
let searchForm = $("form");
let searchQuery = $("#ingredients");
let foodType = "";
let recipes = [];
let selectedRecipeURL = "";
let selectedRecipeTitle = "";
let mealList = document.getElementById("recipe");
const APP_KEY = "b87396b95d96489c874444040e12c773";
const baseURL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${APP_KEY}`;
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal-background");
const deleteBtn = document.querySelector(".delete");


/**
 * This function toggles the loading of  the recipe cards
 * @param {boolean} check true or false
 */

function toggleLoadRecipeCards(check) {
  const recipeSelectionSelector = document.getElementById("recipe-selection");
  const landingLoadingSelector = document.getElementById("loadingLandingPage");
  if (check === true) {
    landingLoadingSelector.classList.add("is-hidden");
    recipeSelectionSelector.classList.remove("is-hidden");
  } else {
    landingLoadingSelector.classList.remove("is-hidden");
    recipeSelectionSelector.classList.add("is-hidden");
  }
}


//search button to submit ingredients
searchBtn.on("click", (e) => {
  toggleLoadRecipeCards(false)
  e.preventDefault();
  if (searchQuery.val().length === 0) return;
  ingredients = searchQuery
    .val()
    .split(",")
    .map((word) => word.trim())
    .join(",+");
  
  fetchRecipesAPI();
  ingredients = "";
});

//event listener to "I want this one" btn
mealList.addEventListener("click", getMealRecipe);

//fetch the first endpoint to generate the list of recipes
async function fetchRecipesAPI() {
  
  // format url to do request and fetch recipes
  const fetchURL = `${baseURL}&ingredients=${ingredients}`;
  const request = await fetch(fetchURL);
  const recipesJson = await request.json(); // []

  if(recipesJson.length > 0) {
    generateHTML(recipesJson);
  } else {
    notFound();
  }
}

//insert the recipe boxes HTML
function generateHTML(recipesJson) {
  let html = "";
  let container = $("#recipe-selection");

  $.each(recipesJson, function (index, recipe) {
    const title = recipe.title;
    const image = recipe.image;
    const id = recipe.id;

    html = `
      <div class="column is-flex-direction-column is-justify-content-space-between is-align-items-center" data-id="${id}">
        <div class="box"> 
          <div class="media-center">
            <figure class="image is-128x128">
              <img src="${image}">
            </figure>
          </div>
          <p class="name">${title}</p>
          <button class="button is-small is-rounded is-primary view-recipe">I want this!</button>
        </div>
      </div>
    `;
    toggleLoadRecipeCards(true)
    container.append(html);
  });
}

//fetchs the other endpoint info once we click at "I want this" btn
function getMealRecipe(e) {
  if (e.target.classList.contains("view-recipe")) {
    e.preventDefault();
    //Open modal
    modal.classList.add("is-active");
    toggleLoadRecipeModal(false);

    //Close modal when clicking outside of it
    modalBg.addEventListener("click", () => {
      modal.classList.remove("is-active");
    });

    //Close modal when clicking X
    deleteBtn.addEventListener("click", () => {
      modal.classList.remove("is-active");
    })

    let mealItem = e.target.parentElement.parentElement;

    fetch(
      `https://api.spoonacular.com/recipes/${mealItem.dataset.id}/information/?apiKey=${APP_KEY}`
    )
      .then((response) => response.json())
      .then((recipe) => {
        selectedRecipeURL = recipe.sourceUrl;
        selectedRecipeTitle = recipe.title;
        generateModalHTML(recipe);
        saveRecipeURL(selectedRecipeTitle, selectedRecipeURL);
      });
  }
}

//Generate modal HTML
async function generateModalHTML(recipe) {
  let recipeName = recipe.title;
  let summary = recipe.summary;
  let sourceUrl = recipe.sourceUrl;
  const nutritionQuery = [];

  await Promise.all(
    recipe.extendedIngredients.map(async (ingredient) => {
      const ingText = ingredient.original;
      const response = await fetch(
        "https://api.api-ninjas.com/v1/nutrition?query=" + ingText,
        {
          headers: { "X-Api-Key": "cDxmeJpmVNhqPAllzxJX+A==kiF4qqk9jASFyhRS" },
        }
      );

      const result = await response.json();

      // some values are undefined, so we dont want to add them
      if (result[0] != undefined) {
        nutritionQuery.push(result[0]);
      }
    })
  );

//Nutritional information
  const recipeTitleSelector = document.getElementById("recipeTitle");
  const recipeSummarySelector = document.getElementById("recipeSummary");
  const recipeLinkBtn = document.querySelector("#recipe-link");

  recipeLinkBtn.setAttribute("href", sourceUrl);
  recipeLinkBtn.setAttribute("target", "_blank");

  recipeTitleSelector.innerText = recipeName;
  recipeSummarySelector.innerHTML = summary.replace(/\. /g, ".<br>");

  let calories = 0;
  let totalFats = 0;
  let saturatedFats = 0;
  let cholesterol = 0;
  let sodium = 0;
  let carbs = 0;
  let fiber = 0;
  let sugars = 0;
  let protein = 0;

  // add nutritional values up
  nutritionQuery.forEach((nutri) => {
    calories += nutri["calories"];
    carbs += nutri["carbohydrates_total_g"];
    totalFats += nutri["fat_total_g"];
    saturatedFats += nutri["fat_saturated_g"];
    cholesterol += nutri["cholesterol_mg"];
    sodium += nutri["sodium_mg"];
    fiber += nutri["fiber_g"];
    sugars += nutri["sugar_g"];
    protein += nutri["protein_g"];
  });

  // Nutri Table Selectors
  const caloriesCellSelector = document.querySelector("#nutri-calories > .value");
  const carbsCellSelector = document.querySelector("#nutri-carbs > .value");
  const totalFatsCellSelector = document.querySelector("#nutri-fat > .value");
  const saturatedFatsCellSelector = document.querySelector("#nutri-sat-fat > .value");
  const cholesterolCellSelector = document.querySelector("#nutri-cholesterol > .value");
  const sodiumCellSelector = document.querySelector("#nutri-sodium > .value");
  const fiberCellSelector = document.querySelector("#nutri-fiber > .value");
  const sugarsCellSelector = document.querySelector("#nutri-sugar > .value");
  const proteinCellSelector = document.querySelector("#nutri-protein > .value");

  // Append info inside the nutri table cells
  caloriesCellSelector.innerText = Math.floor(calories) + "g";
  totalFatsCellSelector.innerText = Math.floor(totalFats) + "g";
  carbsCellSelector.innerText = Math.floor(carbs) + "g";
  saturatedFatsCellSelector.innerText = Math.floor(saturatedFats) + "g";
  cholesterolCellSelector.innerText = Math.floor(cholesterol) + "mg";
  sodiumCellSelector.innerText = Math.floor(sodium) + "mg";
  fiberCellSelector.innerText = Math.floor(fiber) + "mg";
  sugarsCellSelector.innerText = Math.floor(sugars) + "g";
  proteinCellSelector.innerText = Math.floor(protein) + "g";

toggleLoadRecipeModal(true);
}

/**
 * This function toggles the modal of the recipe
 * @param  {boolean} check true or false
 */
function toggleLoadRecipeModal(check) {
  const recipeInfoCardSelector = document.getElementById("recipeInfoCard");
  const loadingCardSelector = document.getElementById("loadingModalCard");

  if (check === true) {
    loadingCardSelector.classList.add("is-hidden");
    recipeInfoCardSelector.classList.remove("is-hidden");
  } else {
    loadingCardSelector.classList.remove("is-hidden");
    recipeInfoCardSelector.classList.add("is-hidden");
  }
}


//save ingredients in local storage
function saveRecipeURL(title, url) {
  let savedRecipe = window.localStorage.getItem("recipesURL")
    ? JSON.parse(window.localStorage.getItem("recipesURL"))
    : [];

  if (
    !savedRecipe.find((recipe) => recipe.title === title && recipe.url === url)
  ) {
    savedRecipe.push({ title, url });
    window.localStorage.setItem("recipesURL", JSON.stringify(savedRecipe));
    showRecipeBtn();
  }
}

//show last 3 visited recipes

function showRecipeBtn() {
  let mostVistedRecipesContainer = document.querySelector("#most-visited-recipes");
  let savedRecipe = window.localStorage.getItem("recipesURL")
    ? JSON.parse(window.localStorage.getItem("recipesURL"))
    : [];
  let generatedHistoryHTML = "";

  if (savedRecipe.length > 0) {
  generatedHistoryHTML += `
    <div class="column">
        <p>Last recipes: </p>
    </div>
    `;

  for (let i = savedRecipe.length - 1; i >= Math.max(savedRecipe.length - 3, 0);i--) {
    generatedHistoryHTML += `
      <div class="column">
        <a href="${savedRecipe[i].url}" class="button is-small is-rounded is-primary is-outlined" id="previous-recipe-btn" target="_blank">${savedRecipe[i].title}</a>
      </div>
      `;
  }
  mostVistedRecipesContainer.innerHTML = generatedHistoryHTML;
} else {
  generatedHistoryHTML = "";
}

}

showRecipeBtn();

//Show an alternative container if the ingredient wasnt found
function notFound () {
  let generatedNotFoundHTML = "";
  let container = document.getElementById("recipe-selection");

  generatedNotFoundHTML += `
  <div class="column has-text-centered">
    <div class="box is-justify-content-center">
      <h1 class="is-size-3">Sorry, we could not find any recipe with this ingredient.</h1>
      <p>Please, make sure your ingredients are in English and/or they are divided by comma (,).</p>
    </div>
  </div>
  `
  container.innerHTML = generatedNotFoundHTML;
  toggleLoadRecipeCards(true)
}
