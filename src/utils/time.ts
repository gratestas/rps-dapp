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

export function formatTime(unixTimestamp: number): string {
  const days = Math.floor(unixTimestamp / (3600 * 24));
  const hours = Math.floor((unixTimestamp % (3600 * 24)) / 3600);
  const minutes = Math.floor((unixTimestamp % 3600) / 60);
  const seconds = unixTimestamp % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
