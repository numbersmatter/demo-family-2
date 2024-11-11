import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertTo12Hour(time24: string) {
  // Split the time string into hours and minutes
  const [hours, minutes] = time24.split(':').map(Number);

  // Determine AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12; 

  // Format the 12-hour time string
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}
