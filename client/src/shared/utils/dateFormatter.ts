function adjustDateToUserTimezone(date: Date): Date {
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset);
}

export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);
  const adjustedDate = adjustDateToUserTimezone(date);
  return adjustedDate.toLocaleDateString('en-US', options);
}

export function formatDateParts(
  dateString: string,
  options: Intl.DateTimeFormatOptions
): string[] {
  const formatted = formatDate(dateString, options);
  return formatted.split(/[,\s]+/);
}