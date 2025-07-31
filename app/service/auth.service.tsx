interface LoginResponse {
    accessToken: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error in the authentication request');
        }

        const data: LoginResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error [AUTH]:', error);
        throw error;
    }
}
