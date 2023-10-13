export function convertUnixToDate(timestamp: string): string {
  const date = new Date(Number(timestamp) * 1000);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC',
    timeZoneName: 'short',
  };

  return date.toLocaleString('en-US', options);
}
