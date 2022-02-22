const submit = document.getElementById('submit'),
search = document.getElementById('search');
random = document.getElementById('random'),
resultHeading = document.getElementById('result-heading'),
mealsEl = document.getElementById('meals'),
singleMealEl = document.getElementById('single-meal');


// Search form API
async function searchFromAPI(e){
    e.preventDefault();

    // clear single meal
    singleMealEl.innerHTML = '';

    //Get Search term
    const term = search.value;

    if(term.trim()){
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await res.json();

        if(data.meals === null){
            resultHeading.innerHTML = `<p>No search result for ${term}, Please Try again</p>`;
            mealsEl.innerHTML = '';
        }else{
            resultHeading.innerHTML = `<h2>Search result for ${term}:</h2>`
            mealsEl.innerHTML = data.meals.map(meal =>`
                <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" dataID=${meal.idMeal} >
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>`
            ).join('');
        }
    }else{
        alert('Please enter search term');
    }


}


// Find meal by ID
async function getMealByID(mealID){
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await res.json();
    
    updateSingleMealDOM(data);
    // Clear search bar
    search.value = '';
}

// Update single meal DOM
function updateSingleMealDOM(data){
    const meal = data.meals[0];
    let ingredients = [];

    // collect ingredients and measurements 
    for(let i=1; i<=20; i++){
        if(meal[`strIngredient${i}`] === '' || meal[`strIngredient${i}`] === null){
            break;
        }else{
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
    }

    singleMealEl.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="about-meal">
            <h4>${meal.strCategory}</h4>
            <h4>${meal.strArea}</h4>
        </div>
        <div class="meal-instructions">
            <p>${meal.strInstructions}</p>
        </div>
        <div class="ingredients">
            <ul>
               ${ingredients.map(ing => `<li>${ing}</li>`).join('')} 
            </ul>
        </div>
        <div class="youtube">
        ${meal.strYoutube ? `<a href=${meal.strYoutube} target="_blank">Watch on YouTube</a>` : ''}
        </div>
    `;
}

// Search random Meal form API
async function searchRandomMeal(){
    // Clear search heading and results
    resultHeading.innerHTML ='';
    mealsEl.innerHTML = '';

    // fetch from API
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();

    updateSingleMealDOM(data);
}

// Add Event listener 
submit.addEventListener('submit', searchFromAPI);
random.addEventListener('click', searchRandomMeal);

mealsEl.addEventListener('click', e =>{
    
    let mealInfo = e.path;
    mealInfo = mealInfo.find(iteam =>{
        if(iteam.classList.contains('meal-info')){
            return iteam;
        }else{
            return false
        }
    });

    if(mealInfo){
        const mealID = mealInfo.getAttribute('dataid');
        
        getMealByID(mealID);
    }
    
})

