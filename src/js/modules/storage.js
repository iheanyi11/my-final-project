// Storage Module: Handles data storage and retrieval
export class StorageModule {
    constructor() {
        // Initialize IndexedDB
        this.dbName = 'fitness_tracker_db';
        this.dbVersion = 1;
        this.db = null;
        
        // Initialize the database
        this.initDB();
    }
    
    // Initialize IndexedDB
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                reject(event.target.error);
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('IndexedDB initialized successfully');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                
                // Workouts store
                if (!db.objectStoreNames.contains('workouts')) {
                    const workoutsStore = db.createObjectStore('workouts', { keyPath: 'id' });
                    workoutsStore.createIndex('userId', 'userId', { unique: false });
                    workoutsStore.createIndex('date', 'date', { unique: false });
                }
                
                // Nutrition logs store
                if (!db.objectStoreNames.contains('nutritionLogs')) {
                    const nutritionStore = db.createObjectStore('nutritionLogs', { keyPath: 'id' });
                    nutritionStore.createIndex('userId', 'userId', { unique: false });
                    nutritionStore.createIndex('date', 'date', { unique: false });
                }
                
                // Goals store
                if (!db.objectStoreNames.contains('goals')) {
                    const goalsStore = db.createObjectStore('goals', { keyPath: 'id' });
                    goalsStore.createIndex('userId', 'userId', { unique: false });
                    goalsStore.createIndex('startDate', 'startDate', { unique: false });
                    goalsStore.createIndex('endDate', 'endDate', { unique: false });
                }
                
                // Routes store
                if (!db.objectStoreNames.contains('routes')) {
                    const routesStore = db.createObjectStore('routes', { keyPath: 'id' });
                }
            }
        }
    )}
}