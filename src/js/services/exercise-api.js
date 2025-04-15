export const ExerciseAPI = {
    baseUrl: 'https://exercisedb.p.rapidapi.com',
    headers: {
        'X-RapidAPI-Key': '3af0ab0ebdmsh48b3eec883d7bcep194894jsn998181a7652c', // Replace with your RapidAPI key
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    },

    async fetchExercises() {
        try {
            const response = await fetch(`${this.baseUrl}/exercises`, {
                method: 'GET',
                headers: this.headers,
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch exercises: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching exercises:', error);
            throw error;
        }
    },

    async fetchExercisesByTarget(target) {
        try {
            const response = await fetch(`${this.baseUrl}/exercises/target/${target}`, {
                method: 'GET',
                headers: this.headers,
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch exercises for target: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching exercises by target:', error);
            throw error;
        }
    },
};