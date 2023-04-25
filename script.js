console.log("hello world")
let ingredients = "";
var searchBtn = $("#search-btn");
var foodTypeButtons = $('button[name="foodType"]');
var searchForm = $("form");
var searchQuery = $("#ingredients");
var selectedFoodType = "";
var foodType = "";
let recipes = [];
// var APP_ID = 'e0fc7187';
// var APP_KEY = 'c99eb3d8eb3f0b6f476a1ba745ea630b';
const APP_KEY = "b87396b95d96489c874444040e12c773";
const baseURL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${APP_KEY}`;
//var baseURL = `https://api.spoonacular.com/recipes/findByIngredients`;



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

// foodTypeButtons.on('click', function() {
//   selectedFoodType = $(this).val();
//   localStorage.setItem('foodType', selectedFoodType);
//   baseURL = baseURL + `&mealtype=${foodType}`;

// });


// async function fetchAPIweather () {
//   const todayBaseURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}`;
//   const todayInfo = await fetch(todayBaseURL).then(response => response.json());
//   generateTodayHTML(todayInfo);
// }


// async function fetchAPI() {
// //  var foodType = localStorage.getItem("foodType");
//   const ingredients = localStorage.getItem("ingredients");
//   const fetchURL = `${baseURL}&ingredients=${ingredients}`;
//   const response = await fetch(fetchURL);
//   recipes = await response.json();
//   const html = generateHTML(recipes);
//   //$("#recipe-container").html(html);
//   console.log(recipes);

// }

function generateHTML(recipesJson) {

  let html = "";

  $.each(recipesJson, function (index, recipe) {
    const title = recipe.title;
    const image = recipe.image;
    const url = recipe.url;
    let container = $('.recipe-selection')

    html = `
      <div class="column">
        <div class="box">
          <div class="media-center">
            <figure class="image is-64x64">
              <img src="${image}">
            </figure>
          </div>
          <p class="name">${title}</p>
          <button class="button view-recipe" data-url="${url}">I want this one!</button>
        </div>
      </div>
    `;
    container.append(html);
  });

  return html;
}

// function generateHTML(fetchRecipesAPI) {

//   let html = "";

  
//   $.each(result, function (index, recipe) {
//     const title = recipe.title;
//     const image = recipe.image;
//     const url = recipe.url;
// //    const calories = recipe.calories.toFixed(2);
// //    const variable1 = "Another info"; // Replace with your own variable
// //    const variable2 = "Another info"; // Replace with your own variable
//     let container = $('.recipe-selection')

//     html = `
//       <div class="column">
//         <div class="box">
//           <div class="media-center">
//             <figure class="image is-64x64">
//               <img src="${image}">
//             </figure>
//           </div>
//           <p class="name">${title}</p>
//           <button class="button view-recipe" data-url="${url}">I want this one!</button>
//         </div>
//       </div>
//     `;
//     container.innerHTML += html;
//   });
//   return html;
// }


/*async function fetchAPI() {
  const mealtype = localStorage.getItem('foodType');
  const ingredients = localStorage.getItem('ingredients');
  var APP_ID = 'e0fc7187';
  var APP_KEY = 'c99eb3d8eb3f0b6f476a1ba745ea630b';
  const baseURL = `https://api.edamam.com/search?q=${ingredients}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=20&mealType=${mealtype}`;
  const response = await fetch(baseURL);
  const data = await response.json();
  generateHTML(data.hits, mealtype);
  $('#recipe-container').html(html);
  console.log(data);
}

$.ajax({
  url: `https://api.edamam.com/search?q=${ingredients}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=20&mealType=${mealtype}`,
  method: 'GET',
  dataType: 'json',
  success: function(result) {
    const html = generateHTML(result.hits, mealtype);
    $('#recipe-container').html(html);
  },
  error: function(error) {
    console.log('Error:', error);
  }



function generateHTML(result) {
  let html = '';

  $.each(result.hits, function(recipe) {
    const label = recipe.label;
    const image = recipe.image;
    const url = recipe.url;
    const calories = recipe.calories.toFixed(2);
    const variable1 = 'Another info'; // Replace with your own variable
    const variable2 = 'Another info'; // Replace with your own variable

    html += `
      <div class="column">
        <div class="box">
          <div class="media-center">
            <figure class="image is-64x64">
              <img src="${image}">
            </figure>
          </div>
          <p class="name">${label}</p>
          <p class="calories">Calories: ${calories}</p>
          <p class="variable-1">${variable1}</p>
          <p class="variable-2">${variable2}</p>
          <button class="button view-recipe" data-url="${url}">I want this one!</button>
        </div>
      </div>
    `;
  return html;
 });*/
