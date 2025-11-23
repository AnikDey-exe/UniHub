import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export function formatEventDate(
  startDateUtc: string,
  endDateUtc: string,
  eventTimezone: string
): string {
  try {
    const start = dayjs(startDateUtc).tz(eventTimezone)
    const end = dayjs(endDateUtc).tz(eventTimezone)

    const isSameDay = start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')

    if (isSameDay) {
      return `${start.format('MMM D, YYYY')} at ${start.format('h:mm A')} - ${end.format('h:mm A')} ${eventTimezone}`
    } else {
      return `${start.format('MMM D, YYYY')} at ${start.format('h:mm A')} - ${end.format('MMM D, YYYY')} at ${end.format('h:mm A')} ${eventTimezone}`
    }
  } catch (error) {
    const start = dayjs(startDateUtc)
    const end = dayjs(endDateUtc)
    const isSameDay = start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')

    if (isSameDay) {
      return `${start.format('MMM D, YYYY')} at ${start.format('h:mm A')} - ${end.format('h:mm A')}`
    } else {
      return `${start.format('MMM D, YYYY')} at ${start.format('h:mm A')} - ${end.format('MMM D, YYYY')} at ${end.format('h:mm A')}`
    }
  }
}

