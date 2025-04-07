// dashboard.js - Dashboard rendering and management
export class DashboardModule {
    constructor(userModule, workoutModule, nutritionModule, goalsModule) {
        this.userModule = userModule;
        this.workoutModule = workoutModule;
        this.nutritionModule = nutritionModule;
        this.goalsModule = goalsModule;
        this.container = document.getElementById('dashboardContainer');
    }

    render() {
        if (!this.container) {
            console.error("Dashboard container not found");
            return;
        }

        const userData = this.userModule.getUserData();
        const activityData = this.userModule.getActivitySummary();
        const recentWorkouts = this.workoutModule.getRecentWorkouts(3);
        const weeklyStats = this.workoutModule.getWeeklyStats();
        const nutritionToday = this.nutritionModule.getDailyNutrition();
        const activeGoals = this.goalsModule.getActiveGoals();

        // Create dashboard HTML
        this.container.innerHTML = `
            <h1>Welcome to Your Fitness Dashboard</h1>
            
            <div class="dashboard-grid">
                <!-- User Profile Summary -->
                <div class="dashboard-card">
                    <h2>Profile Summary</h2>
                    <div class="profile-summary">
                        <div class="stat">
                            <span class="label">Height:</span>
                            <span class="value">${userData.height} cm</span>
                        </div>
                        <div class="stat">
                            <span class="label">Weight:</span>
                            <span class="value">${userData.weight} kg</span>
                        </div>
                        <div class="stat">
                            <span class="label">BMI:</span>
                            <span class="value">${this.userModule.calculateBMI()}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Activity Summary -->
                <div class="dashboard-card">
                    <h2>Activity Summary</h2>
                    <div class="activity-stats">
                        <div class="stat-circle">
                            <div class="stat-number">${activityData.workoutsCompleted}</div>
                            <div class="stat-label">Workouts</div>
                        </div>
                        <div class="stat-circle">
                            <div class="stat-number">${weeklyStats.totalWorkouts}</div>
                            <div class="stat-label">This Week</div>
                        </div>
                        <div class="stat-circle">
                            <div class="stat-number">${activityData.streakDays}</div>
                            <div class="stat-label">Day Streak</div>
                        </div>
                    </div>
                </div>
                
                <!-- Nutrition Summary -->
                <div class="dashboard-card">
                    <h2>Today's Nutrition</h2>
                    <div class="nutrition-summary">
                        <div class="nutrition-circle">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="#f0f0f0" stroke-width="12" />
                                <circle cx="60" cy="60" r="54" fill="none" stroke="#4CAF50" stroke-width="12" 
                                        stroke-dasharray="339.3" stroke-dashoffset="${339.3 - (339.3 * Math.min(nutritionToday.calories / 2000, 1))}" />
                                <text x="60" y="55" text-anchor="middle" dominant-baseline="middle" font-size="18">${nutritionToday.calories}</text>
                                <text x="60" y="75" text-anchor="middle" dominant-baseline="middle" font-size="12">calories</text>
                            </svg>
                        </div>
                        <div class="nutrition-macros">
                            <div class="macro">
                                <span class="macro-label">Protein</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${Math.min(nutritionToday.protein/60*100, 100)}%"></div>
                                </div>
                                <span class="macro-value">${nutritionToday.protein}g</span>
                            </div>
                            <div class="macro">
                                <span class="macro-label">Carbs</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${Math.min(nutritionToday.carbs/250*100, 100)}%"></div>
                                </div>
                                <span class="macro-value">${nutritionToday.carbs}g</span>
                            </div>
                            <div class="macro">
                                <span class="macro-label">Fat</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${Math.min(nutritionToday.fat/65*100, 100)}%"></div>
                                </div>
                                <span class="macro-value">${nutritionToday.fat}g</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Workouts -->
                <div class="dashboard-card">
                    <h2>Recent Workouts</h2>
                    <div class="recent-workouts">
                        ${recentWorkouts.length ? 
                            recentWorkouts.map(workout => `
                                <div class="workout-item">
                                    <div class="workout-icon">
                                        <i class="fas ${this.getWorkoutIcon(workout.type)}"></i>
                                    </div>
                                    <div class="workout-details">
                                        <h3>${workout.name || workout.type}</h3>
                                        <p>${new Date(workout.date).toLocaleDateString()} • ${workout.duration} min • ${workout.calories} cal</p>
                                    </div>
                                </div>
                            `).join('') : 
                            '<p class="empty-state">No recent workouts. Time to get moving!</p>'
                        }
                        <button class="btn btn-outline" id="addWorkoutBtn">
                            <i class="fas fa-plus"></i> Add Workout
                        </button>
                    </div>
                </div>
                
                <!-- Weekly Progress Chart -->
                <div class="dashboard-card">
                    <h2>Weekly Progress</h2>
                    <div style="height: 200px; position: relative;">
                        <canvas id="weeklyProgressChart"></canvas>
                    </div>
                </div>
                
                <!-- Goals Tracker -->
                <div class="dashboard-card">
                    <h2>Goals</h2>
                    <div class="goals-list">
                        ${activeGoals.length ? 
                            activeGoals.map(goal => `
                                <div class="goal-item">
                                    <div class="goal-info">
                                        <h3>${this.formatGoalTitle(goal)}</h3>
                                        <p>Target: ${goal.target} ${goal.unit} by ${new Date(goal.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <div class="goal-progress">
                                        <div class="progress-bar">
                                            <div class="progress" style="width: ${goal.progress}%"></div>
                                        </div>
                                        <span class="progress-text">${goal.progress}%</span>
                                    </div>
                                </div>
                            `).join('') : 
                            '<p class="empty-state">No active goals. Set some to track your progress!</p>'
                        }
                        <button class="btn btn-outline" id="addGoalBtn">
                            <i class="fas fa-plus"></i> Add Goal
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Initialize the weekly progress chart
        this.initWeeklyChart();
        
        // Add event listeners
        this.addEventListeners();
    }

    initWeeklyChart() {
        const ctx = document.getElementById('weeklyProgressChart');
        if (!ctx) return;
        
        const caloriesData = this.nutritionModule.getWeeklyCalories();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: caloriesData.map(item => item.day),
                datasets: [
                    {
                        label: 'Calories',
                        data: caloriesData.map(item => item.calories),
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    getWorkoutIcon(type) {
        const icons = {
            'running': 'fa-running',
            'cardio': 'fa-heartbeat',
            'strength': 'fa-dumbbell',
            'yoga': 'fa-child',
            'cycling': 'fa-bicycle',
            'swimming': 'fa-swimmer'
        };
        return icons[type?.toLowerCase()] || 'fa-dumbbell';
    }

    formatGoalTitle(goal) {
        switch(goal.type) {
            case 'weight':
                return `Reach ${goal.target} ${goal.unit}`;
            case 'workout':
                return `Complete ${goal.target} ${goal.unit}`;
            default:
                return `${goal.type}: ${goal.target} ${goal.unit}`;
        }
    }

    addEventListeners() {
        const addWorkoutBtn = document.getElementById('addWorkoutBtn');
        if (addWorkoutBtn) {
            addWorkoutBtn.addEventListener('click', () => {
                // For demo, just add a sample workout
                const workoutTypes = this.workoutModule.getSampleWorkoutTypes();
                const randomType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
                const newWorkout = this.workoutModule.addWorkout({
                    name: `${randomType.name} Workout`,
                    type: randomType.id,
                    duration: Math.floor(Math.random() * 40) + 20, // 20-60 minutes
                    calories: Math.floor(Math.random() * 300) + 100 // 100-400 calories
                });
                
                // Update the dashboard to show the new workout
                this.render();
            });
        }

        const addGoalBtn = document.getElementById('addGoalBtn');
        if (addGoalBtn) {
            addGoalBtn.addEventListener('click', () => {
                // For demo, add a sample goal
                const goalTypes = ['weight', 'workout', 'steps', 'meditation'];
                const randomType = goalTypes[Math.floor(Math.random() * goalTypes.length)];
                
                let newGoal;
                if (randomType === 'weight') {
                    newGoal = this.goalsModule.addGoal({
                        type: 'weight',
                        target: 65,
                        current: 70,
                        unit: 'kg',
                        deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString()
                    });
                } else if (randomType === 'workout') {
                    newGoal = this.goalsModule.addGoal({
                        type: 'workout',
                        target: 20,
                        current: 0,
                        unit: 'sessions',
                        deadline: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString()
                    });
                } else {
                    newGoal = this.goalsModule.addGoal({
                        type: randomType,
                        target: randomType === 'steps' ? 10000 : 30,
                        current: 0,
                        unit: randomType === 'steps' ? 'steps' : 'minutes',
                        deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
                    });
                }
                
                // Update the dashboard to show the new goal
                this.render();
            });
        }
    }
}