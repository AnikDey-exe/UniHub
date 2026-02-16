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
    eventsAttended?: Registration[];
    college?: CollegeSummary;
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
    college?: CollegeSummary;
}
  
export interface Event {
    id: number;
    name: string;
    type: string;
    description?: string;
    location: string;
    image?: string;
    capacity: number;
    numAttendees: number;
    eventStartDateUtc: string;
    eventEndDateUtc: string;
    eventTimezone: string;
    creator?: UserSummary;
    attendees?: Registration[];
    maxTickets: number;
    requiresApproval: boolean;
    questions?: Question[];
    approvalSuccessMessage?: string;
}

export interface EventSearchResponse {
    events: Event[];
    lastNumAttendees: number;
    lastStartDate: string;
    hasNext: boolean;
}

export interface EventSummary {
    id: number;
    name: string;
    type: string;
    description?: string;
    location: string;
    image?: string;
    capacity: number;
    numAttendees: number;
    eventStartDateUtc: string;
    eventEndDateUtc: string;
    eventTimezone: string;
    maxTickets: number;
    requiresApproval: boolean;
    approvalSuccessMessage?: string;
}

export interface College {
    id: number;
    name: string;
    location: string;
    thumbnail?: string;
    students?: UserSummary[];
}

export interface CollegeSummary {
    id: number;
    name: string;
    location: string;
    thumbnail?: string;
}

export interface CollegeSearchResponse {
    colleges: College[];
    lastNameASC: string;
    hasNext: boolean;
}

export interface Registration {
    id: number;
    displayName: string;
    tickets: number;
    status: RegistrationStatus;
    event: EventSummary;
    attendee: UserSummary;
    answers?: Answer[];
}

export interface IsRegisteredResponse {
    exists: boolean;
    displayName: string | null;
    status: RegistrationStatus | null;
}

export interface RegistrationSummary {
    id: number;
    displayName: string;
    tickets: number;
    status: RegistrationStatus;
}

export interface Answer {
    id: number;
    singleAnswer?: string;
    multiAnswer?: string[];
    question: Question;
    registration: RegistrationSummary;
}

export interface Question {
    id: number;
    question: string;
    type: QuestionType;
    choices?: string[];
    required: boolean;
}

export enum RegistrationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
}

export enum QuestionType {
    TYPED = 'TYPED',
    CHOICE = 'CHOICE',
    MULTISELECT = 'MULTISELECT'
}