import { EventType } from './event-types';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserRegisterRequest {
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    about?: string;
}

export interface UserUpdateRequest {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phoneNumber?: string;
    about?: string;
    profilePicture?: string;
}

// have to add more to both of these
export interface EventCreateRequest {
    name: string;
    type: string;
    description?: string;
    location: string;
    capacity: number;
}

export interface EventUpdateRequest {
    name?: string;
    type?: string;
    description?: string;
    location?: string;
    capacity?: number;
}

export interface EventSearchRequest {
    types?: EventType[];
    startDate?: string;
    endDate?: string;
    minAttendees?: number;
    searchQuery?: string;
    sortBy?: string;
    limit?: number;
    lastNumAttendees?: number;
    lastStartDate?: string;
}

export interface RSVPRequest {
    eventId: number;
    userEmail: string;
}