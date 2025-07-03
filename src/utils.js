import { toast } from 'react-toastify';

export const handleError = (error) => {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred';
  toast.error(errorMessage, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored"
  });
};

export const handleSuccess = (message) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored"
  });
};

// // Add API base URL for backend
export const API_BASE_URL = "https://prep-portal-backend.onrender.com";
