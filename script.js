// JavaScript code goes here
const randomMealUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';
const categoryMealUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=';
const categoriesUrl = 'https://www.themealdb.com/api/json/v1/1/categories.php';

window.addEventListener('load', () => {
    fetchRandomMeal();
    document.getElementById('searchInput').addEventListener('input', searchMealCategory);
    fetchCategories(); // Fetch categories on page load
});

// Function to fetch categories and populate typing suggestions
function fetchCategoriesForSuggestions() {
    fetch(categoriesUrl)
        .then(response => response.json())
        .then(data => {
            const categories = data.categories.map(category => category.strCategory);
            // Set the list of categories as the datalist options for the search input
            const dataList = document.getElementById('categoriesSuggestions');
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                dataList.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

// Call the function to fetch categories and populate typing suggestions on page load
window.addEventListener('load', fetchCategoriesForSuggestions);


function fetchCategories() {
    fetch(categoriesUrl)
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            // Display categories or use them as needed
            console.log(categories);
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function fetchRandomMeal() {
    fetch(randomMealUrl)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            document.getElementById('randomMealImage').innerHTML = `<img src="${meal.strMealThumb}" alt="Random Meal">`;
            document.getElementById('randomMealName').textContent = meal.strMeal;

            // Add click event listener to display ingredients in modal
            document.getElementById('randomMeal').addEventListener('click', () => {
                displayIngredientsModal(meal);
            });
        })
        .catch(error => console.error('Error fetching random meal:', error));
}

function searchMealCategory() {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput === '') {
        document.getElementById('mealCategoryList').innerHTML = '';
        return;
    }

    fetch(categoryMealUrl + encodeURIComponent(searchInput))
    .then(response => response.json())
    .then(data => {
            const meals = data.meals;
            const mealCategoryList = document.getElementById('mealCategoryList');
            mealCategoryList.innerHTML = '';

            if (meals) {
                // Limit the number of displayed meals to 9
                meals.slice(0, 9).forEach(meal => {
                    const mealComponent = document.createElement('div');
                    mealComponent.classList.add('mealComponent');
                    mealComponent.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}"> <p>${meal.strMeal}</p>`;
                    mealCategoryList.appendChild(mealComponent);

                    mealComponent.addEventListener('click', () => {
                        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                            .then(response => response.json())
                            .then(data => {
                                displayIngredientsModal(data.meals[0]);
                            })
                            .catch(error => console.error('Error fetching meal details:', error));
                    });
                });
            } else {
                mealCategoryList.innerHTML = '<p>No meals found for the searched category.</p>';
            }
        })
    .catch(error => console.error('Error fetching meal category:', error));
}



function displayIngredientsModal(meal) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Create an unordered list element to hold the ingredients
    const ingredientsList = document.createElement('ul');
    // Iterate through the ingredients dynamically
    for (let i = 1; i <= 20; i++) {
        // Check if the ingredient and its measure exist
        if (meal[`strIngredient${i}`] && meal[`strMeasure${i}`]) {
            // Create a list item element to display the ingredient and its measure
            const ingredientItem = document.createElement('li');
            // Set the text content of the list item to ingredient name and measure
            ingredientItem.textContent = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
            // Append the list item to the ingredients list
            ingredientsList.appendChild(ingredientItem);
        } else {
            // If the ingredient or measure doesn't exist at current index, exit the loop
            break;
        }
    }

    modalContent.appendChild(closeButton);
    modalContent.appendChild(ingredientsList);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);
    modal.style.display = 'block';
}

