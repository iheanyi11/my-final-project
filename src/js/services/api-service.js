// Nutritionix API credentials (you'll need to sign up for these)
const NUTRITIONIX_APP_ID = '0529c9b6';
const NUTRITIONIX_API_KEY = '22910c10d8c774d06328f260f36829b5';

// Function to search for food items
async function searchFoodItems(query) {
  try {
    const response = await fetch('https://trackapi.nutritionix.com/v2/search/instant', {
      method: 'GET',
      headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'Content-Type': 'application/json'
      },
      params: { query }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch nutrition data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
}

// Function to get detailed nutrition information
async function getNutritionInfo(query) {
  try {
    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
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
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
}

export { searchFoodItems, getNutritionInfo };