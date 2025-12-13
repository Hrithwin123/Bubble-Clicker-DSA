const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth`;

export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: {
        id: string;
        username: string;
    };
    error?: string;
}

export const register = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        return await response.json();
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        return await response.json();
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
};

// Local storage helpers
export const saveToken = (token: string) => {
    localStorage.setItem('authToken', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

export const removeToken = () => {
    localStorage.removeItem('authToken');
};

export const saveUser = (user: { id: string; username: string }) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): { id: string; username: string } | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
    localStorage.removeItem('user');
};

export const logout = () => {
    removeToken();
    removeUser();
};
