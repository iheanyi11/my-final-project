// Import modules
import { AuthModule } from './modules/auth.js';
import { UIModule } from './modules/ui.js';
import { StorageModule } from './modules/storage.js';
// import { DashboardModule } from './modules/dashboard.js';
// import { WorkoutModule } from './modules/workout.js';
// import { NutritionModule } from './modules/nutrition.js';
// import { GoalsModule } from './modules/goals.js';
// import { RoutesModule } from './modules/routes.js';

// Main application class
class App {
    constructor() {
        // Initialize modules
        this.auth = new AuthModule();
        this.ui = new UIModule();
        this.storage = new StorageModule();
        
        // Feature modules - will be initialized after authentication
        this.dashboard = null;
        this.workout = null;
        this.nutrition = null;
        this.goals = null;
        this.routes = null;
        
        // Check if user is logged in
        this.init();
    }
    
    init() {
        // Check for auth status
        const isLoggedIn = this.auth.checkAuthStatus();
        
        if (isLoggedIn) {
            this.loadApp();
        } else {
            this.setupAuthListeners();
        }
    }
    
    setupAuthListeners() {
        // Get elements
        const signInBtn = document.getElementById('signInBtn');
        const signUpBtn = document.getElementById('signUpBtn');
        const switchToSignUp = document.getElementById('switchToSignUp');
        const switchToSignIn = document.getElementById('switchToSignIn');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        // Show sign in form
        signInBtn.addEventListener('click', () => {
            this.ui.hideElement('splashScreen');
            this.ui.showElement('signInForm');
        });
        
        // Show sign up form
        signUpBtn.addEventListener('click', () => {
            this.ui.hideElement('splashScreen');
            this.ui.showElement('signUpForm');
        });
        
        // Switch between forms
        switchToSignUp.addEventListener('click', (e) => {
            e.preventDefault();
            this.ui.hideElement('signInForm');
            this.ui.showElement('signUpForm');
        });
        
        switchToSignIn.addEventListener('click', (e) => {
            e.preventDefault();
            this.ui.hideElement('signUpForm');
            this.ui.showElement('signInForm');
        });
        
        // Handle login form submit
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                await this.auth.login(email, password);
                this.loadApp();
            } catch (error) {
                this.ui.showError(error.message);
            }
        });
        
        // Handle register form submit
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                this.ui.showError('Passwords do not match.');
                return;
            }
            
            try {
                await this.auth.register(name, email, password);
                this.loadApp();
            } catch (error) {
                this.ui.showError(error.message);
            }
        });
    }
    
    loadApp() {
        // Hide auth screens
        this.ui.hideElement('splashScreen');
        this.ui.hideElement('signInForm');
        this.ui.hideElement('signUpForm');
        
        // Redirect to dashboard
        window.location.href = 'pages/dashboard.html';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});