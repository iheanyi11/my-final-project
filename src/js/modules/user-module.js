// user-module.js - User profile management
export class UserModule {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('userData')) || {
            weight: 70, // kg
            height: 175, // cm
            age: 30,
            gender: 'Not specified',
            activityLevel: 'Moderate',
            weeklyGoal: 3 // workouts per week
        };
    }

    getUserData() {
        return this.userData;
    }

    updateUserData(newData) {
        this.userData = {...this.userData, ...newData};
        localStorage.setItem('userData', JSON.stringify(this.userData));
        return this.userData;
    }

    calculateBMI() {
        const heightInMeters = this.userData.height / 100;
        return (this.userData.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }

    getActivitySummary() {
        return {
            workoutsCompleted: localStorage.getItem('workoutsCompleted') || 0,
            totalCaloriesBurned: localStorage.getItem('totalCaloriesBurned') || 0,
            streakDays: localStorage.getItem('streakDays') || 0
        };
    }
}