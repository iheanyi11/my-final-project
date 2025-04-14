import { ExerciseAPI } from '../services/exercise-api.js';

/**
 * Workout Module for Fitness Tracker
 * Handles workout generation, saving, management, and dashboard integration
 */

// Exercise database with categorized exercises
const exerciseDatabase = {
    strength: {
        
        chest: [
            { name: "Bench Press", difficulty: ["intermediate", "advanced"], equipment: "barbell", sets: 4, reps: "8-12" },
            { name: "Push-Ups", difficulty: ["beginner", "intermediate", "advanced"], equipment: "bodyweight", sets: 3, reps: "10-15" },
            { name: "Incline Dumbbell Press", difficulty: ["intermediate", "advanced"], equipment: "dumbbells", sets: 3, reps: "10-12" },
            { name: "Chest Flyes", difficulty: ["beginner", "intermediate"], equipment: "dumbbells", sets: 3, reps: "12-15" },
            { name: "Cable Crossovers", difficulty: ["intermediate"], equipment: "cable machine", sets: 3, reps: "15-20" }
        ],
        back: [
            { name: "Pull-Ups", difficulty: ["intermediate", "advanced"], equipment: "bodyweight", sets: 4, reps: "6-12" },
            { name: "Bent Over Rows", difficulty: ["beginner", "intermediate", "advanced"], equipment: "barbell", sets: 3, reps: "8-12" },
            { name: "Lat Pulldowns", difficulty: ["beginner", "intermediate"], equipment: "cable machine", sets: 3, reps: "10-15" },
            { name: "Deadlifts", difficulty: ["intermediate", "advanced"], equipment: "barbell", sets: 3, reps: "6-10" },
            { name: "T-Bar Rows", difficulty: ["intermediate"], equipment: "barbell", sets: 3, reps: "8-12" }
        ],
        legs: [
            { name: "Squats", difficulty: ["beginner", "intermediate", "advanced"], equipment: "barbell", sets: 4, reps: "8-12" },
            { name: "Lunges", difficulty: ["beginner", "intermediate"], equipment: "bodyweight", sets: 3, reps: "10-15 each leg" },
            { name: "Leg Press", difficulty: ["beginner", "intermediate", "advanced"], equipment: "machine", sets: 3, reps: "10-15" },
            { name: "Romanian Deadlifts", difficulty: ["intermediate", "advanced"], equipment: "barbell", sets: 3, reps: "8-12" },
            { name: "Calf Raises", difficulty: ["beginner", "intermediate"], equipment: "machine", sets: 4, reps: "15-20" }
        ],
        core: [
            { name: "Planks", difficulty: ["beginner", "intermediate", "advanced"], equipment: "bodyweight", sets: 3, reps: "30-60 sec" },
            { name: "Crunches", difficulty: ["beginner"], equipment: "bodyweight", sets: 3, reps: "15-20" },
            { name: "Russian Twists", difficulty: ["intermediate"], equipment: "bodyweight", sets: 3, reps: "20-30" },
            { name: "Hanging Leg Raises", difficulty: ["advanced"], equipment: "bar", sets: 3, reps: "10-15" },
            { name: "Ab Wheel Rollouts", difficulty: ["intermediate", "advanced"], equipment: "ab wheel", sets: 3, reps: "10-15" }
        ],
        arms: [
            { name: "Bicep Curls", difficulty: ["beginner", "intermediate"], equipment: "dumbbells", sets: 3, reps: "10-15" },
            { name: "Tricep Dips", difficulty: ["beginner", "intermediate", "advanced"], equipment: "bodyweight", sets: 3, reps: "10-15" },
            { name: "Hammer Curls", difficulty: ["beginner", "intermediate"], equipment: "dumbbells", sets: 3, reps: "10-15" },
            { name: "Skull Crushers", difficulty: ["intermediate"], equipment: "barbell", sets: 3, reps: "10-12" },
            { name: "Preacher Curls", difficulty: ["intermediate"], equipment: "barbell", sets: 3, reps: "10-12" }
        ],
        shoulders: [
            { name: "Overhead Press", difficulty: ["intermediate", "advanced"], equipment: "barbell", sets: 3, reps: "8-12" },
            { name: "Lateral Raises", difficulty: ["beginner", "intermediate"], equipment: "dumbbells", sets: 3, reps: "12-15" },
            { name: "Front Raises", difficulty: ["beginner", "intermediate"], equipment: "dumbbells", sets: 3, reps: "12-15" },
            { name: "Face Pulls", difficulty: ["intermediate"], equipment: "cable", sets: 3, reps: "12-15" },
            { name: "Shrugs", difficulty: ["beginner", "intermediate"], equipment: "dumbbells", sets: 3, reps: "12-15" }
        ]
    },
    cardio: {
        hiit: [
            { name: "Burpees", difficulty: ["intermediate", "advanced"], duration: "30 sec work, 30 sec rest", rounds: 8 },
            { name: "Mountain Climbers", difficulty: ["beginner", "intermediate"], duration: "30 sec work, 30 sec rest", rounds: 8 },
            { name: "Jump Squats", difficulty: ["intermediate"], duration: "30 sec work, 30 sec rest", rounds: 8 },
            { name: "High Knees", difficulty: ["beginner", "intermediate"], duration: "30 sec work, 30 sec rest", rounds: 8 }
        ],
        steady: [
            { name: "Jogging", difficulty: ["beginner", "intermediate", "advanced"], duration: "20-60 min" },
            { name: "Treadmill Walking", difficulty: ["beginner"], duration: "30-60 min" },
            { name: "Elliptical", difficulty: ["beginner", "intermediate"], duration: "30-45 min" },
            { name: "Stair Climber", difficulty: ["intermediate", "advanced"], duration: "20-45 min" }
        ],
        intervals: [
            { name: "Sprint Intervals", difficulty: ["intermediate", "advanced"], pattern: "1 min sprint, 2 min jog", rounds: 10 },
            { name: "Hill Sprints", difficulty: ["advanced"], pattern: "30 sec sprint, 90 sec walk", rounds: 10 },
            { name: "Pyramid Intervals", difficulty: ["intermediate"], pattern: "30/60/90/60/30 sec", rounds: 3 },
            { name: "Fartlek Training", difficulty: ["intermediate"], duration: "30-45 min varied pace" }
        ]
    },
    cycling: {
        road: [
            { name: "Endurance Ride", difficulty: ["beginner", "intermediate", "advanced"], distance: "20-100 km", intensity: "moderate" },
            { name: "Hill Repeats", difficulty: ["intermediate", "advanced"], reps: "5-10 hills", intensity: "high" },
            { name: "Tempo Ride", difficulty: ["intermediate"], duration: "45-90 min", intensity: "moderate-high" }
        ],
        mountain: [
            { name: "Single Track Ride", difficulty: ["intermediate", "advanced"], distance: "10-30 km", terrain: "varied" },
            { name: "Technical Descent", difficulty: ["advanced"], duration: "30-60 min", terrain: "technical" },
            { name: "Cross Country Loop", difficulty: ["intermediate"], distance: "15-40 km", terrain: "mixed" }
        ],
        indoor: [
            { name: "Spin Class", difficulty: ["beginner", "intermediate", "advanced"], duration: "45-60 min" },
            { name: "Interval Training", difficulty: ["intermediate", "advanced"], pattern: "1 min sprint, 2 min recovery", rounds: 10 },
            { name: "Virtual Ride", difficulty: ["beginner", "intermediate"], duration: "30-60 min", type: "guided" }
        ]
    }
};

// Store user's saved workouts
let savedWorkouts = [];

// DOM elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize workout page
    initWorkoutPage();
    
    // Load saved workouts from storage
    loadSavedWorkouts();

    // Initialize dashboard elements
    initDashboardWorkouts();
});

function initWorkoutPage() {
    // Set up workout type button event listeners
    const workoutTypeButtons = document.querySelectorAll('.workout-btn');
    workoutTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            workoutTypeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show/hide related options
            toggleWorkoutOptions(this.id);
        });
    });
    
    // Duration slider
    const durationSlider = document.getElementById('duration');
    const durationValue = document.getElementById('duration-value');
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', function() {
            durationValue.textContent = this.value;
        });
    }
    
    // Cycling distance slider
    const cyclingDistanceSlider = document.getElementById('cycling-distance');
    const distanceValue = document.getElementById('distance-value');
    if (cyclingDistanceSlider && distanceValue) {
        cyclingDistanceSlider.addEventListener('input', function() {
            distanceValue.textContent = this.value;
        });
    }
    
    // Exercise search functionality
    const exerciseSearch = document.getElementById('exercise-search');
    if (exerciseSearch) {
        exerciseSearch.addEventListener('input', handleExerciseSearch);
    }
    
    // Generate workout button
    const generateWorkoutBtn = document.getElementById('generate-workout');
    if (generateWorkoutBtn) {
        generateWorkoutBtn.addEventListener('click', generateWorkout);
    }
    
    // Save workout button
    const saveWorkoutBtn = document.getElementById('save-workout');
    if (saveWorkoutBtn) {
        saveWorkoutBtn.addEventListener('click', saveWorkout);
    }
    
    // Share workout button
    const shareWorkoutBtn = document.getElementById('share-workout');
    if (shareWorkoutBtn) {
        shareWorkoutBtn.addEventListener('click', shareWorkout);
    }
    
    // Print workout button
    const printWorkoutBtn = document.getElementById('print-workout');
    if (printWorkoutBtn) {
        printWorkoutBtn.addEventListener('click', printWorkout);
    }
}

function toggleWorkoutOptions(buttonId) {
    // Hide all option groups first
    document.getElementById('target-area').classList.add('hidden');
    document.getElementById('cardio-options').classList.add('hidden');
    document.getElementById('cycling-options').classList.add('hidden');
    document.getElementById('custom-options').classList.add('hidden');
    
    // Show relevant options based on selected workout type
    switch(buttonId) {
        case 'strength-btn':
            document.getElementById('target-area').classList.remove('hidden');
            break;
        case 'cardio-btn':
            document.getElementById('cardio-options').classList.remove('hidden');
            break;
        case 'cycling-btn':
            document.getElementById('cycling-options').classList.remove('hidden');
            break;
        case 'custom-btn':
            document.getElementById('custom-options').classList.remove('hidden');
            break;
    }
}

function handleExerciseSearch() {
    const searchTerm = document.getElementById('exercise-search').value.toLowerCase();
    const resultsContainer = document.getElementById('exercise-results');
    
    if (searchTerm.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    // Search through exercise database
    let results = [];
    
    // Search through strength exercises
    for (const muscleGroup in exerciseDatabase.strength) {
        exerciseDatabase.strength[muscleGroup].forEach(exercise => {
            if (exercise.name.toLowerCase().includes(searchTerm) || 
                muscleGroup.toLowerCase().includes(searchTerm)) {
                results.push({
                    name: exercise.name,
                    muscleGroup: muscleGroup,
                    category: 'strength',
                    details: exercise
                });
            }
        });
    }
    
    // Search through cardio exercises
    for (const cardioType in exerciseDatabase.cardio) {
        exerciseDatabase.cardio[cardioType].forEach(exercise => {
            if (exercise.name.toLowerCase().includes(searchTerm) || 
                cardioType.toLowerCase().includes(searchTerm)) {
                results.push({
                    name: exercise.name,
                    type: cardioType,
                    category: 'cardio',
                    details: exercise
                });
            }
        });
    }
    
    // Search through cycling exercises
    for (const cyclingType in exerciseDatabase.cycling) {
        exerciseDatabase.cycling[cyclingType].forEach(exercise => {
            if (exercise.name.toLowerCase().includes(searchTerm) || 
                cyclingType.toLowerCase().includes(searchTerm)) {
                results.push({
                    name: exercise.name,
                    type: cyclingType,
                    category: 'cycling',
                    details: exercise
                });
            }
        });
    }
    
    // Display results
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('exercise-results');
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No exercises found. Try a different search term.</p>';
        return;
    }
    
    const resultsList = document.createElement('ul');
    resultsList.className = 'exercise-search-results';
    
    results.forEach((result, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'exercise-result-item';
        
        // Create exercise info
        let exerciseInfo;
        if (result.category === 'strength') {
            exerciseInfo = `<strong>${result.name}</strong> (${result.muscleGroup})`;
        } else {
            exerciseInfo = `<strong>${result.name}</strong> (${result.type})`;
        }
        
        listItem.innerHTML = `
            ${exerciseInfo}
            <button class="add-exercise-btn" data-exercise='${JSON.stringify(result)}'>
                <i class="fas fa-plus"></i> Add
            </button>
        `;
        
        resultsList.appendChild(listItem);
    });
    
    resultsContainer.appendChild(resultsList);
    
    // Add event listeners to add buttons
    const addButtons = document.querySelectorAll('.add-exercise-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const exerciseData = JSON.parse(this.getAttribute('data-exercise'));
            addToCustomWorkout(exerciseData);
        });
    });
}

function addToCustomWorkout(exerciseData) {
    const customWorkoutList = document.getElementById('custom-workout-list');
    
    // Create unique ID for this exercise in the custom workout
    const exerciseId = `exercise-${Date.now()}`;
    
    const listItem = document.createElement('li');
    listItem.className = 'custom-workout-item';
    listItem.id = exerciseId;
    
    // Create exercise content based on category
    let exerciseContent;
    if (exerciseData.category === 'strength') {
        exerciseContent = `
            <div class="exercise-info">
                <span class="exercise-name">${exerciseData.name}</span>
                <span class="exercise-target">${exerciseData.muscleGroup}</span>
                <div class="exercise-params">
                    <label>Sets: <input type="number" class="sets-input" value="${exerciseData.details.sets || 3}" min="1" max="10"></label>
                    <label>Reps: <input type="text" class="reps-input" value="${exerciseData.details.reps || '10'}" maxlength="10"></label>
                </div>
            </div>
        `;
    } else if (exerciseData.category === 'cardio') {
        exerciseContent = `
            <div class="exercise-info">
                <span class="exercise-name">${exerciseData.name}</span>
                <span class="exercise-target">${exerciseData.type}</span>
                <div class="exercise-params">
                    <label>Duration: <input type="text" class="duration-input" value="${exerciseData.details.duration || '10 min'}" maxlength="15"></label>
                </div>
            </div>
        `;
    } else { // cycling
        exerciseContent = `
            <div class="exercise-info">
                <span class="exercise-name">${exerciseData.name}</span>
                <span class="exercise-target">${exerciseData.type}</span>
                <div class="exercise-params">
                    <label>Distance: <input type="text" class="distance-input" value="${exerciseData.details.distance || '10 km'}" maxlength="15"></label>
                </div>
            </div>
        `;
    }
    
    listItem.innerHTML = `
        ${exerciseContent}
        <div class="exercise-actions">
            <button class="remove-exercise-btn" data-id="${exerciseId}">
                <i class="fas fa-trash"></i>
            </button>
            <button class="move-up-btn" data-id="${exerciseId}">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button class="move-down-btn" data-id="${exerciseId}">
                <i class="fas fa-arrow-down"></i>
            </button>
        </div>
    `;
    
    customWorkoutList.appendChild(listItem);
    
    // Add event listeners to buttons
    listItem.querySelector('.remove-exercise-btn').addEventListener('click', function() {
        const exerciseId = this.getAttribute('data-id');
        document.getElementById(exerciseId).remove();
    });
    
    listItem.querySelector('.move-up-btn').addEventListener('click', function() {
        const exerciseId = this.getAttribute('data-id');
        moveExercise(exerciseId, 'up');
    });
    
    listItem.querySelector('.move-down-btn').addEventListener('click', function() {
        const exerciseId = this.getAttribute('data-id');
        moveExercise(exerciseId, 'down');
    });
}

function moveExercise(exerciseId, direction) {
    const exerciseItem = document.getElementById(exerciseId);
    const list = exerciseItem.parentNode;
    
    if (direction === 'up' && exerciseItem.previousElementSibling) {
        list.insertBefore(exerciseItem, exerciseItem.previousElementSibling);
    } else if (direction === 'down' && exerciseItem.nextElementSibling) {
        list.insertBefore(exerciseItem.nextElementSibling, exerciseItem);
    }
}

function generateWorkout() {
    // Get selected workout type
    const activeButton = document.querySelector('.workout-btn.active');
    if (!activeButton) return;
    
    const workoutType = activeButton.id.replace('-btn', '');
    const difficulty = document.getElementById('difficulty').value;
    const duration = document.getElementById('duration').value;
    
    let workoutPlan;
    
    switch(workoutType) {
        case 'strength':
            workoutPlan = generateStrengthWorkout(difficulty, duration);
            break;
        case 'cardio':
            const cardioType = document.querySelector('input[name="cardio-type"]:checked')?.value || 'hiit';
            workoutPlan = generateCardioWorkout(cardioType, difficulty, duration);
            break;
        case 'cycling':
            const cyclingType = document.querySelector('input[name="cycling-type"]:checked')?.value || 'road';
            const distance = document.getElementById('cycling-distance').value;
            workoutPlan = generateCyclingWorkout(cyclingType, difficulty, distance);
            break;
        case 'custom':
            workoutPlan = generateCustomWorkout();
            break;
    }
    
    if (workoutPlan) {
        displayWorkoutPlan(workoutPlan);
    }
}

function generateStrengthWorkout(difficulty, duration) {
    // Get selected target areas
    const targetCheckboxes = document.querySelectorAll('input[name="target"]:checked');
    let targetAreas = Array.from(targetCheckboxes).map(checkbox => checkbox.value);
    
    // If no areas selected, choose random ones
    if (targetAreas.length === 0) {
        const allAreas = ['chest', 'back', 'legs', 'core', 'arms', 'shoulders'];
        targetAreas = allAreas.sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    
    // Calculate number of exercises based on duration
    const exercisesPerArea = Math.max(1, Math.floor(parseInt(duration) / (15 * targetAreas.length)));
    
    // Build workout
    const exercises = [];
    let muscleDistribution = {};
    
    targetAreas.forEach(area => {
        const areaExercises = exerciseDatabase.strength[area].filter(ex => 
            ex.difficulty.includes(difficulty)
        );
        
        // Select random exercises for this area
        const selectedExercises = areaExercises
            .sort(() => 0.5 - Math.random())
            .slice(0, exercisesPerArea);
        
        exercises.push(...selectedExercises.map(ex => ({
            ...ex,
            muscleGroup: area
        })));
        
        // Track muscle distribution for chart
        muscleDistribution[area] = exercisesPerArea;
    });
    
    return {
        type: 'strength',
        difficulty: difficulty,
        duration: duration,
        targetAreas: targetAreas,
        exercises: exercises,
        muscleDistribution: muscleDistribution
    };
}

function generateCardioWorkout(cardioType, difficulty, duration) {
    // Get cardio exercises filtered by difficulty
    const cardioExercises = exerciseDatabase.cardio[cardioType].filter(ex => 
        ex.difficulty.includes(difficulty)
    );
    
    // Select exercises based on duration
    const exerciseCount = Math.max(1, Math.floor(parseInt(duration) / 15));
    const selectedExercises = cardioExercises
        .sort(() => 0.5 - Math.random())
        .slice(0, exerciseCount);
    
    // Calculate time per exercise
    const timePerExercise = Math.floor(parseInt(duration) / selectedExercises.length);
    
    // Adjust exercise duration
    const exercises = selectedExercises.map(ex => ({
        ...ex,
        adjustedDuration: `${timePerExercise} minutes`
    }));
    
    return {
        type: 'cardio',
        subtype: cardioType,
        difficulty: difficulty,
        duration: duration,
        exercises: exercises
    };
}

function generateCyclingWorkout(cyclingType, difficulty, distance) {
    // Get cycling exercises filtered by difficulty
    const cyclingExercises = exerciseDatabase.cycling[cyclingType].filter(ex => 
        ex.difficulty.includes(difficulty)
    );
    
    // Select an exercise
    const selectedExercise = cyclingExercises[Math.floor(Math.random() * cyclingExercises.length)];
    
    // Adjust for selected distance
    const exercise = {
        ...selectedExercise,
        adjustedDistance: `${distance} km`
    };
    
    // Estimate duration (rough calculation: 20km/h for beginner, 25km/h for intermediate, 30km/h for advanced)
    let speed;
    switch(difficulty) {
        case 'beginner': speed = 20; break;
        case 'intermediate': speed = 25; break;
        case 'advanced': speed = 30; break;
        default: speed = 20;
    }
    
    const estimatedDuration = Math.ceil(parseInt(distance) / speed * 60);
    
    return {
        type: 'cycling',
        subtype: cyclingType,
        difficulty: difficulty,
        distance: distance,
        estimatedDuration: estimatedDuration,
        exercises: [exercise]
    };
}

function generateCustomWorkout() {
    const customItems = document.querySelectorAll('#custom-workout-list .custom-workout-item');
    if (customItems.length === 0) {
        alert('Please add at least one exercise to your custom workout.');
        return null;
    }
    
    const exercises = [];
    const muscleGroups = {};
    
    customItems.forEach(item => {
        const name = item.querySelector('.exercise-name').textContent;
        const target = item.querySelector('.exercise-target').textContent;
        
        // Track exercise details based on its type
        if (item.querySelector('.sets-input')) {
            // Strength exercise
            const sets = item.querySelector('.sets-input').value;
            const reps = item.querySelector('.reps-input').value;
            
            exercises.push({
                name: name,
                muscleGroup: target,
                sets: sets,
                reps: reps
            });
            
            // Track muscle distribution
            muscleGroups[target] = (muscleGroups[target] || 0) + 1;
        } else if (item.querySelector('.duration-input')) {
            // Cardio exercise
            const duration = item.querySelector('.duration-input').value;
            
            exercises.push({
                name: name,
                type: target,
                duration: duration
            });
        } else if (item.querySelector('.distance-input')) {
            // Cycling exercise
            const distance = item.querySelector('.distance-input').value;
            
            exercises.push({
                name: name,
                type: target,
                distance: distance
            });
        }
    });
    
    // Calculate total duration (estimate)
    const totalDuration = exercises.length * 10; // Rough estimate
    
    return {
        type: 'custom',
        duration: totalDuration,
        exercises: exercises,
        muscleDistribution: muscleGroups
    };
}

function displayWorkoutPlan(workoutPlan) {
    // Show workout plan section
    const workoutPlanSection = document.getElementById('workout-plan');
    workoutPlanSection.classList.remove('hidden');
    
    // Scroll to workout plan
    workoutPlanSection.scrollIntoView({ behavior: 'smooth' });
    
    // Fill in workout details
    document.getElementById('workout-type-display').textContent = capitalizeFirstLetter(workoutPlan.type);
    document.getElementById('workout-difficulty-display').textContent = capitalizeFirstLetter(workoutPlan.difficulty || 'Custom');
    
    const durationDisplay = document.getElementById('workout-duration-display');
    if (workoutPlan.type === 'cycling') {
        durationDisplay.textContent = workoutPlan.estimatedDuration || '30';
    } else {
        durationDisplay.textContent = workoutPlan.duration || '30';
    }
    
    // Generate exercise list
    const exercisesContainer = document.getElementById('workout-exercises');
    exercisesContainer.innerHTML = '';
    
    workoutPlan.exercises.forEach((exercise, index) => {
        const exerciseElement = document.createElement('div');
        exerciseElement.className = 'exercise-item';
        
        let exerciseContent;
        
        if (workoutPlan.type === 'strength' || (workoutPlan.type === 'custom' && exercise.sets)) {
            // Strength exercise
            exerciseContent = `
                <div class="exercise-number">${index + 1}</div>
                <div class="exercise-details">
                    <h3>${exercise.name}</h3>
                    <div class="exercise-meta">
                        <span class="muscle-group">Target: ${capitalizeFirstLetter(exercise.muscleGroup)}</span>
                        <span class="sets-reps">Sets: ${exercise.sets} | Reps: ${exercise.reps}</span>
                        <span class="equipment">Equipment: ${exercise.equipment || 'None'}</span>
                    </div>
                </div>
            `;
        } else if (workoutPlan.type === 'cardio' || (workoutPlan.type === 'custom' && exercise.duration)) {
            // Cardio exercise
            exerciseContent = `
                <div class="exercise-number">${index + 1}</div>
                <div class="exercise-details">
                    <h3>${exercise.name}</h3>
                    <div class="exercise-meta">
                        <span class="cardio-type">Type: ${capitalizeFirstLetter(exercise.type || workoutPlan.subtype)}</span>
                        <span class="duration">Duration: ${exercise.adjustedDuration || exercise.duration}</span>
                        ${exercise.rounds ? `<span class="rounds">Rounds: ${exercise.rounds}</span>` : ''}
                    </div>
                </div>
            `;
        } else {
            // Cycling exercise
            exerciseContent = `
                <div class="exercise-number">${index + 1}</div>
                <div class="exercise-details">
                    <h3>${exercise.name}</h3>
                    <div class="exercise-meta">
                        <span class="cycling-type">Type: ${capitalizeFirstLetter(exercise.type || workoutPlan.subtype)}</span>
                        <span class="distance">Distance: ${exercise.adjustedDistance || exercise.distance}</span>
                        <span class="intensity">Intensity: ${exercise.intensity || 'Moderate'}</span>
                    </div>
                </div>
            `;
        }
        
        exerciseElement.innerHTML = exerciseContent;
        exercisesContainer.appendChild(exerciseElement);
    });
    
    // Generate chart for muscle distribution
    generateMuscleChart(workoutPlan);
    
    // Store current workout for saving
    window.currentWorkout = workoutPlan;
}

function generateMuscleChart(workoutPlan) {
    const chartCanvas = document.getElementById('muscle-group-chart');
    
    // If there's no muscle distribution data, hide chart container
    const chartContainer = document.querySelector('.workout-chart-container');
    
    // Check if workoutPlan has muscle distribution data
    if (!workoutPlan.muscleDistribution || Object.keys(workoutPlan.muscleDistribution).length === 0) {
        chartContainer.classList.add('hidden');
        return;
    } else {
        chartContainer.classList.remove('hidden');
    }
    
    // If Chart.js is available, create chart
    if (window.Chart) {
        // Destroy existing chart if it exists
        if (window.muscleChart) {
            window.muscleChart.destroy();
        }
        
        const muscleGroups = Object.keys(workoutPlan.muscleDistribution).map(group => capitalizeFirstLetter(group));
        const exerciseCounts = Object.values(workoutPlan.muscleDistribution);
        
        // Generate colors
        const colors = generateColors(muscleGroups.length);
        
        window.muscleChart = new Chart(chartCanvas, {
            type: 'pie',
            data: {
                labels: muscleGroups,
                datasets: [{
                    data: exerciseCounts,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Exercise Distribution by Muscle Group'
                    }
                }
            }
        });
    }
}

function generateColors(count) {
    // Generate visually distinct colors
    const baseColors = [
        '#FF6384', // Red
        '#36A2EB', // Blue
        '#FFCE56', // Yellow
        '#4BC0C0', // Teal
        '#9966FF', // Purple
        '#FF9F40', // Orange
        '#C9CBCF', // Grey
        '#7CFC00', // Lawn Green
        '#FF69B4', // Hot Pink
        '#00CED1'  // Dark Turquoise
    ];
    
    // If we need more colors than in our base set, generate them
    if (count <= baseColors.length) {
        return baseColors.slice(0, count);
    } else {
        const colors = [...baseColors];
        for (let i = baseColors.length; i < count; i++) {
            // Generate random color
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            colors.push(`rgb(${r}, ${g}, ${b})`);
        }
        return colors;
    }
}

function saveWorkout() {
    if (!window.currentWorkout) {
        alert('No workout to save.');
        return;
    }
    
    // Add unique ID and timestamp
    const workoutToSave = {
        ...window.currentWorkout,
        id: `workout-${Date.now()}`,
        createdAt: new Date().toISOString(),
        name: `${capitalizeFirstLetter(window.currentWorkout.type)} Workout - ${formatDate(new Date())}`
    };
    
    // Add to saved workouts
    savedWorkouts.push(workoutToSave);
    
    // Save to localStorage
    try {
        localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
        
        // Show success message
        alert('Workout saved successfully!');
        
        // Update saved workouts display
        displaySavedWorkouts();
    } catch (error) {
        console.error('Failed to save workout:', error);
        alert('Failed to save workout. Please try again.');
    }
}

function loadSavedWorkouts() {
    try {
        const storedWorkouts = localStorage.getItem('savedWorkouts');
        if (storedWorkouts) {
            savedWorkouts = JSON.parse(storedWorkouts);
            displaySavedWorkouts();
        }
    } catch (error) {
        console.error('Failed to load saved workouts:', error);
    }
}

function displaySavedWorkouts() {
    const workoutsList = document.getElementById('user-workouts');
    if (!workoutsList) return;
    
    if (savedWorkouts.length === 0) {
        workoutsList.innerHTML = '<p class="no-workouts">No saved workouts yet. Generate and save a workout to see it here.</p>';
        return;
    }
    
    workoutsList.innerHTML = '';
    
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...savedWorkouts].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    sortedWorkouts.forEach(workout => {
        const workoutCard = document.createElement('div');
        workoutCard.className = 'saved-workout-card';
        workoutCard.dataset.workoutId = workout.id;
        
        // Workout duration display
        const durationDisplay = workout.type === 'cycling' && workout.estimatedDuration 
            ? `${workout.estimatedDuration} min`
            : `${workout.duration} min`;
            
        // Exercise count
        const exerciseCount = workout.exercises.length;
            
        workoutCard.innerHTML = `
            <div class="workout-card-header">
                <h3>${workout.name}</h3>
                <div class="workout-meta">
                    <span class="workout-type">${capitalizeFirstLetter(workout.type)}</span>
                    <span class="workout-difficulty">${capitalizeFirstLetter(workout.difficulty || '')}</span>
                </div>
            </div>
            <div class="workout-card-body">
                <div class="workout-stats">
                    <div class="stat">
                        <i class="fas fa-clock"></i>
                        <span>${durationDisplay}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-dumbbell"></i>
                        <span>${exerciseCount} exercises</span>
                    </div>
                </div>
                <p class="workout-date">Created: ${formatDate(new Date(workout.createdAt))}</p>
            </div>
            <div class="workout-card-footer">
                <button class="load-workout-btn" data-id="${workout.id}">
                    <i class="fas fa-play"></i> Load
                </button>
                <button class="delete-workout-btn" data-id="${workout.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        workoutsList.appendChild(workoutCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.load-workout-btn').forEach(button => {
        button.addEventListener('click', function() {
            const workoutId = this.getAttribute('data-id');
            loadWorkout(workoutId);
        });
    });
    
    document.querySelectorAll('.delete-workout-btn').forEach(button => {
        button.addEventListener('click', function() {
            const workoutId = this.getAttribute('data-id');
            deleteWorkout(workoutId);
        });
    });
}

function loadWorkout(workoutId) {
    const workout = savedWorkouts.find(w => w.id === workoutId);
    if (!workout) return;
    
    // Set current workout
    window.currentWorkout = workout;
    
    // Display workout
    displayWorkoutPlan(workout);
}

function deleteWorkout(workoutId) {
    if (confirm('Are you sure you want to delete this workout?')) {
        // Filter out the workout with the matching ID
        savedWorkouts = savedWorkouts.filter(workout => workout.id !== workoutId);
        
        // Save updated list to localStorage
        localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
        
        // Update display
        displaySavedWorkouts();
    }
}

function shareWorkout() {
    if (!window.currentWorkout) {
        alert('No workout to share.');
        return;
    }
    
    // Create shareable text
    const workoutName = window.currentWorkout.name || `${capitalizeFirstLetter(window.currentWorkout.type)} Workout`;
    
    let shareText = `Check out my ${workoutName}!\n\n`;
    
    // Add workout details
    shareText += `Type: ${capitalizeFirstLetter(window.currentWorkout.type)}\n`;
    if (window.currentWorkout.difficulty) {
        shareText += `Difficulty: ${capitalizeFirstLetter(window.currentWorkout.difficulty)}\n`;
    }
    
    if (window.currentWorkout.type === 'cycling') {
        shareText += `Distance: ${window.currentWorkout.distance} km\n`;
        shareText += `Estimated Duration: ${window.currentWorkout.estimatedDuration} minutes\n`;
    } else {
        shareText += `Duration: ${window.currentWorkout.duration} minutes\n`;
    }
    
    shareText += `\nExercises:\n`;
    
    // Add exercises
    window.currentWorkout.exercises.forEach((exercise, index) => {
        shareText += `${index + 1}. ${exercise.name}`;
        
        if (window.currentWorkout.type === 'strength' || exercise.sets) {
            shareText += ` - ${exercise.sets} sets x ${exercise.reps}`;
        } else if (exercise.duration) {
            shareText += ` - ${exercise.duration}`;
        } else if (exercise.distance) {
            shareText += ` - ${exercise.distance}`;
        }
        
        shareText += '\n';
    });
    
    shareText += `\nShared from My Fitness Tracker`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: workoutName,
            text: shareText
        }).catch(error => {
            console.error('Error sharing workout:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    // Create a textarea to hold the text
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    document.execCommand('copy');
    
    // Remove the textarea
    document.body.removeChild(textarea);
    
    // Notify user
    alert('Workout copied to clipboard! You can now paste it into a message or social media post.');
}

function printWorkout() {
    if (!window.currentWorkout) {
        alert('No workout to print.');
        return;
    }
    
    // Create printable content
    let printContent = `
        <html>
        <head>
            <title>${capitalizeFirstLetter(window.currentWorkout.type)} Workout</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #333; }
                h2 { color: #555; margin-top: 20px; }
                .workout-meta { margin-bottom: 20px; color: #666; }
                .exercise { margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
                .exercise-name { font-weight: bold; font-size: 18px; }
                .exercise-details { margin-top: 5px; color: #555; }
                .footer { margin-top: 30px; font-size: 12px; color: #999; text-align: center; }
            </style>
        </head>
        <body>
            <h1>${capitalizeFirstLetter(window.currentWorkout.type)} Workout</h1>
            
            <div class="workout-meta">
                <p><strong>Date:</strong> ${formatDate(new Date())}</p>
                <p><strong>Duration:</strong> ${window.currentWorkout.type === 'cycling' ? window.currentWorkout.estimatedDuration : window.currentWorkout.duration} minutes</p>
                ${window.currentWorkout.difficulty ? `<p><strong>Difficulty:</strong> ${capitalizeFirstLetter(window.currentWorkout.difficulty)}</p>` : ''}
                ${window.currentWorkout.distance ? `<p><strong>Distance:</strong> ${window.currentWorkout.distance} km</p>` : ''}
            </div>
            
            <h2>Exercises</h2>
    `;
    
    // Add exercises
    window.currentWorkout.exercises.forEach((exercise, index) => {
        printContent += `<div class="exercise">`;
        printContent += `<div class="exercise-name">${index + 1}. ${exercise.name}</div>`;
        printContent += `<div class="exercise-details">`;
        
        if (window.currentWorkout.type === 'strength' || exercise.sets) {
            printContent += `<p>Sets: ${exercise.sets} | Reps: ${exercise.reps}</p>`;
            if (exercise.muscleGroup) {
                printContent += `<p>Target Muscle: ${capitalizeFirstLetter(exercise.muscleGroup)}</p>`;
            }
            if (exercise.equipment) {
                printContent += `<p>Equipment: ${exercise.equipment}</p>`;
            }
        } else if (exercise.duration) {
            printContent += `<p>Duration: ${exercise.duration}</p>`;
            if (exercise.type) {
                printContent += `<p>Type: ${capitalizeFirstLetter(exercise.type)}</p>`;
            }
            if (exercise.rounds) {
                printContent += `<p>Rounds: ${exercise.rounds}</p>`;
            }
        } else if (exercise.distance) {
            printContent += `<p>Distance: ${exercise.distance}</p>`;
            if (exercise.type) {
                printContent += `<p>Type: ${capitalizeFirstLetter(exercise.type)}</p>`;
            }
            if (exercise.intensity) {
                printContent += `<p>Intensity: ${exercise.intensity}</p>`;
            }
        }
        
        printContent += `</div></div>`;
    });
    
    printContent += `
            <div class="footer">
                <p>Generated by My Fitness Tracker - ${formatDate(new Date())}</p>
            </div>
        </body>
        </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Trigger print dialog
    printWindow.onload = function() {
        printWindow.print();
        // printWindow.close(); // Uncomment to auto-close after print dialog
    };
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

function initDashboardWorkouts() {
    const recentWorkoutsContainer = document.querySelector('.recent-workouts-container') || 
                                    document.getElementById('recent-workouts-list') || 
                                    document.querySelector('#recent-workouts-section');
    const addWorkoutBtn = document.querySelector('[id$="add-workout"]');
    
    if (addWorkoutBtn) {
        addWorkoutBtn.addEventListener('click', () => {
            window.location.href = '/pages/workouts.html';
        });
    }
    
    loadRecentWorkouts();
}

function loadRecentWorkouts() {
    try {
        const storedWorkouts = localStorage.getItem('savedWorkouts');
        const workoutsContainer = document.querySelector('#recent-workouts-list') || 
                                 document.querySelector('.recent-workouts-container');
        if (!workoutsContainer) return;

        if (!storedWorkouts || JSON.parse(storedWorkouts).length === 0) {
            workoutsContainer.innerHTML = '<p class="no-workouts">No recent workouts. Time to get moving!</p>';
            return;
        }

        const savedWorkouts = JSON.parse(storedWorkouts);
        const recentWorkouts = savedWorkouts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);

        let workoutsHTML = '';
        recentWorkouts.forEach(workout => {
            const durationDisplay = workout.type === 'cycling' && workout.estimatedDuration 
                ? `${workout.estimatedDuration} min`
                : `${workout.duration} min`;
            const exerciseCount = workout.exercises.length;
            const workoutDate = formatDate(new Date(workout.createdAt));
            
            workoutsHTML += `
                <div class="workout-card" data-workout-id="${workout.id}">
                    <div class="workout-card-header">
                        <h3>${workout.name || `${capitalizeFirstLetter(workout.type)} Workout`}</h3>
                    </div>
                    <div class="workout-card-body">
                        <div class="workout-stats">
                            <div class="stat">
                                <i class="fas fa-clock"></i>
                                <span>${durationDisplay}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-dumbbell"></i>
                                <span>${exerciseCount} exercises</span>
                            </div>
                        </div>
                        <p class="workout-date">${workoutDate}</p>
                    </div>
                </div>
            `;
        });

        workoutsContainer.innerHTML = workoutsHTML;

        const workoutCards = document.querySelectorAll('.workout-card');
        workoutCards.forEach(card => {
            card.addEventListener('click', () => {
                const workoutId = card.dataset.workoutId;
                window.location.href = `/pages/workouts.html?workout=${workoutId}`;
            });
        });
    } catch (error) {
        console.error('Failed to load recent workouts:', error);
    }
}

// Make functions available globally for event handlers
window.handleExerciseSearch = handleExerciseSearch;
window.generateWorkout = generateWorkout;
window.saveWorkout = saveWorkout;
window.shareWorkout = shareWorkout;
window.printWorkout = printWorkout;
window.loadWorkout = loadWorkout;
window.deleteWorkout = deleteWorkout;

// Extend workoutModule with dashboard functions
export const workoutModule = {
    loadWorkout,
    shareWorkout,
    printWorkout,
    deleteWorkout,
    displaySavedWorkouts,
    initDashboardWorkouts,
    loadRecentWorkouts,

    async loadExercisesByTarget(target) {
        try {
            const exercises = await ExerciseAPI.fetchExercisesByTarget(target);
            console.log(`Fetched exercises for target "${target}":`, exercises);

            const exerciseResultsContainer = document.getElementById('exercise-results');
            if (!exerciseResultsContainer) {
                console.error('Exercise results container not found');
                return;
            }

            if (exercises.length === 0) {
                exerciseResultsContainer.innerHTML = '<p>No exercises found for this target area.</p>';
                return;
            }

            let exercisesHTML = '';
            exercises.forEach(exercise => {
                exercisesHTML += `
                    <div class="exercise-item">
                        <h3>${exercise.name}</h3>
                        <p><strong>Target:</strong> ${exercise.target}</p>
                        <p><strong>Equipment:</strong> ${exercise.equipment}</p>
                        <p><strong>Body Part:</strong> ${exercise.bodyPart}</p>
                    </div>
                `;
            });

            exerciseResultsContainer.innerHTML = exercisesHTML;
        } catch (error) {
            console.error('Error loading exercises by target:', error);
        }
    },
};

// Export the workoutModule object as the default export
export default workoutModule;