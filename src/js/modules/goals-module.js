// goals-module.js - Fitness goals tracking
export class GoalsModule {
    constructor() {
        this.goals = JSON.parse(localStorage.getItem('fitnessGoals')) || [
            {
                id: 1,
                type: 'weight',
                target: 65,
                current: 70,
                unit: 'kg',
                deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
                progress: 0
            },
            {
                id: 2,
                type: 'workout',
                target: 12,
                current: 3,
                unit: 'sessions',
                deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                progress: 25
            }
        ];
    }

    getGoals() {
        return this.goals;
    }

    addGoal(goal) {
        const newGoal = {
            id: Date.now(),
            progress: 0,
            ...goal
        };
        this.goals.push(newGoal);
        localStorage.setItem('fitnessGoals', JSON.stringify(this.goals));
        return newGoal;
    }

    updateGoalProgress(goalId, newCurrent) {
        const goalIndex = this.goals.findIndex(goal => goal.id === goalId);
        if (goalIndex !== -1) {
            this.goals[goalIndex].current = newCurrent;
            this.goals[goalIndex].progress = Math.min(
                100, 
                Math.round((newCurrent / this.goals[goalIndex].target) * 100)
            );
            localStorage.setItem('fitnessGoals', JSON.stringify(this.goals));
            return this.goals[goalIndex];
        }
        return null;
    }

    getActiveGoals() {
        const now = new Date();
        return this.goals.filter(goal => 
            new Date(goal.deadline) > now && goal.progress < 100);
    }
}