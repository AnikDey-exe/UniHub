export const MOCK_REGISTRATIONS_OVER_TIME = [
  { month: "Jan", registrations: 42, engagement: 68 },
  { month: "Feb", registrations: 58, engagement: 72 },
  { month: "Mar", registrations: 71, engagement: 78 },
  { month: "Apr", registrations: 65, engagement: 75 },
  { month: "May", registrations: 89, engagement: 82 },
  { month: "Jun", registrations: 94, engagement: 88 },
  { month: "Jul", registrations: 112, engagement: 85 },
  { month: "Aug", registrations: 98, engagement: 90 },
  { month: "Sep", registrations: 124, engagement: 92 },
  { month: "Oct", registrations: 131, engagement: 94 },
]

export const MOCK_REGISTRATIONS_BY_WEEK = [
  { week: "W1", count: 28 },
  { week: "W2", count: 34 },
  { week: "W3", count: 41 },
  { week: "W4", count: 38 },
]

export const MOCK_REGISTRATIONS_BY_TYPE = [
  { type: "Workshop", count: 186 },
  { type: "Career Fair", count: 312 },
  { type: "Social", count: 124 },
  { type: "Info Session", count: 143 },
  { type: "Other", count: 127 },
]

export const MOCK_POPULAR_EVENTS = [
  { name: "Fall Career Fair", registrations: 312 },
  { name: "Tech Workshop", registrations: 248 },
  { name: "Campus Tour", registrations: 195 },
  { name: "Alumni Mixer", registrations: 167 },
  { name: "Study Abroad Info", registrations: 143 },
]

export const MOCK_CAPACITY_FILL_BY_EVENT = [
  { name: "Fall Career Fair", fill: 78, capacity: 400 },
  { name: "Tech Workshop", fill: 62, capacity: 400 },
  { name: "Campus Tour", fill: 98, capacity: 200 },
  { name: "Alumni Mixer", fill: 84, capacity: 200 },
  { name: "Study Abroad Info", fill: 72, capacity: 200 },
]

export const MOCK_ENGAGEMENT_BY_DAY = [
  { day: "Mon", rate: 82 },
  { day: "Tue", rate: 88 },
  { day: "Wed", rate: 91 },
  { day: "Thu", rate: 89 },
  { day: "Fri", rate: 85 },
  { day: "Sat", rate: 72 },
  { day: "Sun", rate: 68 },
]

export const MOCK_OVERVIEW_TREND = [
  { month: "May", value: 89 },
  { month: "Jun", value: 94 },
  { month: "Jul", value: 112 },
  { month: "Aug", value: 98 },
  { month: "Sep", value: 124 },
  { month: "Oct", value: 131 },
]

export const MOCK_METRICS = {
  clicks: { value: 12480, change: 12.4 },
  registrations: { value: 892, change: 8.2 },
  conversionRate: { value: 7.2, change: 0.8 },
  engagement: { value: 94, change: 5.1 },
}

export const MOCK_REGISTRATIONS_METRICS = {
  totalThisMonth: { value: 141, change: 7.3 },
  pendingApprovals: { value: 12, change: -2 },
  completed: { value: 129, change: 9.1 },
  avgPerEvent: { value: 28, change: 4.2 },
}

export const MOCK_ENGAGEMENT_METRICS = {
  avgRate: { value: 87, change: 3.2 },
  peakDay: { value: "Wed", change: 0 },
  activeUsers: { value: 2340, change: 11.5 },
  avgSessionMin: { value: 8.4, change: 0.5 },
}

export const MOCK_POPULAR_METRICS = {
  totalEvents: { value: 24, change: 2 },
  avgRegistrations: { value: 213, change: 6.8 },
  topEventRegistrations: { value: 312, change: 12 },
  capacityUtilization: { value: 79, change: 3.1, suffix: "%" },
}
