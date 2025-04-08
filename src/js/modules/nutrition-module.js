// nutrition-module.js - Nutrition and meal tracking
export class NutritionModule {
    constructor() {
        this.mealLogs = JSON.parse(localStorage.getItem('mealLogs')) || [];
        this.NUTRITIONIX_APP_ID = '0529c9b6'; // Replace with your actual Nutritionix App ID
        this.NUTRITIONIX_API_KEY = '22910c10d8c774d06328f260f36829b5'; // Replace with your actual Nutritionix API Key
    }

    getMealLogs() {
        return this.mealLogs;
    }

    addMealLog(meal) {
        const newMeal = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...meal
        };
        this.mealLogs.push(newMeal);
        localStorage.setItem('mealLogs', JSON.stringify(this.mealLogs));
        return newMeal;
    }

    getDailyNutrition() {
        const today = new Date().toISOString().split('T')[0];
        const todaysMeals = this.mealLogs.filter(meal => 
            meal.date.startsWith(today));
        
        return {
            calories: todaysMeals.reduce((sum, meal) => sum + meal.calories, 0),
            protein: todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
            carbs: todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0),
            fat: todaysMeals.reduce((sum, meal) => sum + meal.fat, 0)
        };
    }

    getWeeklyCalories() {
        // Return dummy data for the weekly chart
        return [
            { day: 'Mon', calories: 1800 },
            { day: 'Tue', calories: 2100 },
            { day: 'Wed', calories: 1950 },
            { day: 'Thu', calories: 2200 },
            { day: 'Fri', calories: 2300 },
            { day: 'Sat', calories: 2100 },
            { day: 'Sun', calories: 1900 }
        ];
    }

    // New methods for Nutritionix API integration
    async searchFoodItems(query) {
        if (!query || query.length < 2) return { common: [] };

        try {
            const response = await fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'x-app-id': this.NUTRITIONIX_APP_ID,
                    'x-app-key': this.NUTRITIONIX_API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch nutrition data');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error searching food items:', error);
            throw error;
        }
    }

    async getNutritionInfo(query) {
        try {
            const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
                method: 'POST',
                headers: {
                    'x-app-id': this.NUTRITIONIX_APP_ID,
                    'x-app-key': this.NUTRITIONIX_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: query
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch nutrition data');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching nutrition info:', error);
            throw error;
        }
    }

    // Convert Nutritionix food object to our meal log format
    convertFoodToMeal(food) {
        return {
            name: food.food_name,
            calories: Math.round(food.nf_calories),
            protein: Math.round(food.nf_protein),
            carbs: Math.round(food.nf_total_carbohydrate),
            fat: Math.round(food.nf_total_fat),
            serving: `${food.serving_qty} ${food.serving_unit}`,
            servingGrams: food.serving_weight_grams
        };
    }

    // Initialize UI elements
    initUI() {
        // Get necessary DOM elements
        const searchInput = document.getElementById('food-search');
        const searchResults = document.getElementById('search-results');
        const nutritionDisplay = document.getElementById('nutrition-display');
        const nutritionForm = document.getElementById('nutrition-form');
        
        if (!searchInput || !searchResults || !nutritionDisplay) {
            console.error('Required nutrition UI elements not found');
            return;
        }

        // Add search event listener with debounce
        searchInput.addEventListener('input', this.debounce(async (e) => {
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            try {
                const data = await this.searchFoodItems(query);
                this.renderSearchResults(data, searchResults);
            } catch (error) {
                searchResults.innerHTML = '<p>Error searching for food items. Please try again.</p>';
            }
        }, 500));

        // Add form submission listener if the form exists
        if (nutritionForm) {
            nutritionForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const foodInput = document.getElementById('nutrition-input');
                if (!foodInput) return;
                
                const query = foodInput.value.trim();
                if (!query) return;
                
                try {
                    const data = await this.getNutritionInfo(query);
                    this.renderNutritionInfo(data, nutritionDisplay);
                } catch (error) {
                    nutritionDisplay.innerHTML = '<p>Error fetching nutrition information. Please try again.</p>';
                }
            });
        }
    }

    // Helper method for debouncing search input
    debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Render search results in the UI
    renderSearchResults(data, container) {
        container.innerHTML = '';
        
        if (!data.common || data.common.length === 0) {
            container.innerHTML = '<p>No results found</p>';
            return;
        }
        
        const resultsList = document.createElement('ul');
        resultsList.className = 'food-results-list';
        
        // Using bind to maintain 'this' context
        const self = this;
        
        data.common.slice(0, 10).forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.food_name;
            listItem.addEventListener('click', async function() {
                try {
                    const nutritionData = await self.getNutritionInfo(item.food_name);
                    const nutritionDisplay = document.getElementById('nutrition-display');
                    if (nutritionDisplay) {
                        self.renderNutritionInfo(nutritionData, nutritionDisplay);
                    }
                    container.innerHTML = '';
                } catch (error) {
                    console.error('Error getting food details:', error);
                }
            });
            resultsList.appendChild(listItem);
        });
        
        container.appendChild(resultsList);
    }

    // Render nutrition information
    renderNutritionInfo(data, container) {
        container.innerHTML = '';
        
        if (!data.foods || data.foods.length === 0) {
            container.innerHTML = '<p>No nutrition information available</p>';
            return;
        }
        
        const food = data.foods[0];
        
        const nutritionCard = document.createElement('div');
        nutritionCard.className = 'nutrition-card';
        
        nutritionCard.innerHTML = `
            <h3>${food.food_name}</h3>
            <p>Serving: ${food.serving_qty} ${food.serving_unit} (${food.serving_weight_grams}g)</p>
            <div class="nutrition-details">
                <div class="nutrition-item">
                    <span class="label">Calories:</span>
                    <span class="value">${Math.round(food.nf_calories)}</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Protein:</span>
                    <span class="value">${Math.round(food.nf_protein)}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Carbs:</span>
                    <span class="value">${Math.round(food.nf_total_carbohydrate)}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Fat:</span>
                    <span class="value">${Math.round(food.nf_total_fat)}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Fiber:</span>
                    <span class="value">${Math.round(food.nf_dietary_fiber)}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Sugars:</span>
                    <span class="value">${Math.round(food.nf_sugars)}g</span>
                </div>
                <div class="nutrition-item">
                    <span class="label">Sodium:</span>
                    <span class="value">${Math.round(food.nf_sodium)}mg</span>
                </div>
            </div>
            <button class="add-food-btn">Add to My Meals</button>
        `;
        
        container.appendChild(nutritionCard);
        
        // Add event listener for the Add button
        const addButton = nutritionCard.querySelector('.add-food-btn');
        if (addButton) {
            const self = this;
            addButton.addEventListener('click', function() {
                const mealData = self.convertFoodToMeal(food);
                self.addMealLog(mealData);
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = `${food.food_name} added to your meals!`;
                container.appendChild(successMessage);
                
                // Remove message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            });
        }
    }
}