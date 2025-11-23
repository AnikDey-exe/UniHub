import { LoginRequest, UserRegisterRequest, EventCreateRequest, EventUpdateRequest, UserUpdateRequest, EventSearchRequest, RSVPRequest } from "@/types/requests";
import { LoginResponse, User, Event, College, EventSearchResponse } from "@/types/responses";

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
    (error as any).status = 401;
    throw error;
  }

  if (response.status === 403) {
    const error = new Error('Forbidden. You are not authorized to access this resource.');
    (error as any).status = 403;
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

  register: (userData: UserRegisterRequest) =>
    apiFetch<User>('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
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

  createEvent: (eventData: EventCreateRequest, token: string) =>
    apiFetch<Event>('/api/events/create', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }, token),

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

  updateUserProfile: (id: number, userData: UserUpdateRequest, token: string) =>
    apiFetch<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }, token),
};

export const collegesAPI = {
  getAllColleges: () =>
    apiFetch<College[]>(`/api/colleges/`, {
      method: 'GET',
    }),
};


export { apiFetch };