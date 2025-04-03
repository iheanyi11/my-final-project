// Auth Module: Handles user authentication and management
export class AuthModule {
    constructor() {
        this.currentUser = null;
        this.localStorageKey = 'fitness_tracker_user';
    }
    
    // Check if user is logged in
    checkAuthStatus() {
        const userData = localStorage.getItem(this.localStorageKey);
        if (userData) {
            this.currentUser = JSON.parse(userData);
            return true;
        }
        return false;
    }
    
    // Register a new user
    async register(name, email, password) {
        // For demo purposes, we're storing the user in localStorage
        // In a real app, you would use a backend API
        
        // Check if email is already registered
        const existingUsers = JSON.parse(localStorage.getItem('fitness_tracker_users') || '[]');
        if (existingUsers.find(user => user.email === email)) {
            throw new Error('Email is already registered.');
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In a real app, NEVER store passwords in plain text
            created: new Date().toISOString(),
            fitnessGoals: [],
            workouts: [],
            nutritionLogs: []
        };
        
        // Add to existing users
        existingUsers.push(newUser);
        localStorage.setItem('fitness_tracker_users', JSON.stringify(existingUsers));
        
        // Set as current user
        this.currentUser = { ...newUser };
        delete this.currentUser.password; // Don't keep password in memory
        
        // Store in localStorage for session persistence
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.currentUser));
        
        return this.currentUser;
    }
    
    // Login existing user
    async login(email, password) {
        // Get users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('fitness_tracker_users') || '[]');
        
        // Find the user with matching email and password
        const user = existingUsers.find(user => user.email === email && user.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password.');
        }
        
        // Set as current user
        this.currentUser = { ...user };
        delete this.currentUser.password; // Don't keep password in memory
        
        // Store in localStorage for session persistence
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.currentUser));
        
        return this.currentUser;
    }
    
    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.localStorageKey);
        // Redirect to login page
        window.location.href = '../index.html';
    }
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Update user profile
    async updateProfile(updates) {
        if (!this.currentUser) {
            throw new Error('No user is logged in.');
        }
        
        // Get all users
        const existingUsers = JSON.parse(localStorage.getItem('fitness_tracker_users') || '[]');
        
        // Find and update the current user
        const updatedUsers = existingUsers.map(user => {
            if (user.id === this.currentUser.id) {
                return { ...user, ...updates };
            }
            return user;
        });
        
        // Update localStorage
        localStorage.setItem('fitness_tracker_users', JSON.stringify(updatedUsers));
        
        // Update current user
        this.currentUser = { ...this.currentUser, ...updates };
        delete this.currentUser.password; // Don't keep password in memory
        
        // Update session
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.currentUser));
        
        return this.currentUser;
    }
}