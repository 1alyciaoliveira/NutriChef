const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('search-result');
const container = document.querySelector('.container');
let searchQuery = ''; //leave it as an empty string so it can return the value added in the search bar.
const APP_ID = 'e0fc7187';
const APP_KEY = 'c99eb3d8eb3f0b6f476a1ba745ea630b';
const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}&mealtype=${mealType}`;

//Press the search button after add the ingredient and make it return the value that was added.
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); //prevent the page to update itself
    searchQuery = e.target.querySelector('input').value;
})

async function fetchAPI () {
    const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}&mealtype=${mealType}`;
    const response = await fetch(baseURL);
    const data = await response.json();
    console.log(data);
}