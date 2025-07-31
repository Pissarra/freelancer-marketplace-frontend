interface FreelancerFilter {
    location?: string;
    timezone?: string;
    hourlyRateMin?: number;
    hourlyRateMax?: number;
    ratingMin?: number;
    ratingMax?: number;
    availableOnly?: boolean;
    skills?: string[];
}

interface Skill {
    id: number;
    description: string;
}
interface Freelancer {
    id: number;
    name: string;
    location: string;
    timezone: string;
    hourlyRate: number;
    rating: number;
    available: boolean;
    skills: Skill[];
}

export async function getAllFreelancers(page: number, limit: 10, filters?: FreelancerFilter): Promise<Freelancer[]> {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/freelancers?page=${page}&limit=${limit}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filters),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error fetching freelancers');
        }

        const data: Freelancer[] = await response.json();
        return data;
    } catch (error) {
        console.error('Error [FREELANCER]:', error);
        throw error;
    }
}
