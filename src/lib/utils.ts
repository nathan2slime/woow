import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const toasterOptions = { className: 'toast' };

export const getStorage = <T>(key: string, data: T) => {
  if (typeof window === 'undefined') return;
  try {
    const stringfy = localStorage.getItem(key);

    if (stringfy) return JSON.parse(stringfy) as T;

    return data;
  } catch (error) {
    return data;
  }
};

export const setStorage = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;

  return localStorage.setItem(key, JSON.stringify(value));
};

export const getAvatarName = (value: string) => {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  const initials = parts.map((part) => part[0]!.toUpperCase());

  if (initials.length > 1) {
    return initials[0]! + initials[1];
  } else if (initials.length === 1) {
    const firstPart = parts[0];
    return firstPart!.length > 1
      ? firstPart![0]!.toUpperCase() + firstPart![1]!.toUpperCase()
      : firstPart![0]!.toUpperCase() + firstPart![0]!.toUpperCase();
  } else {
    return '';
  }
};
