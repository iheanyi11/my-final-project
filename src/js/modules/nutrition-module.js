// nutrition-module.js - Nutrition and meal tracking
export class NutritionModule {
    constructor() {
        this.mealLogs = JSON.parse(localStorage.getItem('mealLogs')) || [];
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
}