import { toast } from 'react-toastify';

export const handleError = (error) => {
  toast.error(typeof error === 'string' ? error : 'An error occurred', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const handleSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

// // Add API base URL for backend
export const API_BASE_URL = "https://prep-portal-backend.onrender.com";
