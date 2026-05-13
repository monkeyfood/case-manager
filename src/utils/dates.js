// Date utilities - emphasizes relative time for ADHD time-blindness

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function daysFromNow(dateStr) {
  if (!dateStr) return null;
  return daysBetween(new Date(), new Date(dateStr));
}

export function getUrgencyLevel(daysUntilDue) {
  if (daysUntilDue === null) return 'none';
  if (daysUntilDue < 0) return 'overdue';
  if (daysUntilDue === 0) return 'today';
  if (daysUntilDue <= 2) return 'critical';
  if (daysUntilDue <= 7) return 'urgent';
  if (daysUntilDue <= 14) return 'soon';
  return 'normal';
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return null;
  const days = daysFromNow(dateStr);
  if (days === null) return null;
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} OVERDUE`;
  if (days === 0) return 'DUE TODAY';
  if (days === 1) return 'Due TOMORROW';
  if (days <= 7) return `Due in ${days} days`;
  if (days <= 14) return `Due in ${days} days (${formatDate(dateStr)})`;
  return formatDate(dateStr);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function getUrgencyColor(level) {
  switch (level) {
    case 'overdue': return '#ff1744';
    case 'today': return '#ff6d00';
    case 'critical': return '#ff6d00';
    case 'urgent': return '#ffab00';
    case 'soon': return '#69f0ae';
    default: return null;
  }
}

export function getUrgencyEmoji(level) {
  switch (level) {
    case 'overdue': return '🚨';
    case 'today': return '🔥';
    case 'critical': return '⚡';
    case 'urgent': return '⏰';
    case 'soon': return '📅';
    default: return '';
  }
}
