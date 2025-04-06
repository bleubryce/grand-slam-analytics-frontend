
import axios, { AxiosError } from 'axios';

export interface ApiErrorResponse {
  status: string;
  message: string;
  error?: any;
}

/**
 * Handle API errors consistently across the application
 */
export const handleApiError = (error: any): Promise<never> => {
  console.error('API Error:', error);
  
  // Format the error message
  let errorMessage = 'An unknown error occurred';
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    // Try to get error message from response
    if (axiosError.response?.data?.message) {
      errorMessage = axiosError.response.data.message;
    } else if (axiosError.message) {
      errorMessage = axiosError.message;
    }
    
    // Network errors
    if (axiosError.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (!axiosError.response) {
      errorMessage = 'Network error. Please check your connection.';
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  // Return rejected promise with formatted error
  return Promise.reject({
    message: errorMessage,
    originalError: error
  });
};
