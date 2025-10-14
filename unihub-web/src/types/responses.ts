export interface LoginResponse {
    token: string;
    expiresIn: number;
}
  
export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    phoneNumber: string;
    about?: string;
    profilePicture?: string;
    eventsCreated?: EventSummary[];
    eventsAttended?: EventSummary[];
}

export interface UserSummary {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    phoneNumber: string;
    about?: string;
    profilePicture?: string;
}
  
export interface Event {
    id: number;
    name: string;
    type: string;
    description?: string;
    location: string;
    capacity: number;
    creator?: UserSummary;
    attendees?: UserSummary[];
}

export interface EventSearchResponse {
    events: Event[];
    lastNumAttendees: number;
    lastStartDate: string;
    hasMore: boolean;
}

export interface EventSummary {
    id: number;
    name: string;
    type: string;
    description?: string;
    location: string;
    capacity: number;
}

export interface College {
    id: number;
    name: string;
    location: string;
    thumbnail?: string;
    students?: UserSummary[];
}