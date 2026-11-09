import { isAxiosError } from 'axios';

export const APP_NAME = 'Web Builder';

export const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const getErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    if (!error.response)
      return 'Cannot reach the server. Is the backend running?';
    const message = error.response.data?.message;
    if (Array.isArray(message)) return message[0];
    if (message) return message;
  }
  return 'Something went wrong. Please try again.';
};
