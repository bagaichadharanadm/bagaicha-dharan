export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  };
  return date.toLocaleDateString('en-US', options).toUpperCase();
};
