// workout-module.js - Workout tracking and management
export class WorkoutModule {
    constructor() {
        this.workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    }

    getWorkouts() {
        return this.workouts;
    }

    addWorkout(workout) {
        const newWorkout = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...workout
        };
        this.workouts.push(newWorkout);
        localStorage.setItem('workouts', JSON.stringify(this.workouts));
        return newWorkout;
    }

    getRecentWorkouts(limit = 5) {
        return this.workouts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    getWeeklyStats() {
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const weeklyWorkouts = this.workouts.filter(workout => 
            new Date(workout.date) >= oneWeekAgo);
        
        return {
            totalWorkouts: weeklyWorkouts.length,
            totalDuration: weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0),
            totalCalories: weeklyWorkouts.reduce((sum, workout) => sum + workout.calories, 0)
        };
    }

    getSampleWorkoutTypes() {
        return [
            { id: 'cardio', name: 'Cardio', icon: 'fa-running' },
            { id: 'strength', name: 'Strength', icon: 'fa-dumbbell' },
            { id: 'flexibility', name: 'Flexibility', icon: 'fa-child' },
            { id: 'sports', name: 'Sports', icon: 'fa-basketball-ball' }
        ];
    }
}