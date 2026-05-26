export function formatDateRange(startDate?: string, endDate?: string, isPresent?: boolean): string {
  const format = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  const start = startDate ? format(startDate) : '';
  const end = isPresent ? 'Present' : endDate ? format(endDate) : '';
  return `${start} - ${end}`;
}
