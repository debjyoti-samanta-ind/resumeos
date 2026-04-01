const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Present';
  const parts = dateStr.split('-');
  const year = parts[0] ?? '';
  const monthIdx = parseInt(parts[1] ?? '1', 10) - 1;
  return `${MONTHS[monthIdx] ?? ''} ${year}`;
}

export function formatDateRange(start: string, end: string | null): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}
