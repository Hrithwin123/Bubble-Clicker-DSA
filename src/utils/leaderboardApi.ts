const API_URL = 'http://localhost:3000/api/leaderboard';

export interface LeaderboardEntry {
    name: string;
    score: number;
    createdAt?: string;
}

export const fetchLeaderboard = async (limit: number = 100): Promise<LeaderboardEntry[]> => {
    try {
        const response = await fetch(`${API_URL}?limit=${limit}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        }
        throw new Error('Failed to fetch leaderboard');
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
};

export const submitScore = async (name: string, score: number, token?: string | null): Promise<boolean> => {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // If token provided, add to headers (authenticated submission)
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name, score }),
        });
        
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error submitting score:', error);
        return false;
    }
};
