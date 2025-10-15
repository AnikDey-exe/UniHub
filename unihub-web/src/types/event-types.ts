export enum EventType {
  SPORT = 'Sport',
  RELIGIOUS = 'Religious',
  HACKATHON = 'Hackathon',
  ENTERTAINMENT = 'Entertainment',
  CLUB = 'Club',
  NETWORKING = 'Networking',
  CAREER = 'Career',
  GENERAL = 'General'
}

export const EVENT_TYPES = Object.values(EventType)

export const EVENT_TYPE_OPTIONS = EVENT_TYPES.map(type => ({
  label: type,
  value: type
}))
