// goals-module.js - Module for handling fitness goals

export class GoalsModule {
    constructor() {
        // Initialize goals if not already in localStorage
        if (!localStorage.getItem('fitness_goals')) {
            localStorage.setItem('fitness_goals', JSON.stringify([]));
        }
    }

    // Get all goals
    getGoals() {
        const goals = JSON.parse(localStorage.getItem('fitness_goals') || '[]');
        
        // Calculate progress for each goal
        return goals.map(goal => {
            // Calculate progress percentage based on goal type
            let progressPercentage;
            
            if (goal.type === 'weight') {
                // For weight goals, check if target is less than or greater than current
                const isWeightLoss = goal.target < goal.current;
                
                if (isWeightLoss) {
                    // Weight loss goal: progress is how much weight has been lost
                    const initialWeight = goal.initialWeight || goal.current;
                    const weightLost = initialWeight - goal.current;
                    const weightToLose = initialWeight - goal.target;
                    progressPercentage = Math.min(100, Math.max(0, (weightLost / weightToLose) * 100));
                } else {
                    // Weight gain goal: progress is how much weight has been gained
                    const initialWeight = goal.initialWeight || goal.current;
                    const weightGained = goal.current - initialWeight;
                    const weightToGain = goal.target - initialWeight;
                    progressPercentage = Math.min(100, Math.max(0, (weightGained / weightToGain) * 100));
                }
            } else {
                // For other goals (steps, workouts, etc.), progress is current value as a percentage of target
                progressPercentage = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
            }
            
            // Round to whole number
            const progress = Math.round(progressPercentage);
            
            return {
                ...goal,
                progress
            };
        });
    }

    // Get active goals (not completed and not expired)
    getActiveGoals() {
        const allGoals = this.getGoals();
        const now = new Date();
        
        // Filter for goals that are not completed and not expired
        return allGoals.filter(goal => {
            // Check if deadline is in the future
            const isDeadlineValid = new Date(goal.deadline) >= now;
            
            // Check if goal is not completed (progress < 100%)
            const isNotCompleted = goal.progress < 100;
            
            return isDeadlineValid && isNotCompleted;
        });
    }

    // Add a new goal
    addGoal(goalData) {
        const goals = this.getGoals();
        
        // Create a new goal with ID and timestamp
        const newGoal = {
            id: Date.now(),
            ...goalData,
            initialWeight: goalData.type === 'weight' ? goalData.current : undefined,
            createdAt: new Date().toISOString()
        };
        
        // Add to goals array
        goals.push(newGoal);
        
        // Save to localStorage
        localStorage.setItem('fitness_goals', JSON.stringify(goals));
        
        return newGoal;
    }

    // Update goal progress
    updateGoalProgress(goalId, newValue) {
        const goals = this.getGoals();
        
        // Find goal index
        const goalIndex = goals.findIndex(goal => goal.id === goalId);
        
        if (goalIndex !== -1) {
            // Update current value
            goals[goalIndex].current = newValue;
            
            // Save to localStorage
            localStorage.setItem('fitness_goals', JSON.stringify(goals));
            
            return true;
        }
        
        return false;
    }

    // Delete a goal
    deleteGoal(goalId) {
        // Get current goals
        const goals = this.getGoals();
        
        // Filter out the goal to delete
        const updatedGoals = goals.filter(goal => goal.id !== goalId);
        
        // Save updated goals
        localStorage.setItem('fitness_goals', JSON.stringify(updatedGoals));
        
        // Return true to indicate success
        return true;
    }
}