import { LoginRequest, UserRegisterRequest, EventCreateRequest, EventUpdateRequest, UserUpdateRequest, EventSearchRequest, RSVPRequest, CollegeSearchRequest } from "@/types/requests";
import { LoginResponse, User, Event, College, EventSearchResponse, CollegeSearchResponse } from "@/types/responses";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401 && token) {
    const error = new Error('Invalid JWT token. May have expired. Please login again.');
    (error as Error & { status?: number }).status = 401;
    throw error;
  }

  if (response.status === 403) {
    const error = new Error('Forbidden. You are not authorized to access this resource.');
    (error as Error & { status?: number }).status = 403;
    throw error;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  const data = await response.json();
  return data;
}

export const authAPI = {
  login: (loginData: LoginRequest) =>
    apiFetch<LoginResponse>('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email: loginData.email, password: loginData.password }),
    }),

  register: (formData: FormData) => {
    const config: RequestInit = {
      method: 'POST',
      body: formData,
    };
    
    return fetch(`${API_BASE_URL}/api/users/register`, config).then(async (response) => {
      if (response.status === 401) {
        const error = new Error('Invalid JWT token. May have expired. Please login again.');
        (error as Error & { status?: number }).status = 401;
        throw error;
      }

      if (response.status === 403) {
        const error = new Error('Forbidden. You are not authorized to access this resource.');
        (error as Error & { status?: number }).status = 403;
        throw error;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    }) as Promise<User>;
  },
  
  sendVerificationEmail: (userEmail: string) =>
    apiFetch<{verificationCode: string}>('/api/users/send-verification', {
      method: 'POST',
      body: JSON.stringify({ userEmail }),
    }),

  getCurrentUser: (token: string) =>
    apiFetch<User>('/api/users/me', {
      method: 'GET',
    }, token),
};


export const eventsAPI = {
  getAllEvents: (filters: EventSearchRequest) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/events/search?${queryString}` : '/api/events/search';
    return apiFetch<EventSearchResponse>(endpoint, { method: 'GET' });
  },

  getEventById: (id: number) =>
    apiFetch<Event>(`/api/events/${id}`, {
      method: 'GET',
    }),

  createEvent: (formData: FormData, token: string) => {
    const config: RequestInit = {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
    
    return fetch(`${API_BASE_URL}/api/events/create`, config).then(async (response) => {
      if (response.status === 401 && token) {
        const error = new Error('Invalid JWT token. May have expired. Please login again.');
        (error as Error & { status?: number }).status = 401;
        throw error;
      }

      if (response.status === 403) {
        const error = new Error('Forbidden. You are not authorized to access this resource.');
        (error as Error & { status?: number }).status = 403;
        throw error;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    }) as Promise<Event>;
  },

  updateEvent: (id: number, eventData: EventUpdateRequest) =>
    apiFetch<Event>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),

  deleteEvent: (id: number) =>
    apiFetch<void>(`/api/events/${id}`, {
      method: 'DELETE',
    }),

  rsvp: (rsvpData: RSVPRequest, token: string) =>
    apiFetch<void>('/api/events/rsvp', {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    }, token),
  
  unrsvp: (rsvpData: RSVPRequest, token: string) =>
    apiFetch<void>('/api/events/unrsvp', {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    }, token),
};

export const usersAPI = {
  getUserProfile: (id: number, token: string) =>
    apiFetch<User>(`/api/users/${id}`, {
      method: 'GET',
    }, token),

  updateUserProfile: (id: number, formData: FormData, token: string) => {
    const config: RequestInit = {
      method: 'PUT',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
    
    return fetch(`${API_BASE_URL}/api/users/${id}`, config).then(async (response) => {
      if (response.status === 401 && token) {
        const error = new Error('Invalid JWT token. May have expired. Please login again.');
        (error as Error & { status?: number }).status = 401;
        throw error;
      }

      if (response.status === 403) {
        const error = new Error('Forbidden. You are not authorized to access this resource.');
        (error as Error & { status?: number }).status = 403;
        throw error;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    }) as Promise<User>;
  },
};

export const collegesAPI = {
  getAllColleges: (filters: CollegeSearchRequest) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/colleges/search?${queryString}` : '/api/colleges/search';
    return apiFetch<CollegeSearchResponse>(endpoint, { method: 'GET' })
  }
};


export { apiFetch };